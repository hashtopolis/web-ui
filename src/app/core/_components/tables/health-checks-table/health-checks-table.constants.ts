import { HealthCheckStatus } from 'src/app/core/_models/health-check.model';

export enum HealthChecksTableCol {
  ID,
  CREATED,
  TYPE,
  STATUS
}

export const HealthChecksTableColumnLabel = {
  [HealthChecksTableCol.ID]: 'ID',
  [HealthChecksTableCol.CREATED]: 'Created',
  [HealthChecksTableCol.TYPE]: 'Type',
  [HealthChecksTableCol.STATUS]: 'Status'
};

export const HealthChecksTableStatusLabel = {
  [HealthCheckStatus.RUNNING]: 'Running',
  [HealthCheckStatus.ABORTED]: 'Aborted',
  [HealthCheckStatus.COMPLETED]: 'Completed'
};
