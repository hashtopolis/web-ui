import { BaseModel } from '@models/base.model';
import { JHashtype } from '@models/hashtype.model';

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

/**
 * Interface definition for a health check
 * @extends BaseModel
 */
export interface JHealthCheck extends BaseModel {
  attackCmd: string;
  checkType: HealthCheckType;
  crackerBinaryId: number;
  expectedCracks: number;
  hashTypeId: number;
  hashType?: JHashtype;
  hashTypeDescription?: string;
  status: number;
  time: number;
}

/**
 * Interface definition for a health check agent
 * @extends BaseModel
 */
export interface JHealthCheckAgent extends BaseModel {
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
