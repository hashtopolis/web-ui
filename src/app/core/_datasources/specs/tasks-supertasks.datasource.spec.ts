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
    expect(params.filter).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'taskWrapperId', value: 21 })])
    );
    expect(params.aggregate).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'task' })]));
  });
});
