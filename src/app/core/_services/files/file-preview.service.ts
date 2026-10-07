import { HTTP_SKIP_CACHE_HEADER_CONFIG, HTTP_SKIP_ERROR_HEADER_CONFIG } from '@constants/http.config';
import { Observable, mergeMap, of, throwError } from 'rxjs';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { PREVIEW_LINE_FEED, PlainPreviewPage, splitPreviewLines } from '@models/file-preview.model';
import { JFile } from '@models/file.model';
import { FileId } from '@models/id.types';

import { GzPreviewReader } from '@services/files/gz-preview-reader';
import { PreviewReader } from '@services/files/preview-reader';
import { RangePreviewReader } from '@services/files/range-preview-reader';
import { SERV } from '@services/main.config';
import { ConfigService } from '@services/shared/config.service';

/** Options for a single preview page request. */
export interface FilePreviewRequest {
  fileId: FileId;
  /** Byte offset to start reading at. */
  offset: number;
  /** How many lines the page should hold at most. */
  maxLines: number;
  /**
   * How many bytes to ask the backend for. Sized by the caller from the file's average line length,
   * so one request normally covers `maxLines` lines; a window that falls short simply yields fewer.
   */
  windowBytes: number;
  /** Total file size, taken from the file record rather than a header the browser cannot read. */
  totalBytes: number;
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
 * Reads slices of a stored file through the backend's range-capable download helper.
 *
 * Wordlists in a Hashtopolis instance routinely run to tens of gigabytes, so the preview never
 * downloads a file: it asks for one window of bytes at a time via the `Range` header that
 * `GET /helper/getFile` honours, and trims each window back to whole lines.
 */
@Injectable({
  providedIn: 'root'
})
export class FilePreviewService {
  private readonly http = inject(HttpClient);
  private readonly cs = inject(ConfigService);

  /**
   * Opens a reader on a stored file, picking the kind its format allows: a gzip-compressed file can
   * only be decompressed from its first byte, so it gets a sequential reader that caches the
   * compressed prefix fetched so far; any other file gets a seekable reader over byte windows.
   *
   * @param file - The file to read, whose `size` and `lineCount` drive the ranges that get requested.
   * @returns The reader, owned by its caller — normally one preview dialog.
   */
  openReader(file: JFile): PreviewReader {
    if (file.filename.toLowerCase().endsWith('.gz')) {
      return new GzPreviewReader(this.http, this.cs, file.id, file.size);
    }
    return new RangePreviewReader(this, file);
  }

  /**
   * Loads one page of a plain file.
   *
   * @param request - Which file, where to read, and how much to read.
   * @returns The whole lines the requested window yielded.
   */
  loadPage(request: FilePreviewRequest): Observable<PlainPreviewPage> {
    const { fileId, totalBytes, windowBytes } = request;

    // An empty file has no range to request; the backend answers 416 for `bytes=0-0` on it.
    if (totalBytes <= 0) {
      return of(this.emptyPage(totalBytes));
    }

    const start = Math.min(Math.max(request.offset, 0), totalBytes - 1);
    const end = Math.min(start + windowBytes - 1, totalBytes - 1);

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
        mergeMap((buffer) => {
          const bytes = new Uint8Array(buffer);
          // A cache that answers a conditional range request with the whole representation instead of
          // the requested slice would shift every line number silently; refuse it rather than show it.
          if (bytes.length > end - start + 1) {
            return throwError(() => new Error('The server returned more bytes than the requested range.'));
          }
          return of(this.toPage(bytes, start, request));
        })
      );
  }

  /**
   * Cuts a fetched window back to the whole lines it contains, at most `maxLines` of them.
   *
   * Lines are split on raw bytes before decoding: a `0x0A` byte is unambiguous in UTF-8, so cutting
   * there cannot corrupt a multi-byte character the way cutting on an arbitrary byte would.
   *
   * @param bytes - The bytes the backend returned.
   * @param start - Offset the window was read from.
   * @param request - The request the window answers, for its total size and alignment flag.
   * @returns The resulting page.
   */
  private toPage(bytes: Uint8Array, start: number, request: FilePreviewRequest): PlainPreviewPage {
    const { totalBytes, maxLines } = request;

    if (bytes.length === 0) {
      return { ...this.emptyPage(totalBytes), startByte: start, endByte: start, hasMore: start < totalBytes };
    }

    const isFinalWindow = start + bytes.length >= totalBytes;

    // A window that was seeked to rather than paged to usually lands mid-line; that fragment belongs
    // to the preceding page and is dropped so the first line shown is a whole one.
    let from = 0;
    if (!request.isLineAligned && start > 0) {
      const firstBreak = bytes.indexOf(PREVIEW_LINE_FEED);
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
        const breakAt = bytes.indexOf(PREVIEW_LINE_FEED, to);
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
      kind: 'plain',
      lines: splitPreviewLines(content),
      startByte: start + from,
      endByte: start + to,
      totalBytes,
      hasPartialLine: lineCount === 0 && !isFinalWindow,
      isBinary: content.includes(0),
      hasMore: start + to < totalBytes
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
    let cursor = bytes[bytes.length - 1] === PREVIEW_LINE_FEED ? bytes.length - 2 : bytes.length - 1;
    let lineCount = 0;

    while (lineCount < maxLines && cursor >= 0) {
      const breakAt = bytes.lastIndexOf(PREVIEW_LINE_FEED, cursor);
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
    const firstBreak = bytes.indexOf(PREVIEW_LINE_FEED);
    return { from: firstBreak === -1 ? bytes.length : firstBreak + 1, lineCount };
  }

  private emptyPage(totalBytes: number): PlainPreviewPage {
    return {
      kind: 'plain',
      lines: [],
      startByte: 0,
      endByte: 0,
      totalBytes,
      hasPartialLine: false,
      isBinary: false,
      hasMore: false
    };
  }
}
