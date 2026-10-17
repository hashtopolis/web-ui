import { Observable } from 'rxjs';

import { FilePreviewPage } from '@models/file-preview.model';

/** What every reader can do: walk a file forwards, one page of whole lines at a time. */
interface PreviewReaderBase {
  /**
   * Reads a page starting at `offset`, which must sit at the start of a line — normally a previous
   * page's `endByte`.
   */
  readForward(offset: number, maxLines: number): Observable<FilePreviewPage>;
  /** Reads the page that follows `page`, making progress even past a page that consumed nothing. */
  readNext(page: FilePreviewPage, maxLines: number): Observable<FilePreviewPage>;
}

/**
 * A reader that can only move forwards from the first byte, because its source cannot be entered
 * at an arbitrary offset. A gzip stream is the case in point.
 */
export interface SequentialPreviewReader extends PreviewReaderBase {
  readonly kind: 'sequential';
}

/** A reader whose source can be read at any offset, so the file's end and arbitrary windows are reachable. */
export interface SeekablePreviewReader extends PreviewReaderBase {
  readonly kind: 'seekable';
  /** Reads the page of whole lines that ends right before `end`, for stepping back to an unvisited page. */
  readEndingAt(end: number, maxLines: number): Observable<FilePreviewPage>;
  /** Reads the last lines of the file. */
  readLastLines(maxLines: number): Observable<FilePreviewPage>;
}

/**
 * Reads pages from one stored file. Discriminated on `kind`, so a caller that needs to seek can
 * check for the ability once and then call the seeking methods without casts.
 */
export type PreviewReader = SequentialPreviewReader | SeekablePreviewReader;
