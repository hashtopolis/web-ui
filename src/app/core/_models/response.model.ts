import { TJsonApiBody } from 'jsona/lib/JsonaTypes';

export interface ListResponseWrapper<T> {
  jsonapi?: Jsonapi;
  links?: Links;
  meta?: Meta;
  data: T[];
  included?: Included[];

  // OLD
  _expandable: string;
  startAt: number;
  maxResults: number;
  total: number;
  isLast: number;
  values: T[];
  pretasks?: T[];
}

export interface ResponseWrapper extends TJsonApiBody {
  jsonapi?: Jsonapi;
  links?: Links;
  meta?: Meta;
}

export interface Jsonapi {
  version: string;
  ext: string[];
}

export interface Links {
  self: string;
  first: string;
  last: string;
  next: null;
  prev: string;
}

export interface Included {
  type: string;
  id: number;
  attributes: IncludedAttributes;
  links: DataLinks;
  relationships: IncludedRelationships;
}

export interface IncludedAttributes {
  groupName?: string;
  taskName?: string;
  attackCmd?: string;
  chunkTime?: number;
  statusTimer?: number;
  keyspace?: number;
  keyspaceProgress?: number;
  priority?: number;
  maxAgents?: number;
  color?: null | string;
  isSmall?: boolean;
  isCpuTask?: boolean;
  useNewBench?: boolean;
  skipKeyspace?: number;
  crackerBinaryId?: number;
  crackerBinaryTypeId?: number;
  taskWrapperId?: number;
  isArchived?: boolean;
  notes?: string;
  staticChunks?: number;
  chunkSize?: number;
  forcePipe?: boolean;
  preprocessorId?: number;
  preprocessorCommand?: string;
  description?: string;
  isSalted?: boolean;
  isSlowHash?: boolean;
}

export interface DataLinks {
  self: string;
}

export interface IncludedRelationships {
  agentMembers: IncludedRelationshipLinks;
  userMembers: IncludedRelationshipLinks;
}

export interface IncludedRelationshipLinks {
  self: string;
  related: string;
}

export interface Meta {
  count?: number;
  total_count?: number;
}
