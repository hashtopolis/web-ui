import { throwError } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';

import { SERV } from '@services/main.config';

import { PermissionsDataSource } from '@datasources/permissions.datasource';
import { setupDatasource } from '@datasources/specs/datasource-test-setup-util';

describe('PermissionsDataSource', () => {
  it('loads permission groups with their user members', () => {
    const { dataSource, service } = setupDatasource(PermissionsDataSource);
    dataSource.loadAll();
    const [resource, params] = service.getAll.mock.lastCall!;
    expect(resource).toBe(SERV.ACCESS_PERMISSIONS_GROUPS);
    expect(params.include).toContain('userMembers');
  });

  it('retains filters, clears them on request, and clears selection on reload', () => {
    const { dataSource, service } = setupDatasource(PermissionsDataSource);
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

  it('ends loading and emits a validation error when the request fails', () => {
    const { dataSource, service } = setupDatasource(PermissionsDataSource);
    const messages: string[] = [];
    dataSource.filterError$.subscribe((message) => messages.push(message));
    service.getAll.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { title: 'Invalid filter' } }))
    );

    dataSource.loadAll({ field: 'invalid', operator: 'eq' as never, value: 'x' });

    expect(messages).toEqual(['Invalid filter']);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });
});
