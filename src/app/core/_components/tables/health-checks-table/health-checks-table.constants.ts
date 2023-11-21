import { HealthCheckStatus } from 'src/app/core/_models/health-check.model';

export const HealthChecksTableColumnLabel = {
  ID: 'ID',
  CREATED: 'Created',
  TYPE: 'Type',
  STATUS: 'Status'
};

export const HealthChecksTableStatusLabel = {
  [HealthCheckStatus.RUNNING]: 'Running',
  [HealthCheckStatus.ABORTED]: 'Aborted',
  [HealthCheckStatus.COMPLETED]: 'Completed'
};
