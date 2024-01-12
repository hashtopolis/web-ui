export enum PretasksTableCol {
  ID,
  NAME,
  ATTACK_COMMAND,
  FILES_TOTAL,
  FILES_SIZE,
  PRIORITY,
  MAX_AGENTS
}

export const PretasksTableColumnLabel = {
  [PretasksTableCol.ID]: 'ID',
  [PretasksTableCol.NAME]: 'Name',
  [PretasksTableCol.ATTACK_COMMAND]: 'Attack command',
  [PretasksTableCol.FILES_TOTAL]: 'Overall count',
  [PretasksTableCol.FILES_SIZE]: 'Total Size',
  [PretasksTableCol.PRIORITY]: 'Priority',
  [PretasksTableCol.MAX_AGENTS]: 'Max Agents'
};
