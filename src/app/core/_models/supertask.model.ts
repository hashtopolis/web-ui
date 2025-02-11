import { Pretask } from './pretask.model';

export interface SuperTask {
  _id: number;
  _self: string;
  pretasks?: Pretask[];
  supertaskId: number;
  supertaskName: string;
}



export interface SuperTaskData {
  type: string;
  id: number;
  attributes: SuperTaskDataAttributes;
  links: SuperTaskDataLinks;
  relationships: SuperTaskDataRelationships;
}

export interface SuperTaskDataAttributes {
  supertaskName: string;
}

export interface SuperTaskDataLinks {
  self: string;
  related?: string;
}

export interface SuperTaskDataRelationships {
  pretasks: SuperTaskDataRelAttributes;
}

export interface SuperTaskDataRelAttributes {
  links: SuperTaskDataLinks;
  data: SuperTaskDataRelAttributesData[];
}

export interface SuperTaskDataRelAttributesData {
  type: string;
  id: number;
}
