export enum ChunksTableCol {
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

export const ChunksTableColumnLabel = {
  [ChunksTableCol.ID]: 'ID',
  [ChunksTableCol.START]: 'Start',
  [ChunksTableCol.LENGTH]: 'Length',
  [ChunksTableCol.CHECKPOINT]: 'Checkpoint',
  [ChunksTableCol.PROGRESS]: 'Progress',
  [ChunksTableCol.TASK]: 'Task',
  [ChunksTableCol.AGENT]: 'Agent',
  [ChunksTableCol.DISPATCH_TIME]: 'Dispatch Time',
  [ChunksTableCol.LAST_ACTIVITY]: 'Last Activity',
  [ChunksTableCol.TIME_SPENT]: 'Time Spent',
  [ChunksTableCol.STATE]: 'State',
  [ChunksTableCol.CRACKED]: 'Cracked'
};
