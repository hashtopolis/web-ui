export interface AgentErrorTable {
}
export enum AgentErrorTableCol {
  ID,
  TIME ,
  TASK_ID,
  TASK ,
  CHUNK ,
  MESSAGE,
}

export const  AgentErrorTableColumnLabel = {
  [AgentErrorTableCol.ID]: 'ID',
  [AgentErrorTableCol.TIME]: 'Time',
  [AgentErrorTableCol.TASK_ID]: 'Task ID',
  [AgentErrorTableCol.TASK]: 'Task',
  [AgentErrorTableCol.CHUNK]: 'Chunk',
  [AgentErrorTableCol.MESSAGE]: 'Message',
};