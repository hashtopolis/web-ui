import { AccessGroup, AccessGroupData } from './access-group.model';
import { Hashlist, HashlistData } from './hashlist.model';
import { Hashtype, HashtypeData } from './hashtype.model';
import { Task, TaskData } from './task.model';

export interface TaskWrapper {
  _id: number;
  _self: string;
  accessGroupId: number;
  accessGroup?: AccessGroup;
  accessGroupName?: string;
  cracked: number;
  hashlistId: number;
  hashlists?: Hashlist[];
  hashtypes?: Hashtype[];
  isArchived: boolean;
  maxAgents: number;
  priority: number;
  taskType: number;
  taskWrapperId: number;
  taskWrapperName: string;
  tasks?: Task[];
  taskName?: string;
}


export interface TaskWrapperData {
  type: string;
  id: number;
  attributes: TaskWrapperDataAttributes;
  links: TaskWrapperDataLinks;
  relationships: TaskWrapperRelationships;
}

export interface TaskWrapperDataAttributes {
  priority: number;
  maxAgents: number;
  taskType: number;
  hashlistId: number;
  accessGroupId: number;
  taskWrapperName: string;
  isArchived: boolean;
  cracked: number;
  hashlists?: HashlistData[];
  hashtypes?: HashtypeData[];
  accessgroup?: AccessGroupData;
  tasks?: TaskData[];
  taskName?: string;
}

export interface TaskWrapperDataLinks {
  self: string;
}

export interface TaskWrapperRelationships {
  accessGroup: TaskWrapperRelationshipAttributes;
  tasks: TaskWrapperRelationshipAttributes;
}

export interface TaskWrapperRelationshipAttributes {
  links: TaskWrapperRelationshipAttributesLinks;
  data: TaskWrapperRelationshipAttributesData | TaskWrapperRelationshipAttributesData[];
}

export interface TaskWrapperRelationshipAttributesData {
  type: string;
  id: number;
}

export interface TaskWrapperRelationshipAttributesLinks {
  self: string;
  related: string;
}
