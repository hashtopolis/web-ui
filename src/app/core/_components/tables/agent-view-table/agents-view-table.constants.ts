export enum AgentsViewTableCol {
  ID,
  NAME,
  TEMPERATURE,
  DEVICE_UTILISATION,
  CPU_UTILISATION
}

export const AgentsViewTableColumnLabel = {
  [AgentsViewTableCol.ID]: 'ID',
  [AgentsViewTableCol.NAME]: 'Name',
  [AgentsViewTableCol.DEVICE_UTILISATION]: 'Device Utilisation',
  [AgentsViewTableCol.TEMPERATURE]: 'Temperature',
  [AgentsViewTableCol.CPU_UTILISATION]: 'CPU Utilisation'
};
