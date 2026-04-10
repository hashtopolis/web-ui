import { BaseModel } from '@models/base.model';
import { AgentId, ChunkId, TaskId } from '@models/id.types';
import { JTask } from '@models/task.model';

export interface JAgentErrors extends BaseModel {
  agentId: AgentId;
  chunkId: ChunkId | null;
  error: string;
  id: number;
  taskId: TaskId;
  time: number;
  type: string;
  task?: JTask;
}
