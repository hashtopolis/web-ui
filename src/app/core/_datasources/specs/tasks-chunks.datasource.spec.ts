import { ChunkState } from '@constants/chunks.config';
import { zChunkListResponse } from '@generated/api/zod';
import { of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { GlobalService } from '@services/main.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { TasksChunksDataSource } from '@datasources/tasks-chunks.datasource';

import { mockValidResponse } from '@src/app/testing/mock-response';

const chunkResource = (id: number, state: ChunkState) => ({
  id,
  type: 'chunk',
  attributes: {
    taskId: 1,
    skip: 0,
    length: 100,
    agentId: 1,
    dispatchTime: 0,
    solveTime: 0,
    checkpoint: 0,
    progress: 0,
    state,
    cracked: 0,
    speed: 0
  }
});

const RESPONSE = mockValidResponse(zChunkListResponse, {
  data: [chunkResource(1, ChunkState.INIT), chunkResource(2, ChunkState.AUTOTUNE)],
  meta: { page: { total_elements: 2 } }
});

describe('TasksChunksDataSource', () => {
  let dataSource: TasksChunksDataSource;
  let gsSpy: MockedObject<GlobalService>;

  beforeEach(() => {
    gsSpy = {
      getAll: vi.fn().mockName('GlobalService.getAll')
    } as MockedObject<GlobalService>;
    gsSpy.getAll.mockReturnValue(of(RESPONSE));

    const uiServiceSpy = {
      getUISettings: vi.fn().mockName('UIConfigService.getUISettings')
    };
    uiServiceSpy.getUISettings.mockReturnValue({});

    const storageSpy = {
      getItem: vi.fn().mockName('LocalStorageService.getItem'),
      setItem: vi.fn().mockName('LocalStorageService.setItem')
    };
    storageSpy.getItem.mockReturnValue(null);

    TestBed.configureTestingModule({
      providers: [
        { provide: GlobalService, useValue: gsSpy },
        {
          provide: ChangeDetectorRef,
          useValue: {
            markForCheck: vi.fn().mockName('ChangeDetectorRef.markForCheck'),
            detectChanges: vi.fn().mockName('ChangeDetectorRef.detectChanges')
          }
        },
        { provide: UIConfigService, useValue: uiServiceSpy },
        {
          provide: AutoRefreshService,
          useValue: {
            toggleAutoRefresh: vi.fn().mockName('AutoRefreshService.toggleAutoRefresh'),
            startAutoRefresh: vi.fn().mockName('AutoRefreshService.startAutoRefresh'),
            stopAutoRefresh: vi.fn().mockName('AutoRefreshService.stopAutoRefresh'),
            refresh$: of()
          }
        },
        {
          provide: HttpCacheService,
          useValue: {
            invalidate: vi.fn().mockName('HttpCacheService.invalidate')
          }
        },
        { provide: LocalStorageService, useValue: storageSpy }
      ]
    });

    // Live mode lists the chunks without loading the task's chunk time first.
    dataSource = new TasksChunksDataSource(TestBed.inject(Injector));
    dataSource.setIsChunksLive(1);
  });

  afterEach(() => TestBed.resetTestingModule());

  it('sets isRunning for chunks hashcat works on', async () => {
    await dataSource.loadAll();

    const isRunningById = dataSource.getOriginalData().map((chunk) => [chunk.id, chunk.isRunning]);
    expect(isRunningById).toStrictEqual([
      [1, false],
      [2, true]
    ]);
  });
});
