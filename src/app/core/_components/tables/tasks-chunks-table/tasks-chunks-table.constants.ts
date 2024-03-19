export enum TasksChunksTableCol {
  ID,
  START,
  LENGTH,
  CHECKPOINT,
  PROGRESS,
  AGENT,
  DISPATCH_TIME,
  LAST_ACTIVITY,
  TIME_SPENT,
  STATE,
  CRACKED
}

export const TasksChunksTableColumnLabel = {
  [TasksChunksTableCol.ID]: 'ID',
  [TasksChunksTableCol.START]: 'Start',
  [TasksChunksTableCol.LENGTH]: 'Length',
  [TasksChunksTableCol.CHECKPOINT]: 'Checkpoint',
  [TasksChunksTableCol.PROGRESS]: 'Progress',
  [TasksChunksTableCol.AGENT]: 'Agent',
  [TasksChunksTableCol.DISPATCH_TIME]: 'Dispatch Time',
  [TasksChunksTableCol.LAST_ACTIVITY]: 'Last Activity',
  [TasksChunksTableCol.TIME_SPENT]: 'Time Spent',
  [TasksChunksTableCol.STATE]: 'State',
  [TasksChunksTableCol.CRACKED]: 'Cracked'
};
