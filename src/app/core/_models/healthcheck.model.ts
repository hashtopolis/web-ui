import { BaseModel } from '@models/base.model';

/**
 * Interface definition for HealthCheck resource
 */
export interface HealthCheck extends BaseModel {
  attackCmd: string;
  checkType: number;
  crackerBinaryId: number;
  expectedCracks: number;
  hashtypeId: number;
  healthCheckId: number;
  status: number;
  time: number;
}
