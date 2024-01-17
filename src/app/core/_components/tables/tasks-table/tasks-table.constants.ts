export enum TaskTableCol {
  ID,
  TASK_TYPE,
  NAME,
  STATUS,
  IS_SMALL,
  IS_CPU_TASK,
  PREPROCESSOR,
  HASHTYPE,
  HASHLISTS,
  DISPATCHED_SEARCHED,
  CRACKED,
  AGENTS,
  PRIORITY,
  MAX_AGENTS,
  ACCESS_GROUP
}

export const TaskTableColumnLabel = {
  [TaskTableCol.ID]: 'ID',
  [TaskTableCol.TASK_TYPE]: 'Task type',
  [TaskTableCol.NAME]: 'Name',
  [TaskTableCol.STATUS]: 'Status',
  [TaskTableCol.IS_SMALL]: 'Small Task',
  [TaskTableCol.IS_CPU_TASK]: 'CPU Task',
  [TaskTableCol.PREPROCESSOR]: 'Preprocessor',
  [TaskTableCol.HASHTYPE]: 'Hashtype',
  [TaskTableCol.HASHLISTS]: 'Hashlists',
  [TaskTableCol.DISPATCHED_SEARCHED]: 'Dispatched/Searched',
  [TaskTableCol.CRACKED]: 'Cracked',
  [TaskTableCol.AGENTS]: 'Agents',
  [TaskTableCol.PRIORITY]: 'Task Priority',
  [TaskTableCol.MAX_AGENTS]: 'Max Agents',
  [TaskTableCol.ACCESS_GROUP]: 'Access Group'
};

export const TaskTableEditableAction = {
  CHANGE_PRIORITY: 'change-priority',
  CHANGE_MAX_AGENTS: 'change-max-agents'
};

export enum TaskStatus {
  INVALID,
  RUNNING,
  COMPLETED,
  IDLE
}
