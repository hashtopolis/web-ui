import { Agent } from './agent.model';
import { Task } from './task.model';

export interface AgentAssignment {
  _id: number;
  _self: string;
  agentId: number;
  agent?: Agent;
  assignmentId: number;
  benchmark: string;
  taskId: number;
  task?: Task;
}
