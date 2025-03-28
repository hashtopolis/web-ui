import { Chunk, ChunkDataAttributes, JChunk } from './chunk.model';
import { Hashlist, HashlistDataAttributes, JHashlist } from './hashlist.model';
import { BaseModel } from './base.model';

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

export interface HashData {
  type: string;
  id: number;
  attributes: DataAttributes;
  links?: DataLinks;
  relationships?: Relationships;
}

export interface DataAttributes {
  hashlistId: number;
  hash: string;
  salt: string;
  plaintext: string;
  timeCracked: number;
  chunkId: number;
  isCracked: boolean;
  crackPos: number;
  chunk?: ChunkDataAttributes;
  hashlist?: HashlistDataAttributes
}

export interface DataLinks {
  self: string;
}

export interface Relationships {
  chunk: RelationshipAttributes;
  hashlist: RelationshipAttributes;
}

export interface RelationshipAttributes {
  links: RelationshipAttributesLinks;
}

export interface RelationshipAttributesLinks {
  self: string;
  related: string;
}
