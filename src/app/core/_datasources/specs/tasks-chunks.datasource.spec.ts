import { ChunkState } from '@constants/chunks.config';
import { of, throwError } from 'rxjs';

import { SERV } from '@services/main.config';

import { setupDatasource } from '@datasources/specs/datasource-test-setup-util';
import { TasksChunksDataSource } from '@datasources/tasks-chunks.datasource';

describe('TasksChunksDataSource', () => {
  it('loads chunks scoped to the selected task', async () => {
    const { dataSource, service } = setupDatasource(TasksChunksDataSource);
    const ds = dataSource;
    ds.setTaskId(4);
    await ds.loadAll();
    const [resource, params] = service.getAll.mock.lastCall!;
    expect(resource).toBe(SERV.CHUNKS);
    expect(params.filter).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'taskId', value: 4 })]));
    expect(params.include).toContain('agent');
  });

  it('maps optional relationships and running state for live chunks', async () => {
    const { dataSource, service } = setupDatasource(TasksChunksDataSource);
    const chunks = [
      { id: 1, type: 'chunk', state: ChunkState.RUNNING, agent: { agentName: 'Agent' }, task: { taskName: 'Task' } },
      { id: 2, type: 'chunk', state: 0 }
    ];
    vi.spyOn(dataSource.serializer, 'deserialize').mockImplementation(() => chunks as never);
    service.getAll.mockReturnValue(of({ meta: { page: { total_elements: 2 } }, links: { self: '/chunks' } }));
    dataSource.setTaskId(4);
    dataSource.setIsChunksLive(1);

    await dataSource.loadAll();

    expect(service.get).not.toHaveBeenCalled();
    expect(dataSource.getOriginalData()).toMatchObject([
      { agentName: 'Agent', taskName: 'Task', isRunning: true },
      { isRunning: false }
    ]);
  });

  it('continues loading chunks and emits the task error when task metadata cannot load', async () => {
    const { dataSource, service } = setupDatasource(TasksChunksDataSource);
    const messages: string[] = [];
    dataSource.filterError$.subscribe((message) => messages.push(message));
    service.get.mockReturnValue(throwError(() => new Error('task failed')));
    service.getAll.mockReturnValue(of({ meta: { page: { total_elements: 0 } }, links: { self: '/chunks' } }));
    dataSource.setTaskId(4);

    await dataSource.loadAll();

    expect(service.getAll).toHaveBeenCalled();
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
    expect(messages).toEqual([]);
  });

  it('emits a filter error and finishes loading when chunk request fails', async () => {
    const { dataSource, service } = setupDatasource(TasksChunksDataSource);
    const messages: string[] = [];
    dataSource.filterError$.subscribe((message) => messages.push(message));
    service.getAll.mockReturnValue(throwError(() => new Error('chunk failed')));
    dataSource.setIsChunksLive(1);

    await dataSource.loadAll();

    expect(dataSource['loadingSubject'].getValue()).toBe(false);
    expect(messages).toEqual([]);
  });
});
