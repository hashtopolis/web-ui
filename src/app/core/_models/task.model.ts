// import { Hashlist } from "./hashlist"

import { CrackerBinary, CrackerBinaryType } from './cracker-binary.model';

import { Agent } from './agent.model';
import { Hashlist } from './hashlist.model';

/**
 * @deprecated This interface is deprecated and should not be used.
 * Use the Task interface instead.
 */
export interface NormalTask {
  id: number;
  name: string;
  priority: number;
  maxAgents: number;

  hashlistId: number;
  // hashlist: Hashlist
}

export interface Task {
  _id: number;
  _self: string;
  attackCmd: string;
  chunkSize: number;
  chunkTime: number;
  color?: string;
  crackerBinaryId: number;
  crackerBinaryTypeId: number;
  forcePipe: boolean;
  isArchived: boolean;
  isCpuTask: boolean;
  isSmall: boolean;
  keyspace: number;
  keyspaceProgress: number;
  notes: string;
  preprocessorCommand: number;
  preprocessorId: number;
  skipKeyspace: number;
  staticChunks: number;
  statusTimer: number;
  taskId: number;
  taskName: string;
  taskWrapperId: number;
  taskWrapperName?: string;
  useNewBench: boolean;
  assignedAgents?: Agent[];
  crackerBinary?: CrackerBinary;
  crackerBinaryType?: CrackerBinaryType;
  hashlist?: Hashlist[];
  taskType?: number;
}

export interface TaskData {
  type: string;
  id: number;
  attributes: DataAttributes;
  links?: DataLinks;
  relationships?: Relationships;
}

export interface DataAttributes {
  taskName: string;
  attackCmd: string;
  chunkTime: number;
  statusTimer: number;
  keyspace: number;
  keyspaceProgress: number;
  priority: number;
  maxAgents: number;
  color: null | string;
  isSmall: boolean;
  isCpuTask: boolean;
  useNewBench: boolean;
  skipKeyspace: number;
  crackerBinaryId: number;
  crackerBinaryTypeId: number;
  taskWrapperId: number;
  isArchived: boolean;
  notes: string;
  staticChunks: number;
  chunkSize: number;
  forcePipe: boolean;
  preprocessorId: number;
  preprocessorCommand: string;
}

export interface DataLinks {
  self: string;
}

export interface Relationships {
  assignedAgents: AssignedAgents;
  crackerBinary: AssignedAgents;
  crackerBinaryType: AssignedAgents;
  files: AssignedAgents;
  hashlist: AssignedAgents;
  speeds: AssignedAgents;
}

export interface AssignedAgents {
  links: AssignedAgentsLinks;
}

export interface AssignedAgentsLinks {
  self: string;
  related: string;
}




