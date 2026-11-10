import { throwError } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';

import { SERV } from '@services/main.config';

import { setupDatasource } from '@datasources/specs/datasource-test-setup-util';
import { UsersDataSource } from '@datasources/users.datasource';

describe('UsersDataSource', () => {
  it('loads users with global permission group data', () => {
    const { dataSource, service } = setupDatasource(UsersDataSource);
    dataSource.loadAll();
    const [resource, params] = service.getAll.mock.lastCall!;
    expect(resource).toBe(SERV.USERS);
    expect(params.include).toContain('globalPermissionGroup');
  });

  it('retains filters, clears them on request, and clears selection on reload', () => {
    const { dataSource, service } = setupDatasource(UsersDataSource);
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
    const { dataSource, service } = setupDatasource(UsersDataSource);
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
