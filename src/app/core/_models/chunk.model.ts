import { Agent, AgentData } from './agent.model';
import { Task, TaskData } from './task.model';

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
  timeSpent: number;
  agents: number[];
  tasks: number[];
}

export interface ChunkDataNew {
  type: string;
  id: number;
  attributes: ChunkDataAttributes;
  links?: DataLinks;
  relationships?: ChunkRelationships;
}

export interface ChunkDataAttributes {
  taskId: number;
  skip: number;
  length: number;
  agentId: number;
  dispatchTime: number;
  solveTime: number;
  checkpoint: number;
  progress: number;
  state: number;
  cracked: number;
  speed: number;
  agent?: AgentData;
  task?: TaskData;
}

export interface DataLinks {
  self: string;
}

export interface ChunkRelationships {
  agent: ChunkRelationshipsLinks;
  task: ChunkRelationshipsLinks;
}

export interface ChunkRelationshipsLinks {
  links: Links;
}

export interface Links {
  self: string;
  related: string;
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
