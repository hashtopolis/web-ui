import { JAgent } from '@models/agent.model';
import { BaseModel } from '@models/base.model';
import { JCrackerBinary } from '@models/cracker-binary.model';
import { JHashtype } from '@models/hashtype.model';

/**
 * Different health check types
 * - `BRUTE_FORCE` Health check using brute-force attack
 * @enum
 */
export enum HealthCheckType {
  BRUTE_FORCE
}

/**
 * Health check status
 * - `ABORTED`    Health check was aborted
 * - `RUNNING`    Health check is running
 * - `COMPLETED`  Health check is completed
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
  crackerBinary?: JCrackerBinary;
  expectedCracks: number;
  healthCheckAgents?: JHealthCheckAgent[];
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
  healthCheckId: number;
  agentId: number;
  status: number;
  cracked: number;
  numGpus: number;
  start: number;
  end: number;
  errors: string;
  agent?: JAgent;
}
