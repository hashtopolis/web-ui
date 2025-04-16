import { BaseModel } from '@models/base.model';
import { JPretask } from '@models/pretask.model';

/**
 * Interface definition for a supertask
 * @extends BaseModel
 * @prop    supertaskName Name of supertask
 * @prop    pretasks      List of pretasks of supertask
 */
export interface JSuperTask extends BaseModel {
  supertaskName: string;
  pretasks?: JPretask[];
}
