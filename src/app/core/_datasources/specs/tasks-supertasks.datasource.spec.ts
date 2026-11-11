import { throwError } from 'rxjs';

import { SERV } from '@services/main.config';

import { setupDatasource } from '@datasources/specs/datasource-test-setup-util';
import { TasksSupertasksDataSource } from '@datasources/tasks-supertasks.datasource';

describe('TasksSupertasksDataSource', () => {
  it('loads tasks belonging to the selected supertask with aggregate fields', () => {
    const { dataSource, service } = setupDatasource(TasksSupertasksDataSource);
    const ds = dataSource;
    ds.setSuperTaskId(21);
    ds.loadAll();
    const [resource, params] = service.getAll.mock.lastCall!;
    expect(resource).toBe(SERV.TASKS);
    expect(params!.filter).toStrictEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'taskWrapperId', value: 21 })])
    );
    expect(params!.aggregate).toStrictEqual(expect.arrayContaining([expect.objectContaining({ field: 'task' })]));
    expect(ds.getData()).toStrictEqual([]);
  });

  it('clears selection and reloads tasks for the selected supertask', () => {
    const { dataSource, service } = setupDatasource(TasksSupertasksDataSource);
    dataSource.setSuperTaskId(21);
    dataSource.selection.select({} as never);

    dataSource.reload();

    expect(dataSource.selection.hasValue()).toBe(false);
    expect(service.getAll).toHaveBeenCalledWith(SERV.TASKS, expect.objectContaining({ filter: expect.anything() }));
    expect(dataSource.getData()).toStrictEqual([]);
  });

  it('keeps existing tasks and ends loading when the request fails', () => {
    const { dataSource, service } = setupDatasource(TasksSupertasksDataSource);
    const row = { id: 4 } as never;
    dataSource.setData([row]);
    service.getAll.mockReturnValue(throwError(() => new Error('request failed')));

    dataSource.loadAll();

    expect(dataSource.getData()).toStrictEqual([row]);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });
});
