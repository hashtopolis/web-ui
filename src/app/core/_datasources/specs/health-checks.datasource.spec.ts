import { SERV } from '@services/main.config';

import { HealthChecksDataSource } from '@datasources/health-checks.datasource';
import { setupDatasource } from '@datasources/specs/datasource-test-setup-util';

describe('HealthChecksDataSource', () => {
  it('loads health checks with their hash type relationship', () => {
    const { dataSource, service } = setupDatasource(HealthChecksDataSource);
    dataSource.loadAll();
    const [resource, params] = service.getAll.mock.lastCall!;
    expect(resource).toBe(SERV.HEALTH_CHECKS);
    expect(params.include).toContain('hashType');
  });

  it('retains filters, clears them on request, and clears selection on reload', () => {
    const { dataSource, service } = setupDatasource(HealthChecksDataSource);
    const filter = { field: 'name', operator: 'eq' as never, value: 'sample' };
    dataSource.loadAll(filter);
    dataSource.loadAll();
    expect(service.getAll.mock.lastCall![1].filter).toContainEqual(filter);

    dataSource.clearFilter();
    expect(service.getAll.mock.lastCall![1].filter ?? []).not.toContainEqual(filter);
    dataSource.selection.select({ id: 1, type: 'fixture' } as never);
    dataSource.reload();
    expect(dataSource.selection.hasValue()).toBe(false);
  });

  it('maps the related hash type description into the row', () => {
    const { dataSource } = setupDatasource(HealthChecksDataSource);
    const row = { id: 2, type: 'healthCheck', hashType: { description: 'SHA256' } } as never;
    vi.spyOn(dataSource.serializer, 'deserialize').mockImplementation(() => [row] as never);

    dataSource.loadAll();

    expect(dataSource.getOriginalData()[0].hashTypeDescription).toBe('SHA256');
  });

  it('retains filters between pages and clears them when requested', () => {
    const { dataSource, service } = setupDatasource(HealthChecksDataSource);
    const filter = { field: 'name', operator: 'eq' as never, value: 'nightly' };
    dataSource.loadAll(filter);
    dataSource.loadAll();
    expect(service.getAll.mock.lastCall![1].filter).toContainEqual(filter);

    dataSource.clearFilter();
    expect(service.getAll.mock.lastCall![1].filter ?? []).not.toContainEqual(filter);
  });
});
