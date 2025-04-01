import { AccessGroup } from '@models/access-group.model';
import { JUser, User } from '@models/user.model';
import { Chunk, JChunk } from '@models/chunk.model';
import { BaseModel } from '@models/base.model';
import { JTask } from '@models/task.model';


export interface AgentStats {
  _id: number;
  _self: string;
  agentStatId: number;
  agentId: number;
  statType: number;
  time: number;
  value: number[];
}

export interface Agent {
  _id?: number;
  _self?: string;
  agentId: number;
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
  userId: number;
  user?: User;
  cpuOnly: number;
  clientSignature: string;
  agentstats?: AgentStats[];
  accessGroups?: AccessGroup[];
  task?: Task;
  taskId?: number;
  taskName?: string;
  chunk?: Chunk;
  chunkId?: number;
  benchmark?: string;
  assignmentId?: number;
}

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
  agentStats?: AgentStats[];
  accessGroups?: AccessGroup[];
  accessGroup?: string;
  task?: JTask;
  taskId?: number;
  taskName?: string;
  chunk?: JChunk;
  chunkId?: number;
  benchmark?: string;
  assignmentId?: number;
}

export interface AccessGroupsLinks {
  self: string;
  related: string;
}

export interface AgentStats {
  links: AccessGroupsLinks;
}
