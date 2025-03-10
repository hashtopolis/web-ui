export interface AgentStatsData {
  type: string;
  id: number;
  attributes: AgentStatsAttributes;
  links?: DataLinks;
}

export interface AgentStatsAttributes {
  agentId: number;
  statType: number;
  time: number;
  value: number[];
}

export interface DataLinks {
  self: string;
}

