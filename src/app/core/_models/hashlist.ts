export interface BaseHashlist {
  accessGroupId: number,
  brainFeatures: string,
  format: string,
  name: string,
  hashTypeId: number,
  isHexSalt: boolean,
  isSecret: boolean,
  isSalted: boolean,
  separator: string,
  useBrain: boolean,
  hashCount: number,
  cracked: number,
  notes: string,
  isArchived: boolean,
  sourceType: string,
  sourceData: string
}

export interface CreateHashlist extends BaseHashlist {

}

// export interface Hashlist extends BaseHashlist {
//     id: number;
//     hashCount: number;
//     crackedCount: number;
//     notes: string;
// }
