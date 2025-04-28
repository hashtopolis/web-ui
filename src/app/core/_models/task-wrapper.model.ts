import { JAccessGroup } from '@models/access-group.model';
import { BaseModel } from '@models/base.model';
import { JHashlist } from '@models/hashlist.model';
import { JHashtype } from '@models/hashtype.model';
import { JTask } from '@models/task.model';

/**
 * Interface definition for a task wrapper (wrapper object for tasks and supertasks)
 */
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
