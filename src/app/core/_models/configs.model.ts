import { BaseModel } from '@models/base.model';
import { ConfigSectionId } from '@models/id.types';

/**
 * Interface definition for storage config object
 * @extends BaseModel
 * @prop configSectionId ID of related configSection
 * @prop item            Config key
 * @prop value           Config value
 */
export interface JConfig extends BaseModel {
  configSectionId: ConfigSectionId;
  item: string;
  value: string;
}
