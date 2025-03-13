import { Hashtype } from './hashtype.model';
import { BaseModel } from './base.model';

export interface BaseHashlist {
  accessGroupId: number;
  brainFeatures: string;
  format: string;
  name: string;
  hashTypeId: number;
  isHexSalt: boolean;
  isSecret: boolean;
  isSalted: boolean;
  separator: string;
  useBrain: boolean;
  hashCount: number;
  cracked: number;
  notes: string;
  isArchived: boolean;
  sourceType: string;
  sourceData: string;
}

export type CreateHashlist = BaseHashlist;

// export interface Hashlist extends BaseHashlist {
//     id: number;
//     hashCount: number;
//     crackedCount: number;
//     notes: string;
// }

export interface Hashlist {
  _id: number;
  _self: string;
  hashlistId?: number;
  accessGroupId: number;
  brainFeatures: string;
  format: number;
  name: string;
  hashTypeId: number;
  hashType?: Hashtype;
  hashTypeDescription?: string;
  isHexSalt: boolean;
  isSecret: boolean;
  isSalted: boolean;
  separator: string;
  useBrain: boolean;
  hashCount: number;
  cracked: number;
  notes: string;
  isArchived: boolean;
  sourceType: string;
  sourceData: string;
  hashlists?: Hashlist[];
}

export interface JHashlist extends BaseModel {
  hashlistId?: number;
  accessGroupId: number;
  brainFeatures: string;
  format: number;
  name: string;
  hashTypeId: number;
  hashType?: Hashtype;
  hashTypeDescription?: string;
  isHexSalt: boolean;
  isSecret: boolean;
  isSalted: boolean;
  separator: string;
  useBrain: boolean;
  hashCount: number;
  cracked: number;
  notes: string;
  isArchived: boolean;
  sourceType: string;
  sourceData: string;
  hashlists?: Hashlist[];
}

export interface HashlistData {
  type: string;
  id: number;
  attributes: HashlistDataAttributes;
  links?: DataLinks;
  relationships?: HashlistRelationships;
}

export interface HashlistDataAttributes {
  name: string;
  format: number;
  hashTypeId: number;
  hashCount: number;
  separator: string;
  cracked: number;
  isSecret: boolean;
  isHexSalt: boolean;
  isSalted: boolean;
  accessGroupId: number;
  notes: string;
  useBrain: boolean;
  brainFeatures: number;
  isArchived: boolean;
  hashTypeDescription?: string;
  hashlists?: HashlistData[];
}

export interface DataLinks {
  self: string;
}

export interface HashlistRelationships {
  accessGroup: HashlistRelationshipAttributes;
  hashType: HashlistRelationshipAttributes;
  hashes: HashlistRelationshipAttributes;
  hashlists: HashlistRelationshipAttributes;
  tasks: HashlistRelationshipAttributes;
}

export interface HashlistRelationshipAttributes {
  links: HashlistRelationshipLinks;
  data: HashlistRelationshipAttributesData[];
}

export interface HashlistRelationshipLinks {
  self: string;
  related: string;
}

export interface HashlistRelationshipAttributesData {
  type: string;
  id: number;
}
