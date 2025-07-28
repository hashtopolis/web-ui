export enum TasksAgentsTableCol {
  ID,
  STATUS,
  NAME,
  USER,
  CLIENT,
  GPUS_CPUS,
  LAST_ACTIVITY,
  ACCESS_GROUP,
  CURRENT_TASK,
  CURRENT_CHUNK,
  TASK_SPEED,
  BENCHMARK,
  TIME_SPENT,
  SEARCHED,
  CRACKED
}

export const TasksAgentsTableColumnLabel = {
  [TasksAgentsTableCol.ID]: 'ID',
  [TasksAgentsTableCol.STATUS]: 'Status',
  [TasksAgentsTableCol.NAME]: 'Name',
  [TasksAgentsTableCol.USER]: 'Owner',
  [TasksAgentsTableCol.CLIENT]: 'Client',
  [TasksAgentsTableCol.GPUS_CPUS]: 'GPUs/CPUs',
  [TasksAgentsTableCol.LAST_ACTIVITY]: 'Last Activity',
  [TasksAgentsTableCol.ACCESS_GROUP]: 'Access Group',
  [TasksAgentsTableCol.CURRENT_TASK]: 'Task',
  [TasksAgentsTableCol.CURRENT_CHUNK]: 'Chunk',
  [TasksAgentsTableCol.TASK_SPEED]: 'Speed',
  [TasksAgentsTableCol.BENCHMARK]: 'Benchmark',
  [TasksAgentsTableCol.TIME_SPENT]: 'Time Spent',
  [TasksAgentsTableCol.SEARCHED]: 'Keyspace Searched',
  [TasksAgentsTableCol.CRACKED]: 'Cracked'
};

export const AgentTableEditableAction = {
  CHANGE_BENCHMARK: 'change-benchmark'
};
