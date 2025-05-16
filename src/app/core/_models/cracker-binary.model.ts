import { BaseModel } from '@models/base.model';

/**
 * Interface definition for cracker binary
 * @extends BaseModel
 * @prop binaryName           Name on binary (e.g. 'hashcat')
 * @prop crackerBinaryTypeId  ID of binary type
 * @prop downloadUrl          URL to download the binary from the server
 * @prop version              Version of binary
 */
export interface JCrackerBinary extends BaseModel {
  binaryName: string;
  crackerBinaryTypeId: number;
  downloadUrl: string;
  version: string;
}

/**
 * Interface definition for cracker binary type
 * @extends BaseModel
 */
export interface JCrackerBinaryType extends BaseModel {
  crackerVersions: JCrackerBinary[];
  isChunkingAvailable: boolean;
  typeName: string;
}
