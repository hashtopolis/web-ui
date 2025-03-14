import { BaseModel } from './base.model';

export interface AccessGroup {
  _id: number;
  _self: string;
  accessGroupId: number;
  groupName: string;
  userMembers?: [];
  agentMembers?: [];
}

export interface JAccessGroup extends BaseModel {
  accessGroupId: number;
  groupName: string;
  userMembers?: [];
  agentMembers?: [];
}

export interface AccessGroupData {
  type: string;
  id: number;
  attributes: AccessGroupDataAttributes;
  links: AccessGroupDataLinks;
  relationships: AccessGroupRelationships;
}

export interface AccessGroupDataAttributes {
  groupName: string;
  userMembers?: number;
  agentMembers?: number;
}

export interface AccessGroupDataLinks {
  self: string;
}

export interface AccessGroupRelationships {
  agentMembers: AccGrpRelationshipAttributes;
  userMembers: AccGrpRelationshipAttributes;
}

export interface AccGrpRelationshipAttributes {
  links: AccGrpAttributesLinks;
  data?: AccGrpRelAttrDataAttributes[];
}

export interface AccGrpAttributesLinks {
  self: string;
  related: string;
}

export interface AccGrpRelAttrDataAttributes {
  type: string;
  id: number;
}
