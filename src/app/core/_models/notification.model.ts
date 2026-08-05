import { BaseModel } from '@models/base.model';
import { UserId } from '@models/id.types';

export type NotificationAction = 'createNotification' | 'setActive' | 'deleteNotification';

export type NotificationEvent =
  | 'taskComplete'
  | 'agentError'
  | 'ownAgentError'
  | 'logError'
  | 'newTask'
  | 'newHashlist'
  | 'hashlistAllCracked'
  | 'hashlistCrackedHash'
  | 'userCreated'
  | 'userDeleted'
  | 'userLoginFailed'
  | 'logWarn'
  | 'logFatal'
  | 'newAgent'
  | 'deleteTask'
  | 'deleteHashlist'
  | 'deleteAgent';

/**
 * Interface definition for user notification
 * @extends BaseModel
 */
export interface JNotification extends BaseModel {
  action: NotificationAction;
  isActive: boolean;
  notification: NotificationEvent;
  receiver: string;
  userId: UserId;
  objectId?: number | null | undefined;
}
