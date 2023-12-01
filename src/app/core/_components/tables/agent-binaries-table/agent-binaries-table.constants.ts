export enum AgentBinariesTableCol {
  ID,
  TYPE,
  OS,
  FILENAME,
  VERSION,
  UPDATE_TRACK
}

export const AgentBinariesTableColumnLabel = {
  [AgentBinariesTableCol.ID]: 'ID',
  [AgentBinariesTableCol.TYPE]: 'Type',
  [AgentBinariesTableCol.OS]: 'OS',
  [AgentBinariesTableCol.FILENAME]: 'Filename',
  [AgentBinariesTableCol.VERSION]: 'Current Version',
  [AgentBinariesTableCol.UPDATE_TRACK]: 'Update Track'
};
