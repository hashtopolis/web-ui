import { BaseModel } from '@models/base.model';
import { JTask } from '@models/task.model';

export interface JAgentErrors extends BaseModel {
  agentId: number;
  chunkId: number;
  error: string;
  id: number;
  taskId: number;
  time: number;
  type: string;
  task?: JTask;
}
