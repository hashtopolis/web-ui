import { z } from 'zod';

import { BaseModel } from '@models/base.model';
import { JHashtype } from '@models/hashtype.model';
import { AccessGroupId, CrackerBinaryTypeId } from '@models/id.types';

/** Name of the cracker binary type task forms preselect when it is available. */
export const DEFAULT_CRACKER_BINARY_TYPE_NAME = 'hashcat';

/**
 * Type name of the cracker binaries whose hashtypes are determined by the background scan of their archive and
 * cannot be edited manually. Matches the backend (CrackerUtils::HASHCAT_BINARY_TYPE).
 */
export const HASHCAT_CRACKER_BINARY_TYPE_NAME = 'hashcat';

/** Sources a new cracker binary archive can come from. */
export const CrackerSource = {
  EXTERNAL_LINK: 'externalLink',
  UPLOAD: 'upload',
  SERVER_DOWNLOAD: 'serverDownload',
  SERVER_IMPORT: 'serverImport'
} as const;

export type CrackerSource = (typeof CrackerSource)[keyof typeof CrackerSource];

/**
 * Interface definition for cracker binary
 * @extends BaseModel
 * @prop binaryName           Name on binary (e.g. 'hashcat')
 * @prop crackerBinaryTypeId  ID of binary type
 * @prop downloadUrl          URL the agents download the binary from
 * @prop version              Version of binary
 * @prop filename             Name of the archive stored on the server, null for external download urls
 * @prop accessGroupId        ID of the access group containing the binary
 * @prop crackerBinaryType    Included cracker binary type
 * @prop hashtypes            Included hashtypes the binary supports
 */
export interface JCrackerBinary extends BaseModel {
  binaryName: string;
  crackerBinaryTypeId: CrackerBinaryTypeId;
  downloadUrl: string | null;
  version: string;
  filename: string | null;
  accessGroupId: AccessGroupId;
  crackerBinaryType?: JCrackerBinaryType;
  hashtypes?: JHashtype[];
}

/**
 * Interface definition for cracker binary type
 * @extends BaseModel
 */
export interface JCrackerBinaryType extends BaseModel {
  crackerVersions: JCrackerBinary[];
  //Only crackers with chunking are supported right now: isChunkingAvailable: boolean;
  typeName: string;
}

/**
 * True if the hashtypes of the binary are determined by the background scan, i.e. read-only in the UI.
 * Needs the included crackerBinaryType.
 */
export function isHashcatCrackerBinary(binary: Pick<JCrackerBinary, 'crackerBinaryType'>): boolean {
  return binary.crackerBinaryType?.typeName === HASHCAT_CRACKER_BINARY_TYPE_NAME;
}

/**
 * Zod schema for validating deserialized (flat) cracker binary objects.
 * Use after jsona.deserialize() to validate that relationship data was included.
 */
export const zCrackerBinary = z.object({
  id: z.number(),
  type: z.string(),
  binaryName: z.string(),
  crackerBinaryTypeId: z.number(),
  downloadUrl: z.string().nullable(),
  version: z.string(),
  filename: z.string().nullable(),
  accessGroupId: z.number()
});

export const zCrackerBinaryType = z.object({
  id: z.number(),
  type: z.string(),
  typeName: z.string(),
  isChunkingAvailable: z.boolean(),
  crackerVersions: z.array(zCrackerBinary)
});

export const zCrackerBinaryTypeList = z.array(zCrackerBinaryType);
