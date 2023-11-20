import { Hashtype } from './hashtype.model';

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
