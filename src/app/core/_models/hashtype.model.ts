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
  attributes: HashtypeDataAttributes;
  links: HashtypeDataLinks;
}

export interface HashtypeDataAttributes {
  description: string;
  isSalted: boolean;
  isSlowHash: boolean;
}

export interface HashtypeDataLinks {
  self: string;
}
