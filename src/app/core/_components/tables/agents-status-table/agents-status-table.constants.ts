export enum AgentsStatusTableCol {
  ID,
  STATUS,
  NAME,
  AGENT_STATUS,
  WORKING_ON,
  ASSIGNED,
  LAST_ACTIVITY
}

export const AgentsStatusTableColumnLabel = {
  [AgentsStatusTableCol.ID]: 'ID',
  [AgentsStatusTableCol.STATUS]: 'Status',
  [AgentsStatusTableCol.NAME]: 'Name',
  [AgentsStatusTableCol.AGENT_STATUS]: 'Agent Status',
  [AgentsStatusTableCol.WORKING_ON]: 'Currently working on',
  [AgentsStatusTableCol.ASSIGNED]: 'Assigned to',
  [AgentsStatusTableCol.LAST_ACTIVITY]: 'Last Activity'
};
