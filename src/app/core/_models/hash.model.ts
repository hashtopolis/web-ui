import { Chunk, JChunk } from '@models/chunk.model';
import { Hashlist, JHashlist } from '@models/hashlist.model';
import { BaseModel } from '@models/base.model';

export interface Hash {
  _id: number;
  _self: string;
  chunkId: number;
  agentId?: number;
  taskId?: number;
  chunk?: Chunk;
  crackPos: number;
  hash: string;
  hashId: number;
  hashlistId: number;
  hashlist?: Hashlist;
  isCracked: boolean;
  plaintext: string;
  salt: string;
  timeCracked: number;
}

/**
 * Interface definition of hash object
 * @prop hashlistId ID of hashlist this hash belongs to
 * @prop hash Value of hash
 * @prop salt Salt of hash
 * @prop plaintext Cracked plaintext of hash
 * @prop isCracked True, if hash is cracked, else false
 * @prop crackPos Crack position
 * @prop chunk Optional included chunk object the hash is cracked
 * @prop hashlist Optional included hashlist object the hash belongs to
 */
export interface JHash extends BaseModel {
  hashlistId: number;
  hash: string;
  salt: string;
  plaintext: string;
  timeCracked: number;
  chunkId: number;
  isCracked: boolean;
  crackPos: number;
  chunk?: JChunk;
  hashlist?: JHashlist;
}
