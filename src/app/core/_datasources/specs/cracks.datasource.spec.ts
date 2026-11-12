import { zHashListResponse, zTaskResponse } from '@generated/api/zod';
import { of, throwError } from 'rxjs';

import { JHash } from '@models/hash.model';
import { Filter, FilterType, RequestParams } from '@models/request-params.model';
import { JTask } from '@models/task.model';

import { SERV } from '@services/main.config';

import { CracksDataSource } from '@datasources/cracks.datasource';

import { setupDatasource } from '@src/app/testing/datasource-test-setup';
import { mockValidResponse } from '@src/app/testing/mock-response';
import { wait } from '@src/app/testing/wait';

const HASH: JHash = {
  id: 3,
  type: 'hash',
  hash: 'abc',
  plaintext: 'secret',
  hashlistId: 6,
  salt: '',
  timeCracked: 1710000000,
  isCracked: true,
  chunkId: null,
  crackPos: 0
};

const TASK: JTask = { id: 8, type: 'task', taskName: 'Task' } as JTask;

const hashResponse = mockValidResponse(zHashListResponse, {
  data: [
    {
      id: HASH.id,
      type: 'hash',
      attributes: {
        hash: HASH.hash,
        plaintext: HASH.plaintext,
        hashlistId: HASH.hashlistId,
        salt: HASH.salt,
        timeCracked: HASH.timeCracked,
        isCracked: HASH.isCracked,
        chunkId: HASH.chunkId,
        crackPos: HASH.crackPos
      },
      relationships: { chunk: { data: null }, hashlist: { data: { id: HASH.hashlistId, type: 'hashlist' } } }
    }
  ],
  meta: { page: { total_elements: 8 } },
  links: { next: 'https://api.test/hashes?page%5Bafter%5D=next' }
});

const taskResponse = mockValidResponse(zTaskResponse, {
  data: {
    id: TASK.id,
    type: 'task',
    attributes: {
      taskName: TASK.taskName,
      attackCmd: '-a 0',
      color: '',
      priority: 1,
      maxAgents: 1,
      chunkTime: 600,
      statusTimer: 0,
      keyspace: 0,
      keyspaceProgress: 0,
      isSmall: false,
      isCpuTask: false,
      useNewBench: false,
      skipKeyspace: 0,
      crackerBinaryId: 1,
      crackerBinaryTypeId: null,
      taskWrapperId: 1,
      isArchived: false,
      notes: '',
      staticChunks: 0,
      chunkSize: 0,
      forcePipe: false,
      preprocessorId: 0,
      preprocessorCommand: ''
    }
  }
});

describe('CracksDataSource', () => {
  let dataSource: CracksDataSource;
  let service: ReturnType<typeof setupDatasource<CracksDataSource>>['service'];
  let serializer: ReturnType<typeof setupDatasource<CracksDataSource>>['serializer'];

  beforeEach(() => {
    const setup = setupDatasource(CracksDataSource);
    dataSource = setup.dataSource;
    service = setup.service;
    serializer = setup.serializer;
    serializer.deserialize.mockImplementation((_response, schema) => {
      if (schema === zHashListResponse) return [HASH];
      if (schema === zTaskResponse) return TASK;
      return [];
    });
  });

  it('loads cracked hashes with required filters and pagination', async () => {
    service.getAll.mockReturnValueOnce(of(hashResponse));
    await dataSource.loadAll();

    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.HASHES, expect.anything());
    expect(serializer.deserialize).toHaveBeenCalledExactlyOnceWith(hashResponse, zHashListResponse, {
      include: ['chunk']
    });
    const params = service.getAll.mock.lastCall![1] as RequestParams;
    expect(params!.include).toStrictEqual(expect.arrayContaining(['chunk', 'hashlist']));
    expect(params!.filter).toContainEqual(
      expect.objectContaining({ field: 'isCracked', operator: FilterType.EQUAL, value: true })
    );
    expect(dataSource.getOriginalData()).toStrictEqual([HASH]);
    expect(dataSource.totalItems).toBe(8);
    expect(dataSource.pageAfter).toBe('next');
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('loads and returns the requested task', async () => {
    service.get.mockReturnValueOnce(of(taskResponse));

    await expect(dataSource.loadTask(TASK.id)).resolves.toStrictEqual(TASK);

    expect(service.get).toHaveBeenCalledExactlyOnceWith(SERV.TASKS, TASK.id);
    expect(serializer.deserialize).toHaveBeenCalledExactlyOnceWith(taskResponse, zTaskResponse);
  });

  it('applies and retains the query filter', async () => {
    const query: Filter = { field: 'hash', operator: FilterType.ICONTAINS, value: 'abc' };
    service.getAll.mockReturnValue(of(hashResponse));

    await dataSource.loadAll(query);
    await dataSource.loadAll();

    expect((service.getAll.mock.calls[0][1] as RequestParams).filter).toContainEqual(
      expect.objectContaining({ field: 'hash', value: 'abc' })
    );
    expect((service.getAll.mock.calls[1][1] as RequestParams).filter).toContainEqual(
      expect.objectContaining({ field: 'hash', value: 'abc' })
    );
  });

  it('clears selection and reloads data', async () => {
    await dataSource.loadAll();
    const hash = dataSource.getOriginalData()[0];
    dataSource.selection.select(hash);
    service.getAll.mockClear();

    dataSource.reload();
    await wait();

    expect(dataSource.selection.isSelected(hash)).toBe(false);
    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.HASHES, expect.anything());
  });

  it('clears the active filter and resets pagination before reloading', async () => {
    const query: Filter = { field: 'hash', operator: FilterType.ICONTAINS, value: 'abc' };
    service.getAll.mockReturnValue(of(hashResponse));
    await dataSource.loadAll(query);
    dataSource.totalItems = 50;
    dataSource.index = 2;
    dataSource.pageAfter = 'old-cursor';
    service.getAll.mockClear();

    dataSource.clearFilter();
    await wait();

    const params = service.getAll.mock.lastCall![1] as RequestParams;
    expect(params!.filter ?? []).not.toContainEqual(expect.objectContaining({ field: 'hash' }));
    expect(params.page?.after).toBeUndefined();
    expect(dataSource.index).toBe(0);
    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.HASHES, expect.anything());
  });

  it('emits filter errors, clears the failed result, and ends loading when a request fails', async () => {
    await dataSource.loadAll();
    const errors: string[] = [];
    dataSource.filterError$.subscribe((error) => errors.push(error));
    service.getAll.mockReturnValue(throwError(() => ({ status: 400, error: { title: 'Invalid filter' } })));

    await dataSource.loadAll();

    expect(dataSource.getOriginalData()).toStrictEqual([]);
    expect(errors).toStrictEqual(['Invalid filter']);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });
});
