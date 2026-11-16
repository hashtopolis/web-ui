import { HttpHeaderName } from '@constants/http.config';
import { throwError } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';

import { FilterType } from '@models/request-params.model';

import { SERV } from '@services/main.config';

import { SuperTasksDataSource } from '@datasources/supertasks.datasource';

import { setupDatasource } from '@src/app/testing/datasource-test-setup';

describe('SuperTasksDataSource', () => {
  it('loads supertasks', () => {
    const { dataSource, service } = setupDatasource(SuperTasksDataSource);
    dataSource.loadAll();
    const [resource, params, options] = service.getAll.mock.lastCall!;
    expect(resource).toBe(SERV.SUPER_TASKS);
    expect(params!.aggregate).toContainEqual(
      expect.objectContaining({ field: 'supertask', values: ['amountPretasks'] })
    );
    expect(options?.headers?.get(HttpHeaderName.SKIP_ERROR_DIALOG)).toBe('true');
  });

  it('retains filters, clears them on request, and clears selection on reload', () => {
    const { dataSource, service } = setupDatasource(SuperTasksDataSource);
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

  it('ends loading and emits a validation error when the request fails', () => {
    const { dataSource, service } = setupDatasource(SuperTasksDataSource);
    const existingRow = { id: 17, type: 'existing' } as never;
    dataSource.setData([existingRow]);
    const messages: string[] = [];
    dataSource.filterError$.subscribe((message) => messages.push(message));
    service.getAll.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { title: 'Invalid filter' } }))
    );

    dataSource.loadAll({ field: 'invalid', operator: FilterType.EQUAL, value: 'x' });

    expect(messages).toStrictEqual(['Invalid filter']);
    expect(dataSource.getOriginalData()).toStrictEqual([existingRow]);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });
});
