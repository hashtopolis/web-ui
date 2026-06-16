import { BaseModel } from '@models/base.model';
import { JFile } from '@models/file.model';
import { CrackerBinaryTypeId } from '@models/id.types';

/**
 * Interface definition for a pretask
 * @extends BaseModel
 */
export interface JPretask extends BaseModel {
  attackCmd: string;
  chunkTime: number;
  color: string;
  crackerBinaryTypeId: CrackerBinaryTypeId;
  isCpuTask: boolean;
  isMaskImport: boolean;
  isSmall: boolean;
  maxAgents: number;
  pretaskFiles?: JFile[];
  priority: number;
  statusTimer: number;
  taskName: string;
  useNewBench: boolean;
  // Aggregate field `auxiliaryKeyspace` is intentionally NOT here — see JPretaskAggregates / JPretaskWith below.
}

/**
 * Aggregate fields on a pretask — NOT on the base `JPretask`; present in the result type only when requested
 * via `aggregate[..]=`. This interface is the source of their types.
 */
export interface JPretaskAggregateFields {
  auxiliaryKeyspace: number;
}

/** Aggregate field keys on JPretask. */
export type JPretaskAggregates = keyof JPretaskAggregateFields;

/** Pretask with only the chosen subset of aggregate fields present. */
export type JPretaskWith<K extends JPretaskAggregates> = JPretask & Pick<JPretaskAggregateFields, K>;
