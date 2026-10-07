import { JFile } from '@models/file.model';

/** Input for {@link FilePreviewDialogComponent}. */
export interface FilePreviewDialogData {
  /** The file to page through. Its `size` and `lineCount` drive the byte windows that get requested. */
  file: JFile;
}
