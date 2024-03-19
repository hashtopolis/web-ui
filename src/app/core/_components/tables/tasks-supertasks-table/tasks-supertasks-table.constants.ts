export enum TasksSupertasksDataSourceTableCol {
  ID,
  NAME,
  DISPATCHED_SEARCHED,
  CRACKED,
  AGENTS,
  PRIORITY,
  MAX_AGENTS
}

export const TasksSupertasksDataSourceTableColumnLabel = {
  [TasksSupertasksDataSourceTableCol.ID]: 'ID',
  [TasksSupertasksDataSourceTableCol.NAME]: 'Name',
  [TasksSupertasksDataSourceTableCol.DISPATCHED_SEARCHED]:
    'Dispatched / Searched',
  [TasksSupertasksDataSourceTableCol.CRACKED]: 'Cracked',
  [TasksSupertasksDataSourceTableCol.AGENTS]: 'Agents',
  [TasksSupertasksDataSourceTableCol.PRIORITY]: 'Priority',
  [TasksSupertasksDataSourceTableCol.MAX_AGENTS]: 'Max. Agents'
};

export const TasksSupertasksDataSourceTableEditableAction = {
  CHANGE_PRIORITY: 'change-priority',
  CHANGE_MAX_AGENTS: 'change-max-agents'
};
