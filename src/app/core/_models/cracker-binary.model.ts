import { BaseModel } from '@src/app/core/_models/base.model';

export interface CrackerBinary {
  _id: number;
  _self: string;
  binaryName: string;
  crackerBinaryId: number;
  crackerBinaryTypeId: number;
  downloadUrl: string;
  version: string;
}

export interface JCrackerBinary extends BaseModel {
  binaryName: string;
  crackerBinaryTypeId: number;
  downloadUrl: string;
  version: string;
}

export interface CrackerBinaryType {
  _id: number;
  _self: string;
  crackerBinaryTypeId: number;
  crackerVersions: CrackerBinary[];
  isChunkingAvailable: boolean;
  typeName: string;
}

export interface JCrackerBinaryType extends BaseModel {
  crackerVersions: JCrackerBinary[];
  isChunkingAvailable: boolean;
  typeName: string;
}


export interface CrackerBinaryTypeData {
  type: string;
  id: number;
  attributes: CrackerBinaryTypeDataAttributes;
  links: CrackerBinaryTypeDataLinks;
  relationships: CrackerBinaryTypeRelationships;
}

export interface CrackerBinaryTypeDataAttributes {
  typeName: string;
  isChunkingAvailable: boolean;
  crackerVersions?: CrackerBinaryData[];
}

export interface CrackerBinaryTypeDataLinks {
  self: string;
}

export interface CrackerBinaryTypeRelationships {
  crackerVersions: CrackerVersions;
  tasks: Tasks;
}

export interface CrackerVersions {
  links: CrackerRelationshipLinks;
  data: CrackerVersionsData[];
}

export interface CrackerVersionsData {
  type: string;
  id: number;
}

export interface CrackerRelationshipLinks {
  self: string;
  related: string;
}

export interface Tasks {
  links: CrackerRelationshipLinks;
}



export interface CrackerBinaryData {
  type: string;
  id: number;
  attributes: CrackerBinaryDataAttributes;
  links: CrackerBinaryDataLinks;
  relationships: CrackerBinaryDataRelationships;
}

export interface CrackerBinaryDataAttributes {
  crackerBinaryTypeId: number;
  version: string;
  downloadUrl: string;
  binaryName: string;
}

export interface CrackerBinaryDataLinks {
  self: string;
}

export interface CrackerBinaryDataRelationships {
  crackerBinaryType: CrackerBinaryType;
  tasks: CrackerBinaryType;
}

export interface CrackerBinaryType {
  links: CrackerRelationshipLinks;
}
