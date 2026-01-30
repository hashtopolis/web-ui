import { JAccessGroup } from '@models/access-group.model';
import { BaseModel } from '@models/base.model';

/**
 * Different file types
 * - `WORDLIST` Wordlist/dictionary
 * - `RULES`    Rules file
 * - `OTHER`    Any other file
 * @enum
 */
export enum FileType {
  WORDLIST,
  RULES,
  OTHER
}

/**
 * Interface definition for an uploaded file
 * @extends BaseModel
 */
export interface JFile extends BaseModel {
  filename: string;
  size: number;
  isSecret: boolean;
  fileType: number;
  accessGroupId: number;
  lineCount: number;
  accessGroup?: JAccessGroup;
}
export interface TaskSelectFile {
  attackCmd: string;
  files: number[];
  otherFiles: number[];
  type: string;
}

/**
 * Interface definition for a file available for server import as returned by API helper method GET /importFile
 */
export interface ServerImportFile {
  file: string;
  size: number;
}
