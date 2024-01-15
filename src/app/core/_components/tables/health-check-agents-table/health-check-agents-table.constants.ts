export enum HealthCheckAgentsTableCol {
  AGENT_ID,
  AGENT_NAME,
  STATUS,
  START,
  GPUS,
  CRACKED,
  ERRORS
}

export const HealthCheckAgentsTableColColumnLabel = {
  [HealthCheckAgentsTableCol.AGENT_ID]: 'Id',
  [HealthCheckAgentsTableCol.AGENT_NAME]: 'Name',
  [HealthCheckAgentsTableCol.STATUS]: 'Status',
  [HealthCheckAgentsTableCol.START]: 'Start',
  [HealthCheckAgentsTableCol.GPUS]: 'Number of Devices',
  [HealthCheckAgentsTableCol.CRACKED]: 'Cracked',
  [HealthCheckAgentsTableCol.ERRORS]: 'Errors'
};
