import { ChunkState } from '@constants/chunks.config';
import { of, throwError } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';

import { JChunk } from '@models/chunk.model';
import { FilterType } from '@models/request-params.model';

import { SERV } from '@services/main.config';

import { TasksChunksDataSource } from '@datasources/tasks-chunks.datasource';

import { setupDatasource } from '@src/app/testing/datasource-test-setup';

describe('TasksChunksDataSource', () => {
  it('loads chunks scoped to the selected task', async () => {
    const { dataSource, service } = setupDatasource(TasksChunksDataSource);
    dataSource.setTaskId(4);
    await dataSource.loadAll();
    const [resource, params] = service.getAll.mock.lastCall!;
    expect(resource).toBe(SERV.CHUNKS);
    expect(params!.filter).toStrictEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'taskId', value: 4 })])
    );
    expect(params!.include).toContain('agent');
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

  it('emits task metadata errors and continues loading chunk rows', async () => {
    const { dataSource, service } = setupDatasource(TasksChunksDataSource);
    const messages: string[] = [];
    dataSource.filterError$.subscribe((message) => messages.push(message));
    const chunks = [{ id: 5, type: 'chunk', state: ChunkState.RUNNING }] as JChunk[];
    vi.spyOn(dataSource.serializer, 'deserialize').mockImplementation(() => chunks as never);
    service.get.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { title: 'Task filter rejected' } }))
    );
    service.getAll.mockReturnValue(of({ meta: { page: { total_elements: 0 } }, links: { self: '/chunks' } }));
    dataSource.setTaskId(4);

    await dataSource.loadAll();

    expect(service.getAll).toHaveBeenCalledOnce();
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
    expect(messages).toStrictEqual(['Task filter rejected']);
    expect(dataSource.getOriginalData()).toStrictEqual(chunks);
  });

  it('emits chunk request errors and keeps existing rows', async () => {
    const { dataSource, service } = setupDatasource(TasksChunksDataSource);
    const existingChunk = { id: 9, type: 'chunk', state: ChunkState.RUNNING } as JChunk;
    dataSource.setData([existingChunk]);
    const messages: string[] = [];
    dataSource.filterError$.subscribe((message) => messages.push(message));
    service.getAll.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { title: 'Chunk filter rejected' } }))
    );
    dataSource.setIsChunksLive(1);

    await dataSource.loadAll();

    expect(dataSource['loadingSubject'].getValue()).toBe(false);
    expect(messages).toStrictEqual(['Chunk filter rejected']);
    expect(dataSource.getOriginalData()).toStrictEqual([existingChunk]);
  });

  it('clears the active filter and pagination before reloading', async () => {
    const { dataSource, service } = setupDatasource(TasksChunksDataSource);
    dataSource.setIsChunksLive(1);
    dataSource.setPaginationConfig(10, 40, 'after-cursor', 'before-cursor', 3);
    await dataSource.loadAll({ field: 'agentId', operator: FilterType.EQUAL, value: 7 });
    service.getAll.mockClear();

    dataSource.clearFilter();
    await Promise.resolve();

    const [resource, params] = service.getAll.mock.lastCall!;
    expect(resource).toBe(SERV.CHUNKS);
    expect(params!.filter).not.toStrictEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'agentId', value: 7 })])
    );
    expect(dataSource.index).toBe(0);
    expect(dataSource.pageAfter).toBeNull();
    expect(dataSource.pageBefore).toBeNull();
  });

  it('clears selection and reloads the chunk resource', async () => {
    const { dataSource, service } = setupDatasource(TasksChunksDataSource);
    dataSource.setIsChunksLive(1);
    dataSource.selection.select({} as never);

    dataSource.reload();
    await Promise.resolve();

    expect(dataSource.selection.hasValue()).toBe(false);
    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.CHUNKS, expect.anything(), expect.anything());
  });
});
