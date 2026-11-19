import { JAccessGroup } from '@models/access-group.model';
import { BaseModel } from '@models/base.model';
import { AccessGroupId, FileId } from '@models/id.types';

import { CheckboxColumnType } from '@components/tables/ht-table/ht-table.models';

/**
 * Different file types
 * - `WORDLIST` Wordlist/dictionary
 * - `RULES`    Rules file
 * - `OTHER`    Any other file
 */
export const FileType = {
  WORDLIST: 0,
  RULES: 1,
  OTHER: 2
} as const;
export type FileType = (typeof FileType)[keyof typeof FileType];

/**
 * Where the bytes of a new file come from, matching the `sourceType` attribute the API expects.
 */
export const FileSource = {
  IMPORT: 'import',
  URL: 'url'
} as const;
export type FileSource = (typeof FileSource)[keyof typeof FileSource];

/**
 * Interface definition for an uploaded file
 * @extends BaseModel
 */
export interface JFile extends BaseModel {
  filename: string;
  size: number;
  isSecret: boolean;
  fileType: number;
  accessGroupId: AccessGroupId;
  lineCount: number;
  /**
   * BLAKE3-256 checksum of the stored bytes, 64 lowercase hex characters.
   *
   * `null` means the checksum has not been computed yet, not that it failed: the backend computes
   * it in a background job and resets it to `null` whenever the bytes on disk change.
   */
  checksum: string | null;
  accessGroup?: JAccessGroup;
}
export interface TaskSelectFile {
  attackCmd: string;
  files: FileId[];
  otherFiles: FileId[];
  type: CheckboxColumnType;
}

/**
 * Interface definition for a file available for server import as returned by API helper method GET /importFile
 */
export interface ServerImportFile {
  file: string;
  size: number;
}
