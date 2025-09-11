export enum AgentsStatusTableCol {
  ID,
  STATUS,
  NAME,
  AGENT_STATUS,
  WORKING_ON,
  ASSIGNED,
  LAST_ACTIVITY,
  GPU_UTILISATION,
  GPU_TEMPERATURE,
  CPU_UTILISATION
}

export const AgentsStatusTableColumnLabel = {
  [AgentsStatusTableCol.ID]: 'ID',
  [AgentsStatusTableCol.NAME]: 'Name',
  [AgentsStatusTableCol.STATUS]: 'Status',
  [AgentsStatusTableCol.AGENT_STATUS]: 'Agent Status',
  [AgentsStatusTableCol.WORKING_ON]: 'Currently working on',
  [AgentsStatusTableCol.ASSIGNED]: 'Assigned to',
  [AgentsStatusTableCol.LAST_ACTIVITY]: 'Last Activity',
  [AgentsStatusTableCol.GPU_UTILISATION]: 'Average GPU Utilisation (24h)',
  [AgentsStatusTableCol.GPU_TEMPERATURE]: 'Max GPU Temperature (24h)',
  [AgentsStatusTableCol.CPU_UTILISATION]: 'Average CPU Utilisation (24h)'
};
