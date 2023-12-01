export enum LogsTableCol {
  ID,
  TIME,
  LEVEL,
  ISSUER,
  MESSAGE
}

export const LogsTableColumnLabel = {
  [LogsTableCol.ID]: 'ID',
  [LogsTableCol.TIME]: 'Time',
  [LogsTableCol.LEVEL]: 'Level',
  [LogsTableCol.ISSUER]: 'Issuer',
  [LogsTableCol.MESSAGE]: 'Message'
};
