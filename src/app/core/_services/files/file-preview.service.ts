import { HTTP_SKIP_CACHE_HEADER_CONFIG, HTTP_SKIP_ERROR_HEADER_CONFIG } from '@constants/http.config';
import { Observable, map, of, switchMap } from 'rxjs';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { FilePreviewPage } from '@models/file-preview.model';
import { JFile } from '@models/file.model';
import { FileId } from '@models/id.types';

import {
  COMPRESSION_HEADER_BYTES,
  CompressedFormat,
  DecodeOptions,
  DecodeResult,
  detectCompression
} from '@services/files/file-preview-formats';
import { MemorySource, PreviewSource, RangeSource } from '@services/files/file-preview-source';
import { SERV } from '@services/main.config';
import { ConfigService } from '@services/shared/config.service';

/** Byte value of the line terminator pages are cut on. */
const LINE_FEED = 0x0a;

/** Compressed bytes fetched from the start of a compressed file, the only part of it the preview shows. */
const PEEK_BYTES = 1_048_576;

/** Decompressed bytes after which decoding stops, so a highly compressible file cannot exhaust memory. */
const MAX_DECOMPRESSED_BYTES = 16_777_216;

/** Options for a single preview page request. */
export interface FilePreviewRequest {
  /** Byte offset to start reading at. */
  offset: number;
  /** How many lines the page should hold at most. */
  maxLines: number;
  /**
   * How many bytes to read. Sized by the caller from the source's own estimate, so one read normally
   * covers `maxLines` lines; a window that falls short simply yields fewer.
   */
  windowBytes: number;
  /**
   * Whether `offset` is known to sit at the start of a line. Sequential paging keeps this true; a
   * seek to an arbitrary offset does not, and the leading fragment is then dropped.
   */
  isLineAligned: boolean;
  /**
   * Fill the page from the end of the window backwards instead of from its start. Used for the jump
   * to the end of the file, where the last lines are what matters, not the first ones in the window.
   */
  takeLastLines?: boolean;
}

/**
 * Reads stored files for the preview without downloading them.
 *
 * Wordlists in a Hashtopolis instance routinely run to tens of gigabytes, so the preview never
 * downloads a file. A plain file is read one window of bytes at a time via the `Range` header that
 * `GET /helper/getFile` honours. A compressed file cannot be entered anywhere but at its first byte,
 * so only its first part is fetched and decompressed. Either way each window is trimmed back to whole
 * lines.
 */
@Injectable({
  providedIn: 'root'
})
export class FilePreviewService {
  private readonly http = inject(HttpClient);
  private readonly cs = inject(ConfigService);

  /** Lenient decoder: a window can still cut a code point when a line is longer than the window. */
  private readonly decoder = new TextDecoder('utf-8', { fatal: false });

  /**
   * Opens the source a file's pages are read from. The file's first bytes decide whether it is read
   * as it is stored or decompressed, the way hashcat decides.
   *
   * @param file - The file to preview.
   * @returns The source, once the file's format is known and, for a compressed file, its first part
   *   decompressed.
   */
  openSource(file: JFile): Observable<PreviewSource> {
    const plain = new RangeSource(file, (start, end) => this.fetchRange(file.id, start, end));

    // An empty file has no range to request; the backend answers 416 for `bytes=0-0` on it.
    if (file.size <= 0) {
      return of(plain);
    }

    return this.fetchRange(file.id, 0, Math.min(COMPRESSION_HEADER_BYTES, file.size) - 1).pipe(
      switchMap((head) => {
        const format = detectCompression(head);
        return format ? this.openCompressed(file, format) : of(plain);
      })
    );
  }

  /**
   * Loads one page from a source.
   *
   * @param source - The bytes to read, as opened by {@link openSource}.
   * @param request - Where to read, and how much to read.
   * @returns The whole lines the requested window yielded.
   */
  loadPage(source: PreviewSource, request: FilePreviewRequest): Observable<FilePreviewPage> {
    const { totalBytes } = source;

    if (totalBytes <= 0) {
      return of(this.emptyPage(totalBytes));
    }

    const start = Math.min(Math.max(request.offset, 0), totalBytes - 1);
    const end = Math.min(start + request.windowBytes - 1, totalBytes - 1);

    return source.read(start, end).pipe(map((bytes) => this.toPage(bytes, start, totalBytes, request)));
  }

