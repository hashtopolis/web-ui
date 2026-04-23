import { BaseModel } from '@models/base.model';
import { UserId } from '@models/id.types';

/** Notification action values matching the generated Zod schema. */
export type NotificationAction = 'createNotification' | 'setActive' | 'deleteNotification';

/** Notification event type values matching the generated Zod schema. */
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
  objectId?: number;
}
