import { Chunk } from './chunk.model';
import { Hashlist } from './hashlist.model';

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
