import { BaseModel } from '@models/base.model';
import { UserId } from '@models/id.types';

/**
 * Interface definition for user notification
 * @extends BaseModel
 */
export interface JNotification extends BaseModel {
  action: string;
  isActive: boolean;
  notification: string;
  receiver: string;
  userId: UserId;
  objectId?: number;
}
