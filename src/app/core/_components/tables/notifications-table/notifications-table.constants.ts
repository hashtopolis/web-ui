export enum NotificationsTableCol {
  ID,
  STATUS,
  APPLIED_TO,
  ACTION,
  NOTIFICATION,
  RECEIVER
}

export const NotificationsTableColumnLabel = {
  [NotificationsTableCol.ID]: 'ID',
  [NotificationsTableCol.STATUS]: 'Status',
  [NotificationsTableCol.APPLIED_TO]: 'Applied To',
  [NotificationsTableCol.ACTION]: 'Trigger Action',
  [NotificationsTableCol.NOTIFICATION]: 'Called Notification',
  [NotificationsTableCol.RECEIVER]: 'Receiver'
};
