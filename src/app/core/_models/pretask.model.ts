import { BaseModel } from '@models/base.model';
import { JFile } from '@models/file.model';
import { CrackerBinaryTypeId, SupertaskPretaskId } from '@models/id.types';

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
  // Association fields, copied onto the row by PreTasksDataSource when the pretasks of a
  // supertask are listed: the priority there belongs to that supertask, not to the pretask.
  supertaskPretaskId?: SupertaskPretaskId;
  supertaskPriority?: number;
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
