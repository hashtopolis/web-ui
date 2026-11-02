import { Observable } from 'rxjs';

import { FilePreviewPage, PlainPreviewPage } from '@models/file-preview.model';
import { JFile } from '@models/file.model';

import type { FilePreviewRequest, FilePreviewService } from '@services/files/file-preview.service';
import { SeekablePreviewReader } from '@services/files/preview-reader';

/** Headroom over the file's average line length, so one request usually fills a whole page. */
const WINDOW_SLACK = 1.4;
const MIN_WINDOW_BYTES = 4_096;
const MAX_WINDOW_BYTES = 1_048_576;
/** Average line length assumed for a file whose lines the backend has not counted. */
const FALLBACK_LINE_BYTES = 64;

/** Fields of a range request the reader fills in itself from the file it was opened on. */
type WindowRequest = Omit<FilePreviewRequest, 'fileId' | 'totalBytes'>;

/**
 * Reads pages from a plain stored file through stateless byte-range requests.
 *
 * Any offset of the file can be read directly, so this reader can jump to the end and reconstruct
 * pages that were never visited. It sizes each window from the file's own average line length so a
 * single request normally covers the whole page.
 */
export class RangePreviewReader implements SeekablePreviewReader {
  readonly kind = 'seekable' as const;

  constructor(
    private readonly service: FilePreviewService,
    private readonly file: JFile
  ) {}

  readForward(offset: number, maxLines: number): Observable<PlainPreviewPage> {
    return this.load({ offset, maxLines, windowBytes: this.windowBytes(maxLines), isLineAligned: true });
  }

  readNext(page: FilePreviewPage, maxLines: number): Observable<PlainPreviewPage> {
    if (page.endByte > page.startByte) {
      return this.readForward(page.endByte, maxLines);
    }
    // A window holding no line terminator consumes nothing, so skip past it rather than re-reading it.
    const windowBytes = this.windowBytes(maxLines);
    return this.load({ offset: page.startByte + windowBytes, maxLines, windowBytes, isLineAligned: false });
  }

  readEndingAt(end: number, maxLines: number): Observable<PlainPreviewPage> {
    const windowBytes = Math.min(this.windowBytes(maxLines), end);
    const offset = end - windowBytes;
    return this.load({ offset, maxLines, windowBytes, isLineAligned: offset === 0, takeLastLines: true });
  }

  readLastLines(maxLines: number): Observable<PlainPreviewPage> {
    return this.readEndingAt(this.file.size, maxLines);
  }

  /** Byte window to request for a page of `maxLines` lines. */
  private windowBytes(maxLines: number): number {
    const { size, lineCount } = this.file;
    const averageLineBytes = lineCount > 0 ? size / lineCount : FALLBACK_LINE_BYTES;
    const estimate = Math.ceil(maxLines * averageLineBytes * WINDOW_SLACK);
    return Math.min(Math.max(estimate, MIN_WINDOW_BYTES), MAX_WINDOW_BYTES);
  }

  private load(request: WindowRequest): Observable<PlainPreviewPage> {
    return this.service.loadPage({ fileId: this.file.id, totalBytes: this.file.size, ...request });
  }
}
