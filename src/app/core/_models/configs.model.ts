import { BaseModel } from './base.model';

/**
 * Interface definition for storage config object
 * @extends BaseModel
 * @prop configSectionId ID of related configSection
 * @prop item            Config key
 * @prop value           Config value
 */
export interface JConfig extends BaseModel {
  configSectionId: number;
  item: string;
  value: string;
}
