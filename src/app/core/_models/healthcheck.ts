export interface HealthCheck {
  attackCmd: string;
  checkType: number;
  crackerBinaryId: number;
  expectedCracks: number;
  hashtypeId: number;
  healthCheckId: number;
  status: number;
  time: number
}

export interface HealthCheckedAgents {
  healthCheckAgentId: number;
  healthCheckId: number;
  agentId: number;
  status: number;
  cracked: number;
  numGpus: number;
  start: number;
  end: number;
  errors: string;
}
