import { BaseModel, With } from '@models/base.model';
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
  // Aggregate field (populated only when requested via aggregate[..]=)
  auxiliaryKeyspace?: number | undefined;
}

/** Keys for aggregate fields on JPretask (populated only when requested via `aggregate[..]=`). */
export type JPretaskAggregates = 'auxiliaryKeyspace';

/** All on-demand conditional fields on JPretask (aggregates only today). */
export type JPretaskConditional = JPretaskAggregates;

/** Pretask with only the chosen subset of on-demand fields present. */
export type JPretaskWith<K extends JPretaskConditional> = With<JPretask, JPretaskConditional, K>;
