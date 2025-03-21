import { BaseModel } from '@src/app/core/_models/base.model';

import { Chunk, ChunkDataNew, JChunk } from '@src/app/core/_models/chunk.model';
import { JUser, User, UserData } from '@src/app/core/_models/user.model';
import { AccessGroup } from '@src/app/core/_models/access-group.model';
import { JAgentAssignment } from '@src/app/core/_models/agent-assignment.model';
import { JTask } from '@src/app/core/_models/task.model';

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

export interface AgentData {
  type: string;
  id: number;
  attributes: AgentDataAttributes;
  links?: AgentDataLinks;
  relationships?: AgentDataRelationships;
}

export interface AgentDataAttributes {
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
  // cpuOnly:         boolean;
  // clientSignature: string;

//OLD
  user?: UserData;
  cpuOnly: number;
  clientSignature: string;
  agentstats?: AgentStats[];
  accessGroups?: AccessGroup[];
  accessGroup?: string;
  task?: TaskData;
  taskId?: number;
  taskName?: string;
  chunk?: ChunkDataNew;
  chunkId?: number;
  benchmark?: string;
  assignmentId?: number;
}

export interface AgentDataLinks {
  self: string;
}

export interface AgentDataRelationships {
  accessGroups: AccessGroups;
  agentStats: AgentStats;
}

export interface AccessGroups {
  links: AccessGroupsLinks;
  data: AccessGroupsData[];
}

export interface AccessGroupsData {
  type: string;
  id: number;
}

export interface AccessGroupsLinks {
  self: string;
  related: string;
}

export interface AgentStats {
  links: AccessGroupsLinks;
}
