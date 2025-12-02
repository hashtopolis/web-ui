import { JAccessGroup } from '@models/access-group.model';
import { JAgent } from '@models/agent.model';
import { BaseModel } from '@models/base.model';
import { ChunkData } from '@models/chunk.model';
import { JCrackerBinary, JCrackerBinaryType } from '@models/cracker-binary.model';
import { JFile } from '@models/file.model';
import { JHashlist } from '@models/hashlist.model';
import { JHashtype } from '@models/hashtype.model';
import { SpeedStat } from '@models/speed-stat.model';

/**
 * Enum definition for taskType (task or supertask)
 */
export enum TaskType {
  TASK = 0,
  SUPERTASK = 1
}

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
  activeAgents: number;
  chunkTime: number;
  statusTimer: number;
  keyspace: number;
  keyspaceProgress: number;
  files?: JFile[];
  color: null | string;
  isSmall: boolean;
  isCpuTask: boolean;
  useNewBench: boolean;
  skipKeyspace: number;
  crackerBinaryId: number;
  crackerBinaryTypeId: number;
  crackerBinary: JCrackerBinary;
  crackerBinaryType: JCrackerBinaryType;
  hashlist?: JHashlist;
  assignedAgents?: JAgent[];
  taskWrapperId: number;
  isArchived: boolean;
  notes: string;
  staticChunks: number;
  chunkSize: number;
  forcePipe: boolean;
  preprocessorId: number;
  preprocessorCommand: string;
  dispatched: string;
  searched: string;
  speeds: SpeedStat[];
  chunkData?: ChunkData;
  status: number;
}

/**
 * Interface definition for a task wrapper (wrapper object for cracking tasks and supertasks)
 */
export interface JTaskWrapper extends BaseModel, TaskAttributes {
  accessGroupId: number;
  accessGroup?: JAccessGroup;
  accessGroupName?: string;
  cracked: number;
  hashlistId: number;
  hashlist?: JHashlist;
  hashType?: JHashtype;
  isArchived: boolean;
  taskType: TaskType;
  taskWrapperId: number;
  taskWrapperName: string;
  tasks?: JTask[];
  chunkData?: ChunkData;
}
