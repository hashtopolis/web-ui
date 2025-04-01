import { Agent, JAgent } from '@models/agent.model';
import { BaseModel } from '@models/base.model';
import { JTask } from '@models/task.model';

export interface Chunk {
  _id: number;
  _self: string;
  chunkId: number;
  taskId: number;
  taskName?: string;
  task?: Task;
  format: string;
  skip: number;
  length: number;
  agentId: number;
  agent?: Agent;
  agentName?: string;
  dispatchTime: number;
  solveTime: number;
  checkpoint: number;
  progress: number;
  state: number;
  cracked: number;
  speed: number;
}

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

export interface ChunkData {
  dispatched: number;
  searched: number;
  cracked: number;
  speed: number;
  timeSpent: number;
  agents: number[];
  tasks: number[];
}

export interface ChunkDataData {
  dispatched: number;
  searched: number;
  cracked: number;
  speed: number;
  timeSpent: number;
  agents: number[];
  tasks: number[];
}
