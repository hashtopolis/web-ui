/**
 * One page of a file's contents, decoded from a single HTTP range request.
 *
 * A page is always cut on line boundaries, so `endByte` can be fed straight back in as the next
 * page's offset without a line ever being split across two pages.
 */
export interface FilePreviewPage {
  /** Complete lines held by the page, line terminators stripped. */
  lines: string[];
  /** Byte offset of the first character of `lines[0]`. */
  startByte: number;
  /** Byte offset one past the last byte the page consumed, i.e. where the next page starts. */
  endByte: number;
  /** Total size of the file in bytes, as reported by the file record. */
  totalBytes: number;
  /**
   * True when the fetched window held no line terminator at all, so the file's lines are longer than
   * the window and what is shown is a fragment rather than a whole line.
   */
  hasPartialLine: boolean;
  /**
   * True when the page contains NUL bytes. Hashtopolis stores archives (`.7z`) alongside plain
   * wordlists, and decoding those as text yields nothing a user can read.
   */
  isBinary: boolean;
}

/** Line counts offered in the preview's page-size selector, smallest first. */
export const FILE_PREVIEW_PAGE_SIZES: readonly number[] = [50, 100, 250, 500] as const;

/** Page size a preview starts on. */
export const FILE_PREVIEW_DEFAULT_PAGE_SIZE = 100;
