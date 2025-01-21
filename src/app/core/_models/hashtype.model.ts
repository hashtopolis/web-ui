export interface Hashtype {
  _id: number;
  _self: string;
  hashTypeId: number;
  description: string;
  isSalted: boolean;
  isSlowHash: boolean;
}


export interface HashtypeData {
  type: string;
  id: number;
  attributes: DataAttributes;
  links: DataLinks;
}

export interface DataAttributes {
  description: string;
  isSalted: boolean;
  isSlowHash: boolean;
}

export interface DataLinks {
  self: string;
}
