import { BaseModel } from '@src/app/core/_models/base.model';

import { AccessGroup, AccessGroupData, JAccessGroup } from '@src/app/core/_models/access-group.model';
import { Hashlist, HashlistData, JHashlist } from '@src/app/core/_models/hashlist.model';
import { Hashtype, HashtypeData, JHashtype } from '@src/app/core/_models/hashtype.model';
import { JTask } from '@src/app/core/_models/task.model';

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

export interface JTaskWrapper extends BaseModel {
  accessGroupId: number;
  accessGroup?: JAccessGroup;
  accessGroupName?: string;
  cracked: number;
  hashlistId: number;
  hashlist?: JHashlist;
  hashType?: JHashtype;
  isArchived: boolean;
  maxAgents: number;
  priority: number;
  taskType: number;
  taskWrapperId: number;
  taskWrapperName: string;
  tasks?: JTask[];
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
