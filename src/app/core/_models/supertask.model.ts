import { Pretask } from './pretask.model';

export interface SuperTask {
  _id: number;
  _self: string;
  pretasks?: Pretask[];
  supertaskId: number;
  supertaskName: string;
}
