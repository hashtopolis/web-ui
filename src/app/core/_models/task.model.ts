import { JAccessGroup } from '@models/access-group.model';
import { JAgent } from '@models/agent.model';
import { BaseModel } from '@models/base.model';
import { ChunkData } from '@models/chunk.model';
import { JCrackerBinary, JCrackerBinaryType } from '@models/cracker-binary.model';
import { JFile } from '@models/file.model';
import { JHashlist } from '@models/hashlist.model';
import { JHashtype } from '@models/hashtype.model';
import { AccessGroupId, CrackerBinaryId, CrackerBinaryTypeId, HashlistId, PreprocessorId, TaskWrapperId } from '@models/id.types';
import { SpeedStat } from '@models/speed-stat.model';

/**
 * Enum definition for taskType (task or supertask)
 */
export enum TaskType {
  TASK = 0,
  SUPERTASK = 1
}

/**
 * Common attributes shared between tasks and task wrappers
 */
export interface TaskAttributes extends BaseModel {
  taskName?: string;
  priority: number;
  maxAgents: number;
}

/**
 * Interface definition for a cracking task
 */
export interface JTask extends BaseModel, TaskAttributes {
  attackCmd: string;
  activeAgents?: number;
  totalAssignedAgents?: number;
  chunkTime: number;
  statusTimer: number;
  keyspace: number;
  keyspaceProgress: number;
  files?: JFile[];
  color?: string | null;
  isSmall: boolean;
  isCpuTask: boolean;
  useNewBench: boolean;
  skipKeyspace: number;
  crackerBinaryId: CrackerBinaryId;
  crackerBinaryTypeId: CrackerBinaryTypeId | null;
  crackerBinary?: JCrackerBinary;
  crackerBinaryType?: JCrackerBinaryType;
  hashlist?: JHashlist;
  assignedAgents?: JAgent[];
  taskWrapperId: TaskWrapperId;
  isArchived: boolean;
  notes: string;
  staticChunks: number;
  chunkSize: number;
  forcePipe: boolean;
  preprocessorId: PreprocessorId;
  preprocessorCommand: string;
  dispatched?: string;
  searched?: string;
  speeds?: SpeedStat[];
  chunkData?: ChunkData;
  status?: number;
  timeSpent?: number;
  currentSpeed?: number;
  estimatedTime?: number;
  cprogress?: number;
  isrunning?: boolean;
  isCompleted?: boolean;
  activeSubtasks?: number;
  subtasks?: JTask[];
}

/**
 * Interface definition for a task wrapper (wrapper object for cracking tasks and supertasks)
 */
export interface JTaskWrapper extends BaseModel, TaskAttributes {
  accessGroupId: AccessGroupId;
  accessGroup?: JAccessGroup;
  accessGroupName?: string;
  cracked: number;
  hashlistId: HashlistId;
  hashlist?: JHashlist;
  hashType?: JHashtype;
  isArchived: boolean;
  taskType?: TaskType;
  taskWrapperId?: TaskWrapperId;
  taskWrapperName: string;
  tasks?: JTask[];
  chunkData?: ChunkData;
}

export enum TaskStatus {
  RUNNING = 1,
  IDLE = 2,
  COMPLETED = 3
}

export interface TaskCompletionData {
  keyspace: number;
  keyspaceProgress: number;
  searched: string;
}

export interface TaskStatusData extends TaskCompletionData {
  totalAssignedAgents: number;
}
