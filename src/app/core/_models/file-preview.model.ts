/** What every preview page carries, whichever kind of file it was read from. */
interface PreviewPageBase {
  /** Complete lines held by the page, line terminators stripped. */
  lines: string[];
  /** Byte offset of the first character of `lines[0]`. */
  startByte: number;
  /** Byte offset one past the last byte the page consumed, i.e. where the next page starts. */
  endByte: number;
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
  /** Whether another page can follow this one. */
  hasMore: boolean;
}

/**
 * One page of a plain file's contents, decoded from a single HTTP range request.
 *
 * A page is always cut on line boundaries, so `endByte` can be fed straight back in as the next
 * page's offset without a line ever being split across two pages.
 */
export interface PlainPreviewPage extends PreviewPageBase {
  kind: 'plain';
  /** Total size of the file in bytes, as reported by the file record. */
  totalBytes: number;
}

/**
 * One page of a gzip-compressed file's contents. Its offsets count *decompressed* bytes, and the
 * decompressed total is unknowable until the whole file has been fetched.
 */
export interface GzPreviewPage extends PreviewPageBase {
  kind: 'gzip';
  /** How many compressed bytes have been fetched from the backend so far. */
  compressedBytesFetched: number;
  /** Compressed size of the file in bytes, as reported by the file record. */
  compressedTotalBytes: number;
  /**
   * True when the whole compressed file was fetched yet decompression still ended in an error,
   * meaning the file itself is corrupt or truncated on disk.
   */
  hasDecompressionError: boolean;
}

export type FilePreviewPage = PlainPreviewPage | GzPreviewPage;

/** Byte value of the line terminator preview pages are cut on. */
export const PREVIEW_LINE_FEED = 0x0a;

/** Lenient UTF-8 decoder for preview content: a window can cut a code point mid-line. */
const DECODER = new TextDecoder('utf-8', { fatal: false });

/**
 * Decodes a slice of preview content and splits it into display lines, tolerating both LF and
 * CRLF terminators.
 *
 * @param content - Bytes spanning whole lines.
 * @returns The lines, without their terminators.
 */
export function splitPreviewLines(content: Uint8Array): string[] {
  const lines = DECODER.decode(content).split('\n');
  // A trailing terminator produces an empty final element that is not a line of its own.
  if (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines.map((line) => (line.endsWith('\r') ? line.slice(0, -1) : line));
}

/** Line counts offered in the preview's page-size selector, smallest first. */
export const FILE_PREVIEW_PAGE_SIZES: readonly number[] = [50, 100, 250, 500] as const;

/** Page size a preview starts on. */
export const FILE_PREVIEW_DEFAULT_PAGE_SIZE = 100;
