import { BaseModel } from '@src/app/core/_models/base.model';

/**
 * Interface definition for cracking preprocessor
 * @extends BaseModel
 * @prop name             Name of preprocessor
 * @prop url              Download link
 * @prop binaryName       Name of binary
 * @prop keyspaceCommand  CLI option to specify keyspace
 * @prop skipCommand      CLI option to specify skip
 * @prop limitCommand     CLI option to specify limit
 */
export interface JPreprocessor extends BaseModel {
  name: string;
  url: string;
  binaryName: string;
  keyspaceCommand: string;
  skipCommand: string;
  limitCommand: string;
}
