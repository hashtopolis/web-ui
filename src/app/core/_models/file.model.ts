import { JAccessGroup } from '@models/access-group.model';
import { BaseModel } from '@models/base.model';
import { AccessGroupId, FileId } from '@models/id.types';

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
  accessGroup?: JAccessGroup;
}
export interface TaskSelectFile {
  attackCmd: string;
  files: FileId[];
  otherFiles: FileId[];
  type: string;
}

/**
 * Interface definition for a file available for server import as returned by API helper method GET /importFile
 */
export interface ServerImportFile {
  file: string;
  size: number;
}
