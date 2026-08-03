import { JAgent } from '@models/agent.model';
import { BaseModel } from '@models/base.model';
import { AgentId, TaskId } from '@models/id.types';
import { JTask } from '@models/task.model';

/**
 * Interface definition for an agent's assignment to a task
 * @extends BaseModel
 * @prop taskId ID of task the agent is assigned to
 * @prop agentId ID of agent
 * @prop benchmark Benchmark
 * @prop agent Optional included agent object
 * @prop task Optional included task object
 */
export interface JAgentAssignment extends BaseModel {
  taskId: TaskId;
  agentId: AgentId;
  benchmark: string;
  agent?: JAgent;
  task?: JTask;
  // Aggregate fields are intentionally NOT here — see JAgentAssignmentAggregates / JAgentAssignmentWith below.
}

/**
 * Aggregate fields on an assignment — NOT on the base `JAgentAssignment`; present in the result type only
 * when requested via `aggregate[assignment]=`. This interface is the source of their types.
 * All of them are scoped to the assignment's agent AND task.
 */
export interface JAgentAssignmentAggregateFields {
  crackingTime: number;
  cracked: number;
  currentSpeed: number;
  searched: number;
  // Null when the agent has no chunk on this task.
  currentChunkId: number | null;
}

/** Aggregate field keys on JAgentAssignment. */
export type JAgentAssignmentAggregates = keyof JAgentAssignmentAggregateFields;

/**
 * Assignment with only the chosen subset of aggregate fields present
 * (e.g. `JAgentAssignmentWith<'cracked' | 'currentSpeed'>`).
 */
export type JAgentAssignmentWith<K extends JAgentAssignmentAggregates> = JAgentAssignment &
  Pick<JAgentAssignmentAggregateFields, K>;
