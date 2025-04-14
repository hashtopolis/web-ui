import { BaseModel } from '@src/app/core/_models/base.model';

/**
 * Interface definition for user notification
 * @extends BaseModel
 */
export interface JNotification extends BaseModel {
  action: string;
  isActive: boolean;
  notification: string;
  receiver: string;
  userId: number;
  objectId?: number;
}
