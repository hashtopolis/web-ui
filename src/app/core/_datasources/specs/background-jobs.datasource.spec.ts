import { zBackgroundJobListResponse } from '@generated/api/zod';
import { of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { RequestParams } from '@models/request-params.model';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { BackgroundJobsDataSource } from '@datasources/background-jobs.datasource';

import { mockValidResponse } from '@src/app/testing/mock-response';

const RESPONSE = mockValidResponse(zBackgroundJobListResponse, {
  data: [
    {
      id: 3,
      type: 'backgroundJob',
      attributes: {
        jobType: 'recount_file',
        payload: { fileId: 7 },
        status: 2,
        userId: 1,
        createdAt: 1700000000,
        startedAt: 1700000010,
        finishedAt: 1700000020,
        exitCode: 0,
        resultMessage: 'Recounted 3 lines.'
      },
      relationships: { user: { data: { type: 'user', id: 1 } } }
    }
  ],
  included: [{ id: 1, type: 'user', attributes: { name: 'admin' } }],
  meta: { page: { total_elements: 1 } }
});

describe('BackgroundJobsDataSource', () => {
  let dataSource: BackgroundJobsDataSource;
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
    dataSource = new BackgroundJobsDataSource(TestBed.inject(Injector));
  });

  afterEach(() => TestBed.resetTestingModule());

  it('requests SERV.BACKGROUND_JOBS with the user included', () => {
    dataSource.loadAll();
    const [serviceConfig, params] = gsSpy.getAll.mock.lastCall!;
    expect(serviceConfig).toEqual(SERV.BACKGROUND_JOBS);
    expect((params as RequestParams).include).toContain('user');
  });

  it('deserializes the jobs including the user', () => {
    dataSource.loadAll();
    const jobs = dataSource.getOriginalData();
    expect(jobs.length).toBe(1);
    expect(jobs[0].jobType).toBe('recount_file');
    expect(jobs[0].payload).toEqual({ fileId: 7 });
    expect(jobs[0].user?.name).toBe('admin');
    expect(dataSource.totalItems).toBe(1);
  });
});
