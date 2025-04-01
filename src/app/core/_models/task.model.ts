import { JFile } from '@models/file.model';
import { SpeedStat } from '@models/speed-stat.model';
import { Agent, JAgent } from '@models/agent.model';
import { CrackerBinary, CrackerBinaryType, JCrackerBinary, JCrackerBinaryType } from '@models/cracker-binary.model';
import { Hashlist } from '@models/hashlist.model';
import { BaseModel } from '@models/base.model';

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

/**
 * Interface definition for a cracking task
 */
export interface JTask extends BaseModel {
  taskName: string;
  assignedAgents?: JAgent[];
  attackCmd: string;
  chunkTime: number;
  statusTimer: number;
  keyspace: number;
  keyspaceProgress: number;
  files?: JFile[];
  priority: number;
  maxAgents: number;
  color: null | string;
  isSmall: boolean;
  isCpuTask: boolean;
  useNewBench: boolean;
  skipKeyspace: number;
  crackerBinary?: JCrackerBinary;
  crackerBinaryType?: JCrackerBinaryType;
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
  dispatched: string;
  searched: string;
  speeds: SpeedStat[];
}
