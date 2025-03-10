import { Hashtype, HashtypeDataAttributes } from './hashtype.model';

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





export interface HealthCheckData {
  type: string;
  id: number;
  attributes: HealthCheckAttributes;
  links: HealthCheckDataLinks;
  relationships: HealthCheckRelationships;
}

export interface HealthCheckAttributes {
  time: number;
  status: number;
  checkType: number;
  hashtypeId: number;
  crackerBinaryId: number;
  expectedCracks: number;
  attackCmd: string;
  hashtype?: HashtypeDataAttributes;
}

export interface HealthCheckDataLinks {
  self: string;
}

export interface HealthCheckRelationships {
  crackerBinary: HealthCheckRelationshipsAttributes;
  healthCheckAgents: HealthCheckRelationshipsAttributes;
}

export interface HealthCheckRelationshipsAttributes {
  links: HealthCheckRelationshipsAttributesLinks;
}

export interface HealthCheckRelationshipsAttributesLinks {
  self: string;
  related: string;
}
