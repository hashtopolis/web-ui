import { BaseModel } from '@models/base.model';
import { PretaskId, SupertaskId } from '@models/id.types';

/**
 * Interface definition for the association of a pretask with a supertask
 * @extends BaseModel
 * @prop    supertaskId  ID of the supertask
 * @prop    pretaskId    ID of the pretask
 * @prop    priority     Priority the pretask has within this supertask
 */
export interface JSupertaskPretask extends BaseModel {
  supertaskId: SupertaskId;
  pretaskId: PretaskId;
  priority: number;
}
