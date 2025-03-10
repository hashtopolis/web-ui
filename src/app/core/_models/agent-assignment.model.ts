import { BaseModel } from './base.model';
import { Agent, AgentData } from './agent.model';
import { Task, TaskData } from './task.model';


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

export interface JAgentAssignment extends BaseModel {
  taskId: number;
  agentId: number;
  benchmark: string;
  agent?: AgentData;
  task?: TaskData;
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
