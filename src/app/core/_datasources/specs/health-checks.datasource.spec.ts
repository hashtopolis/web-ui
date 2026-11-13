import { HttpHeaderName } from '@constants/http.config';
import { throwError } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';

import { FilterType } from '@models/request-params.model';

import { SERV } from '@services/main.config';

import { HealthChecksDataSource } from '@datasources/health-checks.datasource';

import { setupDatasource } from '@src/app/testing/datasource-test-setup';

describe('HealthChecksDataSource', () => {
  it('loads health checks with their hash type relationship', () => {
    const { dataSource, service } = setupDatasource(HealthChecksDataSource);
    dataSource.loadAll();
    const [resource, params, options] = service.getAll.mock.lastCall!;
    expect(resource).toBe(SERV.HEALTH_CHECKS);
    expect(options?.headers?.get(HttpHeaderName.SKIP_ERROR_DIALOG)).toBe('true');
    expect(params!.include).toContain('hashType');
  });

  it('retains filters, clears them on request, and clears selection on reload', () => {
    const { dataSource, service } = setupDatasource(HealthChecksDataSource);
    const filter = { field: 'name', operator: FilterType.EQUAL, value: 'sample' };
    dataSource.loadAll(filter);
    dataSource.loadAll();
    expect(service.getAll.mock.lastCall![1]!.filter).toContainEqual(filter);

    dataSource.pageAfter = 'cursor-after';
    dataSource.pageBefore = 'cursor-before';
    dataSource.index = 2;
    dataSource.clearFilter();
    expect(service.getAll.mock.lastCall![1]!.filter ?? []).not.toContainEqual(filter);
    expect(dataSource.index).toBe(0);
    expect(dataSource.pageAfter).toBeNull();
    expect(dataSource.pageBefore).toBeNull();
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

  it('emits filter errors, retains existing rows, and finishes loading after a failed request', () => {
    const { dataSource, service } = setupDatasource(HealthChecksDataSource);
    const row = { id: 5, type: 'healthCheck' } as never;
    const errors: string[] = [];
    dataSource.setData([row]);
    dataSource.filterError$.subscribe((message) => errors.push(message));
    service.getAll.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { title: 'Invalid filter' } }))
    );

    dataSource.loadAll();

    expect(errors).toStrictEqual(['Invalid filter']);
    expect(dataSource.getOriginalData()).toStrictEqual([row]);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });
});
