import { JAgent } from '@models/agent.model';
import { BaseModel } from '@models/base.model';
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
  taskId: number;
  agentId: number;
  benchmark: string;
  agent?: JAgent;
  task?: JTask;
}
