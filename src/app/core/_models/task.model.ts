import { JFile } from '@models/file.model';
import { SpeedStat } from '@models/speed-stat.model';
import { JAgent } from '@models/agent.model';
import { JCrackerBinary, JCrackerBinaryType } from '@models/cracker-binary.model';
import { JHashlist } from '@models/hashlist.model';
import { BaseModel } from '@models/base.model';

/**
 * Interface definition for a cracking task
 */
export interface JTask extends BaseModel {
  taskName: string;
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
}
