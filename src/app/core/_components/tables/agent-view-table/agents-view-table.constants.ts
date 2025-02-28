export enum AgentsViewTableCol {
  ID,
  NAME,
  DEVICE_UTILISATION,
  TEMPERATURE,
  CPU_UTILISATION
}

export const AgentsViewTableColumnLabel = {
  [AgentsViewTableCol.ID]: 'ID',
  [AgentsViewTableCol.NAME]: 'Name',
  [AgentsViewTableCol.DEVICE_UTILISATION]: 'Average Device Utilisation',
  [AgentsViewTableCol.TEMPERATURE]: 'Max Temperature',
  [AgentsViewTableCol.CPU_UTILISATION]: 'Average CPU Utilisation'
};
