export interface Notification {
  _id: number,
  _self: string,
  action: string,
  isActive: boolean,
  notification: string,
  receiver: string,
  userId: number,
  notificationSettingId?: number,
  objectId?: number,
}