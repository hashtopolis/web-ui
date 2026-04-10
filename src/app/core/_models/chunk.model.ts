import { JAgent } from '@models/agent.model';
import { BaseModel } from '@models/base.model';
import { AgentId, TaskId } from '@models/id.types';
import { JTask } from '@models/task.model';

/** Chunk state values (0–10) matching the generated Zod schema. */
export type ChunkState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * Interface for a task chunk
 * @extends BaseModel
 */
export interface JChunk extends BaseModel {
  taskId: TaskId;
  taskName?: string;
  task?: JTask;
  format?: string;
  skip: number;
  length: number;
  agentId: AgentId;
  agent?: JAgent;
  agentName?: string;
  dispatchTime: number;
  solveTime: number;
  checkpoint: number;
  progress: number;
  state: ChunkState;
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
