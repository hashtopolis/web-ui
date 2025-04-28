import { Agent } from 'http';
import { Hashtype } from './hashtype.model';

export enum HealthCheckType {
  BRUTE_FORCE
}

/**
 * We cannot have negtive values in an enum
 */
export const HealthCheckStatus = {
  ABORTED: -1,
  RUNNING: 0,
  COMPLETED: 1
};

export interface HealthCheck {
  _id: number;
  _self: string;
  attackCmd: string;
  checkType: HealthCheckType;
  crackerBinaryId: number;
  expectedCracks: number;
  hashtypeId: number;
  hashtype?: Hashtype;
  hashtypeDescription?: string;
  healthCheckId: number;
  status: number;
  time: number;
}

export interface HealthCheckAgent {
  _id: number;
  _self: string;
  healthCheckAgentId: number;
  healthCheckId: number;
  agentId: number;
  status: number;
  cracked: number;
  numGpus: number;
  start: number;
  end: number;
  errors: string;
  agentName?: string;
}
