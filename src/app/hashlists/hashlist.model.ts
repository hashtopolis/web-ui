export interface BaseHashlist {
  hashlistId: number;
  hashtypeId: number;
  name: string;
  format: number;
  hashCount: number;
}

export interface CreateHashlist extends BaseHashlist {
  dataSourceType: string;
  dataSource: string;
}

export interface Hashlist {
  _id: number;
  _self: string;
  accessGroupId: number;
  brainFeatures: number;
  cracked: number;
  format: number;
  hashCount: number;
  hashTypeId: number;
  hashlistId: number;
  isArchived: boolean;
  isHexSalt: boolean;
  isSalted: boolean;
  isSecret: boolean;
  name: string;
  notes: string;
  separator: string;
  useBrain: false;
}
