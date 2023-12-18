export enum HealthChecksViewTableCol {
  AGENT_ID,
  AGENT_NAME,
  STATUS,
  START,
  GPUS,
  CRACKED,
  ERRORS
}

export const HealthChecksViewTableColumnLabel = {
  [HealthChecksViewTableCol.AGENT_ID]: 'Id',
  [HealthChecksViewTableCol.AGENT_NAME]: 'Name',
  [HealthChecksViewTableCol.STATUS]: 'Status',
  [HealthChecksViewTableCol.START]: 'Start',
  [HealthChecksViewTableCol.GPUS]: 'Number of Devices',
  [HealthChecksViewTableCol.CRACKED]: 'Cracked',
  [HealthChecksViewTableCol.ERRORS]: 'Errors'
};
