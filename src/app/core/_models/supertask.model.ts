import { BaseModel } from '@models/base.model';
import { CrackerBinaryTypeId } from '@models/id.types';
import { JPretask } from '@models/pretask.model';

/**
 * Interface definition for a supertask
 * @extends BaseModel
 * @prop    supertaskName        Name of supertask
 * @prop    crackerBinaryTypeId  Cracker binary type of all pretasks of the supertask
 * @prop    pretasks             List of pretasks of supertask
 */
export interface JSuperTask extends BaseModel {
  supertaskName: string;
  crackerBinaryTypeId: CrackerBinaryTypeId;
  pretasks?: JPretask[];
}

export interface JSuperTaskAggregateFields extends JSuperTask {
  amountPretasks: number;
}

/** Aggregate field keys on JSuperTask. */
export type JSuperTaskAggregates = keyof JSuperTaskAggregateFields;
