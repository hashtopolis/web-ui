import { HealthCheckStatus } from '@models/health-check.model';

import { HealthCheckStatusPipe } from '@src/app/core/_pipes/healthcheck-status.pipe';

describe('HealthCheckStatusPipe', () => {
  const pipe = new HealthCheckStatusPipe();

  it.each([
    [HealthCheckStatus.RUNNING, 'RUNNING'],
    [HealthCheckStatus.COMPLETED, 'COMPLETED'],
    [HealthCheckStatus.ABORTED, 'ABORTED']
  ])('returns %s as its status label', (status, expected) => {
    const result = pipe.transform(status);

    expect(result).toBe(expected);
  });

  it.each([-2, 2])('returns an empty string for unknown status %s', (status) => {
    const result = pipe.transform(status);

    expect(result).toBe('');
  });
});
