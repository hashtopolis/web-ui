/* export enum AgentsViewTableCol {
  ID,
  NAME,
  TEMPERATURE,
  DEVICE_UTILISATION,
  CPU_UTILISATION
}

export const AgentsViewTableColumnLabel = {
  [AgentsViewTableCol.ID]: 'ID',
  [AgentsViewTableCol.NAME]: 'Name',
  [AgentsViewTableCol.DEVICE_UTILISATION]: 'Device Utilisation',
  [AgentsViewTableCol.TEMPERATURE]: 'Temperature',
  [AgentsViewTableCol.CPU_UTILISATION]: 'CPU Utilisation'
}; */
export enum AgentsViewTableCol {
  ID,
  STATUS,
  NAME,
  AGENT_STATUS,
  WORKING_ON,
  ASSIGNED,
  LAST_ACTIVITY
}

export const AgentsViewTableColumnLabel = {
  [AgentsViewTableCol.ID]: 'ID',
  [AgentsViewTableCol.STATUS]: 'Status',
  [AgentsViewTableCol.NAME]: 'Name',
  [AgentsViewTableCol.AGENT_STATUS]: 'Agent Status',
  [AgentsViewTableCol.WORKING_ON]: 'Currently working on',
  [AgentsViewTableCol.ASSIGNED]: 'Assigned to',
  [AgentsViewTableCol.LAST_ACTIVITY]: 'Last Activity'
};
