export enum AgentsStatusTableCol {
  ID,
  STATUS,
  NAME,
  AGENT_STATUS,
  WORKING_ON,
  ASSIGNED,
  LAST_ACTIVITY,
  DEVICE_UTILISATION,
  TEMPERATURE,
  CPU_UTILISATION
}

export const AgentsStatusTableColumnLabel = {
  [AgentsStatusTableCol.ID]: 'ID',
  [AgentsStatusTableCol.STATUS]: 'Status',
  [AgentsStatusTableCol.NAME]: 'Name',
  [AgentsStatusTableCol.AGENT_STATUS]: 'Agent Status',
  [AgentsStatusTableCol.WORKING_ON]: 'Currently working on',
  [AgentsStatusTableCol.ASSIGNED]: 'Assigned to',
  [AgentsStatusTableCol.LAST_ACTIVITY]: 'Last Activity',
  [AgentsStatusTableCol.DEVICE_UTILISATION]: 'Average GPU Utilization',
  [AgentsStatusTableCol.TEMPERATURE]: 'Max GPU Temperature',
  [AgentsStatusTableCol.CPU_UTILISATION]: 'Average CPU Utilisation'
};
