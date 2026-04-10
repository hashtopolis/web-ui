import { BaseModel } from '@models/base.model';
import { JChunk } from '@models/chunk.model';
import { JHashlist } from '@models/hashlist.model';
import { ChunkId, HashlistId } from '@models/id.types';

/**
 * Interface definition for a simple hash model
 * @extends BaseModel
 * @prop hash string value of the model's hash value
 * @prop plaintext string value of model's plaintext for the hash or empty
 */
interface SimpleHashModel extends BaseModel {
  hash: string;
  plaintext: string;
}

/**
 * Interface definition of hash object
 * @extends SimpleHashModel
 * @prop hashlistId ID of hashlist this hash belongs to
 * @prop salt Salt of hash
 * @prop isCracked True, if hash is cracked, else false
 * @prop chunkId ID of chunk which handled the hash
 * @prop crackPos Crack position
 * @prop chunk Optional included chunk object the hash is cracked
 * @prop hashlist Optional included hashlist object the hash belongs to
 */
export interface JHash extends SimpleHashModel {
  hashlistId: HashlistId;
  salt: string;
  timeCracked: number;
  isCracked: boolean;
  chunkId: ChunkId;
  crackPos: number;
  chunk?: JChunk | null;
  hashlist?: JHashlist | null;
}

/**
 * Interface definition for a hash model used for the hash search component
 * @extends SimpleHashModel
 * @prop hashlists Array of JHashList this hash belongs to
 * @prop hashInfo string containing human readable hash information (cracked/not cracked)
 */
export interface SearchHashModel extends SimpleHashModel {
  hashlists: Array<JHashlist>;
  hashInfo: string;
}
