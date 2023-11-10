import { Agent } from './agent.model';
import { Task } from './task.model';

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

export interface ChunkData {
  dispatched: number;
  searched: number;
  cracked: number;
  speed: number;
}
