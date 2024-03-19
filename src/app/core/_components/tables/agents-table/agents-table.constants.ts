export enum AgentsTableCol {
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

export const AgentsTableColumnLabel = {
  [AgentsTableCol.ID]: 'ID',
  [AgentsTableCol.STATUS]: 'Status',
  [AgentsTableCol.NAME]: 'Name',
  [AgentsTableCol.USER]: 'Owner',
  [AgentsTableCol.CLIENT]: 'Client',
  [AgentsTableCol.GPUS_CPUS]: 'GPUs/CPUs',
  [AgentsTableCol.LAST_ACTIVITY]: 'Last Activity',
  [AgentsTableCol.ACCESS_GROUP]: 'Access Group',
  [AgentsTableCol.CURRENT_TASK]: 'Task',
  [AgentsTableCol.CURRENT_CHUNK]: 'Chunk',
  [AgentsTableCol.TASK_SPEED]: 'Speed',
  [AgentsTableCol.BENCHMARK]: 'Benchmark',
  [AgentsTableCol.TIME_SPENT]: 'Time Spent',
  [AgentsTableCol.SEARCHED]: 'Keyspace Searched',
  [AgentsTableCol.CRACKED]: 'Cracked'
};

export const AgentTableEditableAction = {
  CHANGE_BENCHMARK: 'change-benchmark'
};
