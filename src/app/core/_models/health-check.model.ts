import { JAgent } from '@models/agent.model';
import { BaseModel } from '@models/base.model';
import { JCrackerBinary } from '@models/cracker-binary.model';
import { JHashtype } from '@models/hashtype.model';
import { AgentId, CrackerBinaryId, HashTypeId, HealthCheckId } from '@models/id.types';

/**
 * Different health check types
 * - `BRUTE_FORCE` Health check using brute-force attack
 * @enum
 */
// @TODO: Check this
export enum HealthCheckType {
  MD5 = 0,
  BCRYPT = 3200
}

/** Health check status values matching the generated Zod schema. */
export type HealthCheckStatusValue = -1 | 0 | 1;

/**
 * Health check status
 * - `ABORTED`    Health check was aborted
 * - `RUNNING`    Health check is running
 * - `COMPLETED`  Health check is completed
 */
export const HealthCheckStatus = {
  ABORTED: -1 as const,
  RUNNING: 0 as const,
  COMPLETED: 1 as const,
};

/**
 * Interface definition for a health check
 * @extends BaseModel
 */
export interface JHealthCheck extends BaseModel {
  attackCmd: string;
  checkType: HealthCheckType;
  crackerBinaryId: CrackerBinaryId;
  crackerBinary?: JCrackerBinary;
  expectedCracks: number;
  healthCheckAgents?: JHealthCheckAgent[];
  hashtypeId: HashTypeId;
  hashTypeId?: HashTypeId;
  hashType?: JHashtype;
  hashTypeDescription?: string;
  status: HealthCheckStatusValue;
  time: number;
}

/**
 * Interface definition for a health check agent
 * @extends BaseModel
 */
export interface JHealthCheckAgent extends BaseModel {
  healthCheckId: HealthCheckId;
  agentId: AgentId;
  status: HealthCheckStatusValue;
  cracked: number;
  numGpus: number;
  start: number;
  end: number;
  errors: string;
  agent?: JAgent;
}
