import { BaseModel } from '@models/base.model';

/**
 * Interface definition for voucher to register cracking agents
 * @extends BaseModel
 * @prop time     Timestamp
 * @prop voucher  Voucher value
 */
export interface Voucher extends BaseModel {
  time: number;
  voucher: string;
}
