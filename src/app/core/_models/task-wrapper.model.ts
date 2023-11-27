import { AccessGroup } from './access-group.model';
import { Hashlist } from './hashlist.model';
import { Task } from './task.model';

export interface TaskWrapper {
  _id: number;
  _self: string;
  accessGroupId: number;
  accessGroup?: AccessGroup;
  accessGroupName?: string;
  cracked: number;
  hashlistId: number;
  hashlists?: Hashlist[];
  isArchived: boolean;
  maxAgents: number;
  priority: number;
  taskType: number;
  taskWrapperId: number;
  taskWrapperName: string;
  tasks?: Task[];
  taskName?: string;
}
