export enum AgentsViewTableCol {
  ID,
  NAME,
  DEVICE_UTILISATION,
  TEMPERATURE,
  CPU_UTILISATION,
  AGENT_STATUS,
  LAST_ACTIVITY
}

export const AgentsViewTableColumnLabel = {
  [AgentsViewTableCol.ID]: 'ID',
  [AgentsViewTableCol.NAME]: 'Name',
  [AgentsViewTableCol.DEVICE_UTILISATION]: 'Average Device Utilisation',
  [AgentsViewTableCol.TEMPERATURE]: 'Max Temperature',
  [AgentsViewTableCol.CPU_UTILISATION]: 'Average CPU Utilisation',
  [AgentsViewTableCol.AGENT_STATUS]: 'Agent Status',
  [AgentsViewTableCol.LAST_ACTIVITY]: 'Last Activity'
};
