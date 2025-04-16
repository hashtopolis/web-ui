import { AccessGroup } from '@models/access-group.model';
import { BaseModel } from '@models/base.model';
import { JAgentStat } from '@models/agent-stats.model';
import { JChunk } from '@models/chunk.model';
import { JTask } from '@models/task.model';
import { JUser } from '@models/user.model';

/**
 * Interface for cracking agent
 * @extends BaseModel
 */
export interface JAgent extends BaseModel {
  agentName: string;
  uid: string;
  os: number;
  devices: string;
  cmdPars: string;
  ignoreErrors: number;
  isActive: boolean;
  isTrusted: boolean;
  token: string;
  lastAct: string;
  lastTime: number;
  lastIp: string;
  userId: null;
  user?: JUser;
  cpuOnly: number;
  clientSignature: string;
  agentStats?: JAgentStat[];
  accessGroups?: AccessGroup[];
  accessGroup?: string;
  task?: JTask;
  taskId?: number;
  taskName?: string;
  chunk?: JChunk;
  chunkId?: number;
  benchmark?: string;
  assignmentId?: number;
  avgCpu?: number;
  maxTemp?: number;
  avgDevice?: number;
}
