import { Observable, of } from 'rxjs';

import { JFile } from '@models/file.model';

/**
 * The bytes a file preview reads its pages from.
 *
 * The preview's paging and line cutting only ever talk to a source, so they work the same whether the
 * bytes come straight from the stored file or from decompressing it.
 */
export interface PreviewSource {
  /** How many bytes the source holds. */
  readonly totalBytes: number;
  /**
   * Whether `totalBytes` is the end of the file's content. False when only the start of a compressed
   * file could be decompressed, so the file goes on past what the source holds.
   */
  readonly reachesEndOfFile: boolean;
  /** Display name of the compression the bytes were decoded from, or `null` for a plain file. */
  readonly compression: string | null;
  /**
   * Reads a range of bytes.
   *
   * @param start - First byte of the range.
   * @param end - Last byte of the range, inclusive.
   */
  read(start: number, end: number): Observable<Uint8Array>;
  /** How many bytes to read for a page of `lines` lines. */
  windowBytes(lines: number): number;
}

/** Fetches an inclusive byte range of a stored file. */
export type RangeFetcher = (start: number, end: number) => Observable<Uint8Array>;

/**
 * A plain stored file, read a byte range at a time from the backend.
 *
 * Its windows are sized from the file's own average line length so a single range request normally
 * covers a whole page.
 */
export class RangeSource implements PreviewSource {
  /** Headroom over the file's average line length, so one request usually fills a whole page. */
  private static readonly WINDOW_SLACK = 1.4;
  private static readonly MIN_WINDOW_BYTES = 4_096;
  private static readonly MAX_WINDOW_BYTES = 1_048_576;
  /** Average line length assumed for a file whose lines the backend has not counted. */
  private static readonly FALLBACK_LINE_BYTES = 64;

  readonly totalBytes: number;
  readonly reachesEndOfFile = true;
  readonly compression = null;

  /**
   * @param file - The stored file, whose `size` and `lineCount` size the windows.
   * @param fetchRange - Fetches a byte range of that file.
   */
  constructor(
    private readonly file: JFile,
    private readonly fetchRange: RangeFetcher
  ) {
    this.totalBytes = file.size;
  }

  read(start: number, end: number): Observable<Uint8Array> {
    return this.fetchRange(start, end);
  }

  windowBytes(lines: number): number {
    const { size, lineCount } = this.file;
    const averageLineBytes = lineCount > 0 ? size / lineCount : RangeSource.FALLBACK_LINE_BYTES;
    const estimate = Math.ceil(lines * averageLineBytes * RangeSource.WINDOW_SLACK);

    return Math.min(Math.max(estimate, RangeSource.MIN_WINDOW_BYTES), RangeSource.MAX_WINDOW_BYTES);
  }
}

/** Bytes held in memory, such as the decompressed start of a compressed file. */
export class MemorySource implements PreviewSource {
  readonly totalBytes: number;

  /**
   * @param bytes - The content.
   * @param reachesEndOfFile - Whether the content is everything the file holds.
   * @param compression - Display name of the compression the content was decoded from.
   */
  constructor(
    private readonly bytes: Uint8Array,
    readonly reachesEndOfFile: boolean,
    readonly compression: string
  ) {
    this.totalBytes = bytes.length;
  }

  read(start: number, end: number): Observable<Uint8Array> {
    return of(this.bytes.subarray(start, end + 1));
  }

  /** Reads cost nothing here, so a window can span everything the source holds. */
  windowBytes(): number {
    return this.totalBytes;
  }
}
