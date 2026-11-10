import { SERV } from '@services/main.config';

import { HealthCheckAgentsDataSource } from '@datasources/health-check-agents.datasource';
import { setupDatasource } from '@datasources/specs/datasource-test-setup-util';

describe('HealthCheckAgentsDataSource', () => {
  it('loads health check agents for the selected health check and includes agents', () => {
    const { dataSource, service } = setupDatasource(HealthCheckAgentsDataSource);
    const ds = dataSource;
    ds.setHealthCheckId(13);
    ds.loadAll();
    expect(service.getAll.mock.lastCall![0]).toBe(SERV.HEALTH_CHECKS_AGENTS);
    const [, params] = service.getAll.mock.lastCall!;
    expect(params.filter).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'healthCheckId', value: 13 })])
    );
    expect(params.include).toContain('agent');
  });
});
