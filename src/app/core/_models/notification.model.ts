import { BaseModel } from '@src/app/core/_models/base.model';

export interface NotificationListResponse {
  _expandable: string;
  startAt: number;
  maxResults: number;
  total: number;
  isLast: boolean;
  values: Notification[];
}

export interface Notification {
  _id: number;
  _self: string;
  action: string;
  isActive: boolean;
  notification: string;
  receiver: string;
  userId: number;
  notificationSettingId?: number;
  objectId?: number;
}

export interface JNotification extends BaseModel {
  action: string;
  isActive: boolean;
  notification: string;
  receiver: string;
  userId: number;
  objectId?: number;
}

export interface NotificationData {
  type: string;
  id: number;
  attributes: NotificationAttributes;
  links: NotificationDataLinks;
  relationships: NotificationRelationships;
}

export interface NotificationAttributes {
  action: string;
  objectId: null;
  notification: string;
  userId: number;
  receiver: string;
  isActive: boolean;
}

export interface NotificationDataLinks {
  self: string;
}

export interface NotificationRelationships {
  user: NotificationRelationshipAttributes;
}

export interface NotificationRelationshipAttributes {
  links: NotificationRelationshipsLinks;
}

export interface NotificationRelationshipsLinks {
  self: string;
  related: string;
}
