import { ChunkState } from '@constants/chunks.config';

import { JAgent } from '@models/agent.model';
import { BaseModel } from '@models/base.model';
import { AgentId, TaskId } from '@models/id.types';
import { JTask } from '@models/task.model';

/**
 * Interface for a task chunk
 * @extends BaseModel
 */
export interface JChunk extends BaseModel {
  taskId: TaskId;
  taskName?: string | undefined;
  task?: JTask;
  format?: string;
  skip: number;
  length: number;
  agentId: AgentId;
  agent?: JAgent;
  agentName?: string | undefined;
  dispatchTime: number;
  solveTime: number;
  checkpoint: number;
  progress: number;
  state: ChunkState;
  /** Derived client-side from `state`; used to switch the reset/abort row action. */
  isRunning?: boolean;
  cracked: number;
  speed: number;
}

/**
 * Interface for chunk data needed in different tables
 */
export interface ChunkData {
  dispatched: number;
  searched: number;
  cracked: number;
  speed: number;
  timeSpent: number;
  agents: number[];
  tasks: number[];
}
