export enum PretasksTableCol {
  ID,
  NAME,
  ATTACK_COMMAND,
  FILES_TOTAL,
  FILES_SIZE,
  PRIORITY,
  MAX_AGENTS,
  ESTIMATED_KEYSPACE,
  ATTACK_RUNTIME
}

export const PretasksTableColumnLabel = {
  [PretasksTableCol.ID]: 'ID',
  [PretasksTableCol.NAME]: 'Name',
  [PretasksTableCol.ATTACK_COMMAND]: 'Attack command',
  [PretasksTableCol.FILES_TOTAL]: 'Overall count',
  [PretasksTableCol.FILES_SIZE]: 'Total Size',
  [PretasksTableCol.PRIORITY]: 'Priority',
  [PretasksTableCol.MAX_AGENTS]: 'Max Agents',
  [PretasksTableCol.ESTIMATED_KEYSPACE]: 'Estimated Keyspace',
  [PretasksTableCol.ATTACK_RUNTIME]: 'Attack Runtime'
};

export const PretasksTableEditableAction = {
  CHANGE_PRIORITY: 'change-priority',
  CHANGE_MAX_AGENTS: 'change-max-agents'
};