  /**
   * Fetches the first part of a compressed file and decompresses it into memory.
   *
   * @param file - The compressed file.
   * @param format - The format its first bytes carry.
   * @returns A source over the decompressed bytes.
   */
  private openCompressed(file: JFile, format: CompressedFormat): Observable<PreviewSource> {
    return this.fetchRange(file.id, 0, Math.min(PEEK_BYTES, file.size) - 1).pipe(
      switchMap((input) =>
        this.decodeUntilUnsubscribed(format, input, {
          isWholeFile: input.length >= file.size,
          maxOutputBytes: MAX_DECOMPRESSED_BYTES
        })
      ),
      map(({ bytes, reachedEnd }) => {
        if (bytes.length === 0 && !reachedEnd) {
          throw new Error('Could not decompress the file. It may be damaged.');
        }

        return new MemorySource(reachedEnd ? bytes : this.toLastWholeLine(bytes), reachedEnd, format.name);
      })
    );
  }

  /**
   * Runs a decoder for as long as anyone listens: unsubscribing, as closing the preview does, aborts
   * the decoding instead of leaving it to run to the output cap for nothing.
   *
   * @param format - The format to decode.
   * @param input - The start of the file, or all of it.
   * @param options - Everything the decoder needs but the signal, which this method supplies.
   * @returns The decoder's result.
   */
  private decodeUntilUnsubscribed(
    format: CompressedFormat,
    input: Uint8Array<ArrayBuffer>,
    options: Omit<DecodeOptions, 'signal'>
  ): Observable<DecodeResult> {
    return new Observable<DecodeResult>((subscriber) => {
      const controller = new AbortController();
      format.decode(input, { ...options, signal: controller.signal }).then(
        (result) => {
          subscriber.next(result);
          subscriber.complete();
        },
        // After an unsubscribe this is the abort itself, which a closed subscriber ignores.
        (error: unknown) => subscriber.error(error)
      );

      return () => controller.abort();
    });
  }

  /**
   * Cuts decompressed bytes that stop short of the end of the file back to just after their last line
   * feed, so a line cut off by the end of the peek never shows as a whole one. Bytes without any line
   * feed are kept as they are, since there would otherwise be nothing to show.
   */
  private toLastWholeLine(bytes: Uint8Array): Uint8Array {
    const lastBreak = bytes.lastIndexOf(LINE_FEED);
    return lastBreak === -1 ? bytes : bytes.subarray(0, lastBreak + 1);
  }

  /**
   * Fetches one byte range of a stored file.
   *
   * @param fileId - File to read.
   * @param start - First byte of the range.
   * @param end - Last byte of the range, inclusive.
   * @returns The bytes of the range.
   */
  private fetchRange(fileId: FileId, start: number, end: number): Observable<Uint8Array<ArrayBuffer>> {
    const headers = new HttpHeaders({
      ...HTTP_SKIP_CACHE_HEADER_CONFIG,
      ...HTTP_SKIP_ERROR_HEADER_CONFIG,
      Range: `bytes=${start}-${end}`
    });

    return this.http
      .get(this.cs.getEndpoint() + SERV.GET_FILES.URL, {
        params: new HttpParams().set('file', fileId),
        headers,
        responseType: 'arraybuffer'
      })
      .pipe(
        map((buffer) => {
          const bytes = new Uint8Array(buffer);
          // A cache that answers a conditional range request with the whole representation instead of
          // the requested slice would shift every line number silently; refuse it rather than show it.
          if (bytes.length > end - start + 1) {
            throw new Error('The server returned more bytes than the requested range.');
          }

          return bytes;
        })
      );
  }

