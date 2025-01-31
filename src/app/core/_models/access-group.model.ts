import { RelationshipAttributes } from './hash.model';

export interface AccessGroup {
  _id: number;
  _self: string;
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
}

export interface AccessGroupDataLinks {
  self: string;
}

export interface AccessGroupRelationships {
  agentMembers: AccessGroupRelationshipAttributes;
  userMembers: AccessGroupRelationshipAttributes;
}

export interface AccessGroupRelationshipAttributes {
  links: AccessGroupAttributesLinks;
}

export interface AccessGroupAttributesLinks {
  self: string;
  related: string;
}
