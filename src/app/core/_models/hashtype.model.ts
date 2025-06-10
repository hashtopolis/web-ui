import { BaseModel } from '@models/base.model';

/**
 * Interface definition for a hash type (e.g. MD5)
 * @extends BaseModel
 * @prop description  Description of hash type
 * @prop isSalted     true: Hashtype is salted, else false
 * @prop isSlowHash   true: Hashtype is a slow hash, else false
 */
export interface JHashtype extends BaseModel {
  description: string;
  isSalted: boolean;
  isSlowHash: boolean;
}