  /**
   * Cuts a fetched window back to the whole lines it contains, at most `maxLines` of them.
   *
   * Lines are split on raw bytes before decoding: a `0x0A` byte is unambiguous in UTF-8, so cutting
   * there cannot corrupt a multi-byte character the way cutting on an arbitrary byte would.
   *
   * @param bytes - The bytes the source returned.
   * @param start - Offset the window was read from.
   * @param totalBytes - How many bytes the source holds.
   * @param request - The request the window answers, for its alignment flag.
   * @returns The resulting page.
   */
  private toPage(bytes: Uint8Array, start: number, totalBytes: number, request: FilePreviewRequest): FilePreviewPage {
    const { maxLines } = request;

    if (bytes.length === 0) {
      return { ...this.emptyPage(totalBytes), startByte: start, endByte: start };
    }

    const isFinalWindow = start + bytes.length >= totalBytes;

    // A window that was seeked to rather than paged to usually lands mid-line; that fragment belongs
    // to the preceding page and is dropped so the first line shown is a whole one.
    let from = 0;
    if (!request.isLineAligned && start > 0) {
      const firstBreak = bytes.indexOf(LINE_FEED);
      from = firstBreak === -1 ? bytes.length : firstBreak + 1;
    }

    let to: number;
    let lineCount: number;
    if (request.takeLastLines) {
      ({ from, lineCount } = this.lastLinesStart(bytes, maxLines, start > 0));
      to = bytes.length;
    } else {
      // Walk line terminators until the page is full or the window runs out.
      to = from;
      lineCount = 0;
      while (lineCount < maxLines) {
        const breakAt = bytes.indexOf(LINE_FEED, to);
        if (breakAt === -1) {
          break;
        }
        to = breakAt + 1;
        lineCount++;
      }

      if (lineCount < maxLines && (isFinalWindow || lineCount === 0)) {
        // Either the file's last line carries no terminator, or no terminator turned up at all and the
        // fragment is all there is to show. Either way the rest of the window belongs on this page.
        to = bytes.length;
      }
    }

    const content = bytes.subarray(from, to);
    return {
      lines: this.splitLines(content),
      startByte: start + from,
      endByte: start + to,
      totalBytes,
      hasPartialLine: lineCount === 0 && !isFinalWindow,
      isBinary: content.includes(0)
    };
  }

  /**
   * Finds where the last `maxLines` lines of a window begin, by walking its line terminators
   * backwards from the end.
   *
   * @param bytes - The window, whose final byte is the end of the page.
   * @param maxLines - How many lines the page should hold.
   * @param mayStartMidLine - Whether the window itself began partway into the file, in which case
   *   running out of terminators leaves a fragment that has to be dropped.
   * @returns The offset the page starts at, and how many whole lines were found.
   */
  private lastLinesStart(
    bytes: Uint8Array,
    maxLines: number,
    mayStartMidLine: boolean
  ): { from: number; lineCount: number } {
    // A trailing terminator closes the final line rather than starting another one.
    let cursor = bytes[bytes.length - 1] === LINE_FEED ? bytes.length - 2 : bytes.length - 1;
    let lineCount = 0;

    while (lineCount < maxLines && cursor >= 0) {
      const breakAt = bytes.lastIndexOf(LINE_FEED, cursor);
      if (breakAt === -1) {
        break;
      }
      lineCount++;
      if (lineCount === maxLines) {
        return { from: breakAt + 1, lineCount };
      }
      cursor = breakAt - 1;
    }

    // The window ran out before the page was full. Its own first line is whole only when the window
    // starts at the start of the file.
    if (!mayStartMidLine) {
      return { from: 0, lineCount: lineCount + 1 };
    }
    const firstBreak = bytes.indexOf(LINE_FEED);
    return { from: firstBreak === -1 ? bytes.length : firstBreak + 1, lineCount };
  }

  /**
   * Decodes a slice and splits it into display lines, tolerating both LF and CRLF terminators.
   *
   * @param content - Bytes spanning whole lines.
   * @returns The lines, without their terminators.
   */
  private splitLines(content: Uint8Array): string[] {
    const lines = this.decoder.decode(content).split('\n');
    // A trailing terminator produces an empty final element that is not a line of its own.
    if (lines.length > 0 && lines[lines.length - 1] === '') {
      lines.pop();
    }
    return lines.map((line) => (line.endsWith('\r') ? line.slice(0, -1) : line));
  }

  private emptyPage(totalBytes: number): FilePreviewPage {
    return {
      lines: [],
      startByte: 0,
      endByte: 0,
      totalBytes,
      hasPartialLine: false,
      isBinary: false
    };
  }
}
