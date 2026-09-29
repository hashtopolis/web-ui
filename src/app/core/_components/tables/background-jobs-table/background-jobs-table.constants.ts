export enum BackgroundJobsTableCol {
  ID,
  TYPE,
  STATUS,
  USER,
  CREATED,
  STARTED,
  FINISHED,
  EXIT_CODE,
  MESSAGE,
  PAYLOAD
}

export const BackgroundJobsTableColumnLabel = {
  [BackgroundJobsTableCol.ID]: 'ID',
  [BackgroundJobsTableCol.TYPE]: 'Type',
  [BackgroundJobsTableCol.STATUS]: 'Status',
  [BackgroundJobsTableCol.USER]: 'User',
  [BackgroundJobsTableCol.CREATED]: 'Created',
  [BackgroundJobsTableCol.STARTED]: 'Started',
  [BackgroundJobsTableCol.FINISHED]: 'Finished',
  [BackgroundJobsTableCol.EXIT_CODE]: 'Exit code',
  [BackgroundJobsTableCol.MESSAGE]: 'Message',
  [BackgroundJobsTableCol.PAYLOAD]: 'Payload'
};
