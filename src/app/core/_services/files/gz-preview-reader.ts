import { HTTP_SKIP_CACHE_HEADER_CONFIG, HTTP_SKIP_ERROR_HEADER_CONFIG } from '@constants/http.config';
import { Observable, defer, firstValueFrom, from } from 'rxjs';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { FilePreviewPage, GzPreviewPage, PREVIEW_LINE_FEED, splitPreviewLines } from '@models/file-preview.model';
import { FileId } from '@models/id.types';

import { SequentialPreviewReader } from '@services/files/preview-reader';
import { SERV } from '@services/main.config';
import { ConfigService } from '@services/shared/config.service';

/** First two bytes of every gzip stream, used to refuse a file that is not actually compressed. */
const GZIP_MAGIC = [0x1f, 0x8b] as const;

/** Compressed bytes the first range request of a session asks for. */
const INITIAL_WINDOW_BYTES = 65_536;

/** Multiplier applied to the window whenever a page could not be filled from it. */
const WINDOW_GROWTH = 4;

/** Ceiling for the compressed window, so one preview never fetches without bound. */
const MAX_WINDOW_BYTES = 4_194_304;

/** What decompressing the cached prefix yielded. */
interface Inflated {
  output: Uint8Array;
  /**
   * True when the decoder ended in an error. A window cut mid-stream always does; only a prefix
   * covering the whole file means the file itself is corrupt or truncated.
   */
  errored: boolean;
}

/**
 * Reads pages from a gzip-compressed stored file, for the duration of one preview dialog.
 *
 * A gzip stream cannot be entered in the middle — its blocks are bit-aligned and its back-references
 * reach into decompressed output from before them — so every page decompresses the file from its
 * first byte onwards, which is why this reader is sequential. To keep that from re-downloading the
 * same bytes over and over, the reader caches the compressed prefix fetched so far and only ever
 * requests its continuation when a page needs more decompressed output than the cache holds.
 */
export class GzPreviewReader implements SequentialPreviewReader {
  readonly kind = 'sequential' as const;

  /** Compressed bytes fetched so far: always a prefix of the stored file, starting at its first byte. */
  private prefix = new Uint8Array(0);

  /** Set once the backend has no continuation to hand over, so the window stops growing. */
  private exhausted = false;

  constructor(
    private readonly http: HttpClient,
    private readonly cs: ConfigService,
    private readonly fileId: FileId,
    private readonly totalBytes: number
  ) {}

  /**
   * Reads one page of decompressed lines.
   *
   * @param offset - Byte offset in the *decompressed* data the page starts at. It is always a
   *   previous page's `endByte`, so it sits at the start of a line by construction.
   * @param maxLines - How many lines the page should hold at most.
   * @returns The whole lines the decompressed prefix yielded.
   */
  readForward(offset: number, maxLines: number): Observable<GzPreviewPage> {
    return defer(() => from(this.loadPageAsync(offset, maxLines)));
  }

  readNext(page: FilePreviewPage, maxLines: number): Observable<GzPreviewPage> {
    // A page that consumed nothing sits at the end of everything decodable, so there is no window to
    // skip ahead with; reading on from its end simply yields the same empty page again.
    return this.readForward(page.endByte, maxLines);
  }

  /**
   * Grows the cached window until it fills the page or nothing is left to fetch, then cuts the page.
   */
  private async loadPageAsync(offset: number, maxLines: number): Promise<GzPreviewPage> {
    // An empty file has no range to request; the backend answers 416 for `bytes=0-0` on it.
    if (this.totalBytes <= 0) {
      return this.emptyPage();
    }

    let windowBytes = Math.max(this.prefix.length, INITIAL_WINDOW_BYTES);

    for (;;) {
      await this.fetchUpTo(windowBytes);
      const { output, errored } = await this.inflate(offset + maxLines);
      const page = this.cut(output, errored, offset, maxLines);

      // The window only grows when the page came up short and there is anything left to fetch.
      if (
        page.lines.length >= maxLines ||
        this.prefix.length >= this.totalBytes ||
        this.exhausted ||
        windowBytes >= MAX_WINDOW_BYTES
      ) {
        return page;
      }
      windowBytes = Math.min(windowBytes * WINDOW_GROWTH, MAX_WINDOW_BYTES);
    }
  }

