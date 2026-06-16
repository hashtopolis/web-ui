import { JAccessGroup } from '@models/access-group.model';
import { JAgentAssignment } from '@models/agent-assignment.model';
import { JAgentErrors } from '@models/agent-errors.model';
import { JAgentStat } from '@models/agent-stats.model';
import { BaseModel, Thin } from '@models/base.model';
import { ChunkData, JChunk } from '@models/chunk.model';
import { ChunkId, TaskId, UserId } from '@models/id.types';
import { JTask } from '@models/task.model';
import { JUser } from '@models/user.model';

import { AgentOS, IgnoreErrors } from '@src/app/core/_constants/agentsc.config';

/** Keys for include-dependent relationship fields on JAgent (populated only when `?include=` is requested). */
export type JAgentIncludes =
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
  os: AgentOS;
  devices: string;
  cmdPars: string;
  ignoreErrors?: IgnoreErrors;
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
  taskName?: string | undefined;
  chunkId?: ChunkId;
  benchmark?: string;
  assignmentId?: number;
  agentSpeed?: number;
  chunkData?: ChunkData;
  // Aggregate field `crackingTime` is intentionally NOT here — see JAgentAggregates / JAgentWith below.
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

/**
 * Aggregate fields on an agent — NOT on the base `JAgent`; present in the result type only when requested
 * via `aggregate[..]=`. This interface is the source of their types.
 */
export interface JAgentAggregateFields {
  // `null` when the agent has no chunks with both SOLVE_TIME and DISPATCH_TIME set (server: SUM(..) - SUM(..)).
  crackingTime: number | null;
}

/** Aggregate field keys on JAgent. */
export type JAgentAggregates = keyof JAgentAggregateFields;

/** All on-demand conditional fields on JAgent: relationship includes plus aggregate fields. */
export type JAgentConditional = JAgentIncludes | JAgentAggregates;

/** Agent without any on-demand (include or aggregate) fields — the default response shape. */
export type ThinJAgent = Thin<JAgent, JAgentIncludes>;

/**
 * Agent with only the chosen subset of on-demand fields present. `K` may freely mix include and aggregate
 * keys, e.g. `JAgentWith<'task' | 'crackingTime'>` — includes are picked from `JAgent`, aggregates from
 * `JAgentAggregateFields`.
 */
export type JAgentWith<K extends JAgentConditional> = Omit<JAgent, JAgentIncludes> &
  Pick<JAgent, K & JAgentIncludes> &
  Pick<JAgentAggregateFields, K & JAgentAggregates>;
