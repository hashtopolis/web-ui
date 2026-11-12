import { ChunkState } from '@constants/chunks.config';
import { zChunkListResponse } from '@generated/api/zod';
import { of, throwError } from 'rxjs';

import { JChunk } from '@models/chunk.model';
import { Filter, FilterType, RequestParams } from '@models/request-params.model';

import { SERV } from '@services/main.config';

import { ChunksDataSource } from '@datasources/chunks.datasource';

import { setupDatasource } from '@src/app/testing/datasource-test-setup';
import { mockValidResponse } from '@src/app/testing/mock-response';

const CHUNK: JChunk = {
  id: 7,
  type: 'chunk',
  taskId: 4,
  task: { id: 4, type: 'task', taskName: 'Task' } as never,
  agent: { id: 2, type: 'agent', agentName: 'Agent' } as never,
  state: ChunkState.RUNNING
} as unknown as JChunk;

const chunkResponse = mockValidResponse(zChunkListResponse, {
  meta: { page: { total_elements: 24 } },
  links: {
    next: 'https://api.test/chunks?page%5Bafter%5D=next-chunk',
    prev: 'https://api.test/chunks?page%5Bbefore%5D=previous-chunk'
  }
});

describe('ChunksDataSource', () => {
  let dataSource: ChunksDataSource;
  let service: ReturnType<typeof setupDatasource<ChunksDataSource>>['service'];
  let serializer: ReturnType<typeof setupDatasource<ChunksDataSource>>['serializer'];

  beforeEach(() => {
    const setup = setupDatasource(ChunksDataSource);
    dataSource = setup.dataSource;
    service = setup.service;
    serializer = setup.serializer;
    serializer.deserialize.mockReturnValue([CHUNK, { id: 8, state: ChunkState.INIT } as JChunk]);
    service.getAll.mockReturnValue(of(chunkResponse));
  });

  it('requests chunk relationships, maps display fields, and marks running chunks', () => {
    dataSource.loadAll();

    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.CHUNKS, expect.anything(), expect.anything());
    expect(serializer.deserialize).toHaveBeenCalledExactlyOnceWith(chunkResponse, zChunkListResponse);
    const params = service.getAll.mock.lastCall![1] as RequestParams;
    expect(params!.include).toStrictEqual(expect.arrayContaining(['task', 'agent']));
    expect(dataSource.getOriginalData()[0]).toStrictEqual(
      expect.objectContaining({ taskName: 'Task', agentName: 'Agent', isRunning: true })
    );
    expect(dataSource.getOriginalData().map(({ id, isRunning }) => [id, isRunning])).toStrictEqual([
      [7, true],
      [8, false]
    ]);
    expect(dataSource.totalItems).toBe(24);
    expect(dataSource.pageAfter).toBe('next-chunk');
    expect(dataSource.pageBefore).toBe('previous-chunk');
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('applies and retains the agent and query filters on subsequent loads', () => {
    dataSource.setAgentId(12);
    const query: Filter = { field: 'state', operator: FilterType.EQUAL, value: ChunkState.RUNNING };
    dataSource.loadAll(query);
    dataSource.loadAll();

    const params = service.getAll.mock.lastCall![1] as RequestParams;
    expect(params!.filter).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'agentId', value: 12 }),
        expect.objectContaining({ field: 'state', value: ChunkState.RUNNING })
      ])
    );
  });

  it('clears selection and reloads data', () => {
    dataSource.loadAll();
    const chunk = dataSource.getOriginalData()[0];
    dataSource.selection.select(chunk);
    service.getAll.mockClear();

    dataSource.reload();

    expect(dataSource.selection.isSelected(chunk)).toBe(false);
    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.CHUNKS, expect.anything(), expect.anything());
  });

  it('clears the active filter and resets pagination before reloading', () => {
    const query: Filter = { field: 'state', operator: FilterType.EQUAL, value: ChunkState.RUNNING };
    dataSource.loadAll(query);
    dataSource.totalItems = 50;
    dataSource.index = 2;
    dataSource.pageAfter = 'old-cursor';
    service.getAll.mockClear();

    dataSource.clearFilter();

    const params = service.getAll.mock.lastCall![1] as RequestParams;
    expect(params!.filter ?? []).not.toContainEqual(expect.objectContaining({ field: 'state' }));
    expect(params.page?.after).toBeUndefined();
    expect(dataSource.index).toBe(0);
    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.CHUNKS, expect.anything(), expect.anything());
  });

  it('preserves existing chunks, emits filter errors, and ends loading when a request fails', () => {
    dataSource.loadAll();
    const loadedChunks = dataSource.getOriginalData();
    const errors: string[] = [];
    dataSource.filterError$.subscribe((error) => errors.push(error));
    service.getAll.mockReturnValue(throwError(() => ({ status: 400, error: { title: 'Invalid filter' } })));

    dataSource.loadAll();

    expect(dataSource.getOriginalData()).toStrictEqual(loadedChunks);
    expect(errors).toStrictEqual(['Invalid filter']);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });
});
