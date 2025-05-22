export enum AgentsStatusTableCol {
  ID,
  STATUS,
  NAME,
  AGENT_STATUS,
  WORKING_ON,
  ASSIGNED,
  LAST_ACTIVITY,
  GPU_UTILIZATION,
  GPU_TEMPERATURE,
  CPU_UTILIZATION
}

export const AgentsStatusTableColumnLabel = {
  [AgentsStatusTableCol.ID]: 'ID',
  [AgentsStatusTableCol.NAME]: 'Name',
  [AgentsStatusTableCol.STATUS]: 'Status',
  [AgentsStatusTableCol.AGENT_STATUS]: 'Agent Status',
  [AgentsStatusTableCol.WORKING_ON]: 'Currently working on',
  [AgentsStatusTableCol.ASSIGNED]: 'Assigned to',
  [AgentsStatusTableCol.LAST_ACTIVITY]: 'Last Activity',
  [AgentsStatusTableCol.GPU_UTILIZATION]: 'Average GPU Utilization',
  [AgentsStatusTableCol.GPU_TEMPERATURE]: 'Max GPU Temperature',
  [AgentsStatusTableCol.CPU_UTILIZATION]: 'Average CPU Utilization'
};
