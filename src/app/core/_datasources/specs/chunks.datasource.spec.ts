import { ChunkState } from '@constants/chunks.config';
import { zChunkListResponse } from '@generated/api/zod';
import { of } from 'rxjs';

import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { JChunk } from '@models/chunk.model';
import { Filter, FilterType, RequestParams } from '@models/request-params.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { ChunksDataSource } from '@datasources/chunks.datasource';

import { mockResponse } from '@src/app/testing/mock-response';

describe('ChunksDataSource', () => {
  let dataSource: ChunksDataSource;
  let service: { getAll: ReturnType<typeof vi.fn> };
  const runningChunk: JChunk = {
    id: 7,
    type: 'chunk',
    taskId: 4,
    task: { taskName: 'Task' } as never,
    agent: { agentName: 'Agent' } as never,
    state: ChunkState.RUNNING
  } as unknown as JChunk;
  const idleChunk: JChunk = { id: 8, state: ChunkState.INIT } as JChunk;

  beforeEach(() => {
    service = { getAll: vi.fn().mockReturnValue(of(mockResponse())) };
    vi.spyOn(JsonAPISerializer.prototype, 'deserialize').mockImplementation((_response, schema) =>
      schema === zChunkListResponse ? [runningChunk, idleChunk] : []
    );
    TestBed.configureTestingModule({
      providers: [
        { provide: GlobalService, useValue: service },
        { provide: ChangeDetectorRef, useValue: { markForCheck: vi.fn(), detectChanges: vi.fn() } },
        { provide: UIConfigService, useValue: { getUISettings: vi.fn().mockReturnValue({}) } },
        {
          provide: AutoRefreshService,
          useValue: { refresh$: of(), toggleAutoRefresh: vi.fn(), startAutoRefresh: vi.fn(), stopAutoRefresh: vi.fn() }
        },
        { provide: HttpCacheService, useValue: { invalidate: vi.fn() } },
        { provide: LocalStorageService, useValue: { getItem: vi.fn().mockReturnValue(null), setItem: vi.fn() } }
      ]
    });
    dataSource = new ChunksDataSource(TestBed.inject(Injector));
  });

  it('requests chunk relationships, maps display fields, and marks running chunks', () => {
    dataSource.loadAll();
    const [resource, params] = service.getAll.mock.lastCall!;
    expect(resource).toBe(SERV.CHUNKS);
    expect((params as RequestParams).include).toEqual(expect.arrayContaining(['task', 'agent']));
    expect(dataSource.getOriginalData().map(({ id, isRunning }) => [id, isRunning])).toStrictEqual([
      [7, true],
      [8, false]
    ]);
    expect(dataSource.getOriginalData()[0]).toMatchObject({ taskName: 'Task', agentName: 'Agent' });
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('applies and retains the agent and query filters on subsequent loads', () => {
    dataSource.setAgentId(12);
    const query: Filter = { field: 'state', operator: FilterType.EQUAL, value: ChunkState.RUNNING };
    dataSource.loadAll(query);
    dataSource.loadAll();
    const [, params] = service.getAll.mock.lastCall!;
    expect((params as RequestParams).filter).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'agentId', value: 12 }),
        expect.objectContaining({ field: 'state', value: ChunkState.RUNNING })
      ])
    );
  });
});
