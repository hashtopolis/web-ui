import { throwError } from 'rxjs';

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
    expect(params!.filter).toStrictEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'healthCheckId', value: 13 })])
    );
    expect(params!.include).toContain('agent');
  });

  it('reloads the resource after clearing the current selection', () => {
    const { dataSource, service } = setupDatasource(HealthCheckAgentsDataSource);
    dataSource.selection.select({} as never);

    dataSource.reload();

    expect(dataSource.selection.hasValue()).toBe(false);
    expect(service.getAll).toHaveBeenCalledWith(SERV.HEALTH_CHECKS_AGENTS, expect.anything());
  });

  it('keeps existing rows and finishes loading when the request fails', () => {
    const { dataSource, service } = setupDatasource(HealthCheckAgentsDataSource);
    const row = { id: 8 } as never;
    dataSource.setData([row]);
    service.getAll.mockReturnValue(throwError(() => new Error('request failed')));

    dataSource.loadAll();

    expect(dataSource.getOriginalData()).toStrictEqual([row]);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });
});
