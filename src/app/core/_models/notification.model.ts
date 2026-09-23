import { BaseModel } from '@models/base.model';
import { UserId } from '@models/id.types';

/**
 * The event that triggers a notification. This is the APIv2 `action` attribute of a
 * notification setting (e.g. an agent error or a completed task).
 */
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
 * Interface definition for user notification.
 *
 * Field semantics follow the APIv2 notification-setting resource:
 * - `action` is the triggering event ({@link NotificationEvent}).
 * - `notification` is the delivery method (e.g. ChatBot, Slack, Email). The set is open —
 *   an installation can register its own notification classes — so this is a free string.
 * @extends BaseModel
 */
export interface JNotification extends BaseModel {
  action: NotificationEvent;
  isActive: boolean;
  notification: string;
  receiver: string;
  userId: UserId;
  objectId?: number | null | undefined;
}
