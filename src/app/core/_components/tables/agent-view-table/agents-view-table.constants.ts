export enum AgentsViewTableCol {
  ID,
  NAME,
  STATUS,
  DEVICE_UTILISATION,
  TEMPERATURE,
  CPU_UTILISATION,
  LAST_ACTIVITY,
  WORKING_ON
}

export const AgentsViewTableColumnLabel = {
  [AgentsViewTableCol.ID]: 'ID',
  [AgentsViewTableCol.NAME]: 'Name',
  [AgentsViewTableCol.STATUS]: 'Status',
  [AgentsViewTableCol.DEVICE_UTILISATION]: 'Average Device Utilisation',
  [AgentsViewTableCol.TEMPERATURE]: 'Max Temperature',
  [AgentsViewTableCol.CPU_UTILISATION]: 'Average CPU Utilisation',
  [AgentsViewTableCol.WORKING_ON]: 'Currently working on',
  [AgentsViewTableCol.LAST_ACTIVITY]: 'Last Activity'
};
