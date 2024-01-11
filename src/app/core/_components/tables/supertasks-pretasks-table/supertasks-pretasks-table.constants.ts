export enum SupertasksPretasksTableCol {
  ID,
  NAME,
  PRIORITY,
  MAX_AGENTS
}

export const SupertasksPretasksTableColumnLabel = {
  [SupertasksPretasksTableCol.ID]: 'ID',
  [SupertasksPretasksTableCol.NAME]: 'Name',
  [SupertasksPretasksTableCol.PRIORITY]: 'Priority',
  [SupertasksPretasksTableCol.MAX_AGENTS]: 'Max. Agents'
};

export const SupertasksPretasksTableEditableAction = {
  CHANGE_PRIORITY: 'change-priority',
  CHANGE_MAX_AGENTS: 'change-max-agents'
};
