export enum CracksTableCol {
  ID,
  FOUND,
  PLAINTEXT,
  HASH,
  HASHLIST,
  AGENT,
  TASK,
  CHUNK,
  TYPE,
  SALT
}

export const CracksTableColumnLabel = {
  [CracksTableCol.ID]: 'ID',
  [CracksTableCol.FOUND]: 'Time Found',
  [CracksTableCol.PLAINTEXT]: 'Plaintext',
  [CracksTableCol.HASH]: 'Hash',
  [CracksTableCol.HASHLIST]: 'Hashlist',
  [CracksTableCol.AGENT]: 'Agent',
  [CracksTableCol.TASK]: 'Task',
  [CracksTableCol.CHUNK]: 'Chunk',
  [CracksTableCol.TYPE]: 'Type',
  [CracksTableCol.SALT]: 'Salt'
};
