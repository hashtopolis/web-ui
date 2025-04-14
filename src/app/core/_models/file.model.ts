import { AccessGroup, AccessGroupDataAttributes } from './access-group.model';
import { BaseModel } from './base.model';

export enum FileType {
  WORDLIST,
  RULES,
  OTHER
}

export interface UploadFileTUS {
  filename: string;
  progress: number;
  hash: string;
  uuid: string;
}

export interface File {
  _id: number;
  _self: string;
  accessGroup: AccessGroup;
  accessGroupId?: number;
  accessGroupName?: string;
  fileId: number;
  fileType: FileType;
  filename: string;
  isSecret: boolean;
  lineCount: number;
  size: number;
}

export interface JFile extends BaseModel {
  filename: string;
  size: number;
  isSecret: boolean;
  fileType: number;
  accessGroupId: number;
  lineCount: number;
  accessGroup?: AccessGroup;
}

export interface FileData {
  type: string;
  id: number;
  attributes: FileDataAttributes;
  links: FileDataLinks;
  relationships: FileRelationships;
}

export interface FileDataAttributes {
  filename: string;
  size: number;
  isSecret: boolean;
  fileType: number;
  accessGroupId: number;
  lineCount: number;
  accessGroup?: AccessGroupDataAttributes;
}

export interface FileDataLinks {
  self: string;
}

export interface FileRelationships {
  accessGroup: FileRelationshipAttributes;
}

export interface FileRelationshipAttributes {
  links: FileRelationshipLinks;
  data: FileRelationshipAttributesData;
}

export interface FileRelationshipLinks {
  self: string;
  related: string;
}

export interface FileRelationshipAttributesData {
  type: string;
  id: number;
}

