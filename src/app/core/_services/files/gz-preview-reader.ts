import { Observable, defer, firstValueFrom, from } from 'rxjs';

import {
  FilePreviewPage,
  GzPreviewPage,
  PREVIEW_LINE_FEED,
  splitPreviewLines,
  walkLines
} from '@models/file-preview.model';
import { FileId } from '@models/id.types';

import type { FilePreviewService } from '@services/files/file-preview.service';
import { SequentialPreviewReader } from '@services/files/preview-reader';

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
  /**
   * True when the decoder ran to the clean end of the stream, so `output` is everything the prefix
   * decompresses to. False when reading stopped early or in an error.
   */
  complete: boolean;
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
    private readonly service: FilePreviewService,
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
      const inflated = await this.inflate(offset, maxLines);
      const page = this.cut(inflated, offset, maxLines);

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

    const bytes = await firstValueFrom(this.service.fetchRange(this.fileId, start, end));
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
   * Reading stops once the output holds `maxLines` line feeds past `offset`: a window can cover far
   * more decompressed output than any page shows, and a highly compressible file would otherwise
   * have its whole tail decompressed just to fill a handful of lines.
   *
   * @param offset - Decompressed byte the page starts at; line feeds before it are not counted.
   * @param maxLines - Line feeds past `offset` after which reading stops early.
   * @returns The decompressed bytes, and how the decoder ended.
   */
  private async inflate(offset: number, maxLines: number): Promise<Inflated> {
    if (this.prefix.length === 0) {
      return { output: new Uint8Array(0), errored: false, complete: false };
    }

    const reader = new Blob([this.prefix]).stream().pipeThrough(new DecompressionStream('gzip')).getReader();

    const chunks: Uint8Array[] = [];
    let produced = 0;
    let terminators = 0;
    let errored = false;
    let complete = false;

    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) {
          complete = true;
          break;
        }
        chunks.push(value);
        // Count line feeds only from `offset` onwards, scanning from wherever that falls in this chunk.
        let stopAt = -1;
        for (
          let at = value.indexOf(PREVIEW_LINE_FEED, Math.max(0, offset - produced));
          at !== -1 && stopAt === -1;
          at = value.indexOf(PREVIEW_LINE_FEED, at + 1)
        ) {
          if (++terminators >= maxLines) {
            stopAt = at;
          }
        }
        produced += value.length;
        if (stopAt === -1) {
          continue;
        }

        // When the page's last line ends exactly at the end of this chunk, nothing read so far tells
        // whether anything follows it, so one more read settles that before stopping.
        if (stopAt === value.length - 1) {
          const peek = await reader.read();
          if (peek.done) {
            complete = true;
            break;
          }
          chunks.push(peek.value);
          produced += peek.value.length;
        }
        await reader.cancel().catch(() => undefined);
        break;
      }
    } catch {
      // A window cut mid-stream always ends the decoder abruptly; the bytes decoded so far are all
      // the window holds and stand on their own. Only when the prefix covers the whole file does
      // an error mean the file itself is damaged, which the page cut then reports.
      errored = true;
    }

    const output = new Uint8Array(produced);
    let position = 0;
    for (const chunk of chunks) {
      output.set(chunk, position);
      position += chunk.length;
    }
    return { output, errored, complete };
  }

  /**
   * Cuts a page of whole lines out of the decompressed output, starting at `offset`.
   *
   * @param inflated - What the cached prefix decompressed to, and how the decoder ended.
   * @param offset - Decompressed byte the page starts at, always the start of a line.
   * @param maxLines - How many lines the page should hold at most.
   * @returns The resulting page.
   */
  private cut({ output: decompressed, errored, complete }: Inflated, offset: number, maxLines: number): GzPreviewPage {
    const wholeFileFetched = this.prefix.length >= this.totalBytes;
    // Once the cached prefix has hit its ceiling, whatever it decompresses to is all this reader will
    // ever show; a page it cannot fill ends the preview rather than asking for more.
    const limitReached = !wholeFileFetched && this.prefix.length >= MAX_WINDOW_BYTES;

    // An offset past everything decodable leaves nothing to show and nothing to page on to.
    if (offset >= decompressed.length) {
      return { ...this.emptyPage(), startByte: offset, endByte: offset, reachedFetchLimit: limitReached };
    }

    const { to: endOfWholeLines, lineCount } = walkLines(decompressed, offset, maxLines);
    const stoppedAtLimit = limitReached && lineCount < maxLines;

    // A page that came up short keeps the trailing unterminated line only when the whole file was
    // fetched, since only then can the fragment be known to be the file's last line — or when no
    // whole line turned up at all, since the fragment is then all there is to show. At the fetch
    // limit the fragment is merely where reading stopped, so it is dropped.
    const keepsFragment = lineCount < maxLines && (wholeFileFetched || (lineCount === 0 && !limitReached));
    const to = keepsFragment ? decompressed.length : endOfWholeLines;

    // The output is only known to be everything the file holds once the decoder ran to its end,
    // cleanly or into the damage; stopped early, it may have halted right after the last line of
    // this page with more still to decode.
    const atEndOfFile = wholeFileFetched && (complete || errored) && to >= decompressed.length;

    const content = decompressed.subarray(offset, to);
    return {
      kind: 'gzip',
      lines: splitPreviewLines(content),
      startByte: offset,
      endByte: to,
      hasPartialLine: lineCount === 0 && !wholeFileFetched && !limitReached,
      isBinary: content.includes(0),
      hasMore: !atEndOfFile && !stoppedAtLimit,
      compressedBytesFetched: this.prefix.length,
      compressedTotalBytes: this.totalBytes,
      hasDecompressionError: errored && wholeFileFetched,
      reachedFetchLimit: stoppedAtLimit
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
      hasDecompressionError: false,
      reachedFetchLimit: false
    };
  }
}
