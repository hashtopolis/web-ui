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
  START,
  LENGTH,
  CHECKPOINT,
  PROGRESS,
  TASK,
  AGENT,
  DISPATCH_TIME,
  LAST_ACTIVITY,
  TIME_SPENT,
  STATE,
  CRACKED
}

export const AgentsViewTableColumnLabel = {
  [AgentsViewTableCol.ID]: 'ID',
  [AgentsViewTableCol.START]: 'Start',
  [AgentsViewTableCol.LENGTH]: 'Length',
  [AgentsViewTableCol.CHECKPOINT]: 'Checkpoint',
  [AgentsViewTableCol.PROGRESS]: 'Progress',
  [AgentsViewTableCol.TASK]: 'Task',
  [AgentsViewTableCol.AGENT]: 'Agent',
  [AgentsViewTableCol.DISPATCH_TIME]: 'Dispatch Time',
  [AgentsViewTableCol.LAST_ACTIVITY]: 'Last Activity',
  [AgentsViewTableCol.TIME_SPENT]: 'Time Spent',
  [AgentsViewTableCol.STATE]: 'State',
  [AgentsViewTableCol.CRACKED]: 'Cracked'
};
