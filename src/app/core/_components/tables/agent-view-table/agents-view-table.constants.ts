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
  NAME,
  STATUS,
  AGENT_STATUS,
  WORKING_ON
  /*   ASSIGNED,
  LAST_ACTIVITY */
}

export const AgentsViewTableColumnLabel = {
  [AgentsViewTableCol.ID]: 'ID',
  [AgentsViewTableCol.NAME]: 'Name',
  [AgentsViewTableCol.STATUS]: 'Device Utilisation',
  [AgentsViewTableCol.AGENT_STATUS]: 'Temperature',
  [AgentsViewTableCol.WORKING_ON]: 'CPU Utilisation'
  /*   [AgentsViewTableCol.ASSIGNED]: 'Assigned to',
  [AgentsViewTableCol.LAST_ACTIVITY]: 'Last Activity' */
};
