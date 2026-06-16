import { JAccessGroup } from '@models/access-group.model';
import { JAgent } from '@models/agent.model';
import { BaseModel, With } from '@models/base.model';
import { ChunkData } from '@models/chunk.model';
import { JCrackerBinary, JCrackerBinaryType } from '@models/cracker-binary.model';
import { JFile } from '@models/file.model';
import { JHashlist } from '@models/hashlist.model';
import { JHashtype } from '@models/hashtype.model';
import {
  AccessGroupId,
  CrackerBinaryId,
  CrackerBinaryTypeId,
  HashlistId,
  PreprocessorId,
  TaskWrapperId
} from '@models/id.types';
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
  taskName?: string | undefined;
  priority: number;
  maxAgents: number;
}

/**
 * Interface definition for a cracking task
 */
export interface JTask extends BaseModel, TaskAttributes {
  attackCmd: string;
  activeAgents?: number | undefined;
  totalAssignedAgents?: number | undefined;
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
  dispatched?: string | undefined;
  searched?: string | undefined;
  speeds?: SpeedStat[];
  chunkData?: ChunkData;
  totalNumberOfChunks: number;
  status?: number | undefined;
  timeSpent?: number | undefined;
  currentSpeed?: number | undefined;
  estimatedTime?: number | undefined;
  cprogress?: number | undefined;
  isrunning?: boolean;
  isCompleted?: boolean;
  activeSubtasks?: number;
  subtasks?: JTask[];
}

/** Keys for aggregate fields on JTask (populated only when requested via `aggregate[task]=`). */
export type JTaskAggregates =
  | 'activeAgents'
  | 'dispatched'
  | 'searched'
  | 'status'
  | 'estimatedTime'
  | 'timeSpent'
  | 'currentSpeed'
  | 'cprogress'
  | 'totalNumberOfChunks';

/** All on-demand conditional fields on JTask. Only aggregates are enumerated today; add a JTaskIncludes union to this union when relationship includes are typed. */
export type JTaskConditional = JTaskAggregates;

/** Task with only the chosen subset of on-demand fields present (e.g. `JTaskWith<'dispatched' | 'searched'>`). */
export type JTaskWith<K extends JTaskConditional> = With<JTask, JTaskConditional, K>;

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

/**
 * Interface definition for a task wrapper display (combined view for tasks and task wrappers)
 */
export interface JTaskWrapperDisplay extends BaseModel {
  taskWrapperId?: number;
  taskWrapperPriority?: number;
  taskWrapperMaxAgents?: number;
  taskType?: number;
  hashlistId?: number;
  accessGroupId?: number;
  taskWrapperName?: string;
  displayName?: string;
  taskWrapperIsArchived?: number;
  cracked?: number;
  taskId?: number;
  taskName?: string;
  attackCmd?: string;
  chunkTime?: number;
  statusTimer?: number;
  keyspace?: number;
  keyspaceProgress?: number;
  taskPriority?: number;
  taskMaxAgents?: number;
  isSmall?: number;
  isCpuTask?: number;
  taskIsArchived?: number;
  taskUsePreprocessor?: number;
  hashlistName?: string;
  hashCount?: number;
  hashlistCracked?: number;
  hashTypeId?: number;
  hashTypeDescription?: string;
  groupName?: string;
  status?: number;
  currentSpeed?: number;
  dispatched?: string;
  searched?: string;
  totalAssignedAgents?: number;
  cprogress?: number | undefined;
  estimatedTime?: number | undefined;
  timeSpent?: number | undefined;
}

/**
 * Keys for aggregate fields on JTaskWrapperDisplay (populated only when requested via `aggregate[task]=`).
 * Note: JTaskWrapperDisplay is deserialized untyped, so only the hand-model `With`/`Thin` axis governs it.
 */
export type JTaskWrapperDisplayAggregates =
  | 'status'
  | 'totalAssignedAgents'
  | 'dispatched'
  | 'searched'
  | 'cprogress'
  | 'estimatedTime'
  | 'timeSpent'
  | 'currentSpeed';

/** All on-demand conditional fields on JTaskWrapperDisplay (aggregates only; it is deserialized untyped). */
export type JTaskWrapperDisplayConditional = JTaskWrapperDisplayAggregates;

/** Task wrapper display with only the chosen subset of on-demand fields present. */
export type JTaskWrapperDisplayWith<K extends JTaskWrapperDisplayConditional> = With<
  JTaskWrapperDisplay,
  JTaskWrapperDisplayConditional,
  K
>;

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
