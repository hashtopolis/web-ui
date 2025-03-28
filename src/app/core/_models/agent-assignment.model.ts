import { AgentData, JAgent } from '@src/app/core/_models/agent.model';
import { BaseModel } from '@src/app/core/_models/base.model';
import { JTask } from '@src/app/core/_models/task.model';

export interface JAgentAssignment extends BaseModel {
  taskId: number;
  agentId: number;
  benchmark: string;
  agent?: JAgent;
  task?: JTask;
}

export interface AgentAssignmentData {
  type: string;
  id: number;
  attributes: DataAttributes | undefined;
  links?: DataLinks;
  relationships?: AgentAssignmentRelationships;
}

export interface DataAttributes {
  taskId: number;
  agentId: number;
  benchmark: string;
  agent?: AgentData;
  task?: TaskData;
}

export interface DataLinks {
  self: string;
}

export interface AgentAssignmentRelationships {
  agent: AgentAssignmentRelationshipsLinks;
  task: AgentAssignmentRelationshipsLinks;
}

export interface AgentAssignmentRelationshipsLinks {
  links: Links;
}

export interface Links {
  self: string;
  related: string;
}
