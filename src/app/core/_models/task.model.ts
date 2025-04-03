import { JFile } from '@models/file.model';
import { SpeedStat } from '@models/speed-stat.model';
import { JAgent } from '@models/agent.model';
import { JCrackerBinary, JCrackerBinaryType } from '@models/cracker-binary.model';
import { BaseModel } from '@models/base.model';

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
