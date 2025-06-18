export interface AgentErrorTable {
}
export enum AgentErrorTableCol {
  ID,
  TIME ,
  TASK ,
  CHUNK ,
  MESSAGE,
}

export const  AgentErrorTableColumnLabel = {
  [AgentErrorTableCol.ID]: 'ID',
  [AgentErrorTableCol.TIME]: 'Time',
  [AgentErrorTableCol.TASK]: 'Task',
  [AgentErrorTableCol.CHUNK]: 'Chunk',
  [AgentErrorTableCol.MESSAGE]: 'Message',
};