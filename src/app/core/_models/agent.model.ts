import { JAccessGroup } from '@models/access-group.model';
import { JAgentAssignment } from '@models/agent-assignment.model';
import { JAgentErrors } from '@models/agent-errors.model';
import { JAgentStat } from '@models/agent-stats.model';
import { BaseModel } from '@models/base.model';
import { ChunkData, JChunk } from '@models/chunk.model';
import { ChunkId, TaskId, UserId } from '@models/id.types';
import { JTask } from '@models/task.model';
import { JUser } from '@models/user.model';

/** Keys for include-dependent relationship fields on JAgent. */
export type JAgentExcludeKeys =
  | 'user'
  | 'agentStats'
  | 'agentErrors'
  | 'accessGroups'
  | 'task'
  | 'chunk'
  | 'chunks'
  | 'tasks'
  | 'assignments';

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
  ignoreErrors?: number;
  isActive: boolean;
  isTrusted: boolean;
  token: string;
  lastAct: string;
  lastTime: number;
  lastIp: string;
  userId?: UserId | null;
  cpuOnly: boolean;
  clientSignature: string;
  accessGroup?: string;
  taskId?: TaskId;
  taskName?: string;
  chunkId?: ChunkId;
  benchmark?: string;
  assignmentId?: number;
  agentSpeed?: number;
  chunkData?: ChunkData;
  // Include-dependent relationships (require ?include= in API request)
  user: JUser;
  agentStats: JAgentStat[];
  agentErrors: JAgentErrors[];
  accessGroups: JAccessGroup[];
  task: JTask;
  chunk: JChunk;
  chunks: JChunk[];
  tasks: JTask[];
  assignments: JAgentAssignment[];
}

/** Agent without include-dependent relationship fields. */
export type ThinJAgent = Omit<JAgent, JAgentExcludeKeys>;

/** Agent with only specific include-dependent fields present. */
export type JAgentWith<K extends JAgentExcludeKeys> = ThinJAgent & Pick<JAgent, K>;