  /**
   * Extends the cached prefix until it holds `targetBytes` compressed bytes, fetching only the
   * continuation of what is already cached.
   *
   * @param targetBytes - How many compressed bytes the cache should hold afterwards.
   */
  private async fetchUpTo(targetBytes: number): Promise<void> {
    const start = this.prefix.length;
    const end = Math.min(targetBytes, this.totalBytes) - 1;
    if (this.exhausted || end < start) {
      return;
    }

    const headers = new HttpHeaders({
      ...HTTP_SKIP_CACHE_HEADER_CONFIG,
      ...HTTP_SKIP_ERROR_HEADER_CONFIG,
      Range: `bytes=${start}-${end}`
    });

    const buffer = await firstValueFrom(
      this.http.get(this.cs.getEndpoint() + SERV.GET_FILES.URL, {
        params: new HttpParams().set('file', this.fileId),
        headers,
        responseType: 'arraybuffer'
      })
    );

    const bytes = new Uint8Array(buffer);
    // A cache that answers a conditional range request with the whole representation instead of the
    // requested slice would corrupt the prefix silently; refuse it rather than use it.
    if (bytes.length > end - start + 1) {
      throw new Error('The server returned more bytes than the requested range.');
    }
    if (start === 0 && (bytes[0] !== GZIP_MAGIC[0] || bytes[1] !== GZIP_MAGIC[1])) {
      throw new Error('The file does not hold gzip-compressed data.');
    }

    const prefix = new Uint8Array(start + bytes.length);
    prefix.set(this.prefix);
    prefix.set(bytes, start);
    this.prefix = prefix;

    if (bytes.length === 0) {
      this.exhausted = true;
    }
  }

  /**
   * Decompresses the cached prefix from its first byte, the only place a gzip stream can be entered.
   *
   * Reading stops once `maxTerminators` line feeds have been seen: a window can cover far more
   * decompressed output than any page shows, and a highly compressible file would otherwise have
   * its whole tail decompressed just to fill a handful of lines.
   *
   * @param maxTerminators - Line feeds after which reading stops early.
   * @returns The decompressed bytes, and whether the decoder ended in an error.
   */
  private async inflate(maxTerminators: number): Promise<Inflated> {
    if (this.prefix.length === 0) {
      return { output: new Uint8Array(0), errored: false };
    }

    const reader = new Blob([this.prefix]).stream().pipeThrough(new DecompressionStream('gzip')).getReader();

    const chunks: Uint8Array[] = [];
    let terminators = 0;
    let errored = false;

    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        chunks.push(value);
        for (const byte of value) {
          if (byte === PREVIEW_LINE_FEED) {
            terminators++;
          }
        }
        if (terminators >= maxTerminators) {
          await reader.cancel().catch(() => undefined);
          break;
        }
      }
    } catch {
      // A window cut mid-stream always ends the decoder abruptly; the bytes decoded so far are all
      // the window holds and stand on their own. Only when the prefix covers the whole file does
      // an error mean the file itself is damaged, which the page cut then reports.
      errored = true;
    }

    const output = new Uint8Array(chunks.reduce((length, chunk) => length + chunk.length, 0));
    let position = 0;
    for (const chunk of chunks) {
      output.set(chunk, position);
      position += chunk.length;
    }
    return { output, errored };
  }

  /**
   * Cuts a page of whole lines out of the decompressed output, starting at `offset`.
   *
   * @param decompressed - Everything the cached prefix decompresses to.
   * @param errored - Whether decompression ended abruptly rather than at a clean end of stream.
   * @param offset - Decompressed byte the page starts at, always the start of a line.
   * @param maxLines - How many lines the page should hold at most.
   * @returns The resulting page.
   */
  private cut(decompressed: Uint8Array, errored: boolean, offset: number, maxLines: number): GzPreviewPage {
    const wholeFileFetched = this.prefix.length >= this.totalBytes;

    // An offset past everything decodable leaves nothing to show and nothing to page on to.
    if (offset >= decompressed.length) {
      return { ...this.emptyPage(), startByte: offset, endByte: offset };
    }

    // Walk line terminators until the page is full or the decompressed output runs out.
    let to = offset;
    let lineCount = 0;
    while (lineCount < maxLines) {
      const breakAt = decompressed.indexOf(PREVIEW_LINE_FEED, to);
      if (breakAt === -1) {
        break;
      }
      to = breakAt + 1;
      lineCount++;
    }

    // A page that came up short keeps the trailing unterminated line only when the whole file was
    // fetched, since only then can the fragment be known to be the file's last line.
    if (lineCount < maxLines && (wholeFileFetched || lineCount === 0)) {
      to = decompressed.length;
    }

    const content = decompressed.subarray(offset, to);
    return {
      kind: 'gzip',
      lines: splitPreviewLines(content),
      startByte: offset,
      endByte: to,
      hasPartialLine: lineCount === 0 && !wholeFileFetched,
      isBinary: content.includes(0),
      hasMore: !(wholeFileFetched && to >= decompressed.length),
      compressedBytesFetched: this.prefix.length,
      compressedTotalBytes: this.totalBytes,
      hasDecompressionError: errored && wholeFileFetched
    };
  }

  private emptyPage(): GzPreviewPage {
    return {
      kind: 'gzip',
      lines: [],
      startByte: 0,
      endByte: 0,
      hasPartialLine: false,
      isBinary: false,
      hasMore: false,
      compressedBytesFetched: this.prefix.length,
      compressedTotalBytes: this.totalBytes,
      hasDecompressionError: false
    };
  }
}
