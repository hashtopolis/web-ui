import { JAgent } from '@models/agent.model';
import { BaseModel } from '@models/base.model';
import { JTask } from '@models/task.model';

/**
 * Interface for a task chunk
 * @extends BaseModel
 */
export interface JChunk extends BaseModel {
  taskId: number;
  taskName?: string;
  task?: JTask;
  format: string;
  skip: number;
  length: number;
  agentId: number;
  agent?: JAgent;
  agentName?: string;
  dispatchTime: number;
  solveTime: number;
  checkpoint: number;
  progress: number;
  state: number;
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
