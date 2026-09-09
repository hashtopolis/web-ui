import { HealthCheckHashType } from '@constants/healthchecks.config';

import { JAgent } from '@models/agent.model';
import { BaseModel } from '@models/base.model';
import { JCrackerBinary } from '@models/cracker-binary.model';
import { JHashtype } from '@models/hashtype.model';
import { AgentId, CrackerBinaryId, HashTypeId, HealthCheckId } from '@models/id.types';

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
} as const;
export type HealthCheckStatus = (typeof HealthCheckStatus)[keyof typeof HealthCheckStatus];

/**
 * Interface definition for a health check
 * @extends BaseModel
 */
export interface JHealthCheck extends BaseModel {
  attackCmd: string;
  /** The API declares `checkType` with the hashcat mode values, not the `HealthCheckType` attack modes. */
  checkType: HealthCheckHashType;
  crackerBinaryId: CrackerBinaryId;
  crackerBinary?: JCrackerBinary;
  expectedCracks: number;
  healthCheckAgents?: JHealthCheckAgent[];
  hashtypeId: HashTypeId;
  hashTypeId?: HashTypeId;
  hashType?: JHashtype;
  hashTypeDescription?: string | undefined;
  status: HealthCheckStatus;
  time: number;
}

/**
 * Interface definition for a health check agent
 * @extends BaseModel
 */
export interface JHealthCheckAgent extends BaseModel {
  healthCheckId: HealthCheckId;
  agentId: AgentId;
  status: HealthCheckStatus;
  cracked: number;
  numGpus: number;
  start: number;
  end: number;
  errors: string;
  agent?: JAgent;
}
