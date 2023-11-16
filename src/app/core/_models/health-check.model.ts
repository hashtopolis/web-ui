import { Hashtype } from './hashtype.model';

export enum HealthCheckType {
  ONE,
  TWO,
  THREE
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
