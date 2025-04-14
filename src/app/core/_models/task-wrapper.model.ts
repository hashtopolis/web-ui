import { BaseModel } from '@src/app/core/_models/base.model';

import { JAccessGroup } from '@src/app/core/_models/access-group.model';
import { JHashlist } from '@src/app/core/_models/hashlist.model';
import { JHashtype } from '@src/app/core/_models/hashtype.model';
import { JTask } from '@src/app/core/_models/task.model';

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

