import { HttpHeaderName } from '@constants/http.config';
import { zBackgroundJobListResponse } from '@generated/api/zod';
import { of, throwError } from 'rxjs';
import type { MockedObject } from 'vitest';

import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { FilterType, RequestParams } from '@models/request-params.model';

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

  it('requests SERV.BACKGROUND_JOBS with the user included and skip-error header', () => {
    dataSource.loadAll();
    const [serviceConfig, params, options] = gsSpy.getAll.mock.lastCall!;
    expect(serviceConfig).toStrictEqual(SERV.BACKGROUND_JOBS);
    expect((params as RequestParams).include).toContain('user');
    expect(options?.headers?.get(HttpHeaderName.SKIP_ERROR_DIALOG)).toBe('true');
  });

  it('deserializes the jobs including the user', () => {
    dataSource.loadAll();
    const jobs = dataSource.getOriginalData();
    expect(jobs.length).toBe(1);
    expect(jobs[0].jobType).toBe('recount_file');
    expect(jobs[0].payload).toStrictEqual({ fileId: 7 });
    expect(jobs[0].user?.name).toBe('admin');
    expect(dataSource.totalItems).toBe(1);
  });

  it('retains filter state and clears it when requested', () => {
    const filter = { field: 'status', operator: FilterType.EQUAL, value: 2 };
    dataSource.loadAll(filter);
    dataSource.loadAll();
    expect((gsSpy.getAll.mock.lastCall![1] as RequestParams).filter).toContainEqual(filter);

    dataSource.clearFilter();
    expect((gsSpy.getAll.mock.lastCall![1] as RequestParams).filter ?? []).not.toContainEqual(filter);
  });

  it('emits filter errors and keeps existing rows after a failed request', () => {
    dataSource.loadAll();
    const existingJobs = dataSource.getOriginalData();
    const errors: string[] = [];
    dataSource.filterError$.subscribe((message) => errors.push(message));
    gsSpy.getAll.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: { title: 'Invalid filter' } }))
    );

    dataSource.loadAll({ field: 'invalid', operator: FilterType.EQUAL, value: 'x' });

    expect(dataSource['loadingSubject'].getValue()).toBe(false);
    expect(dataSource.getOriginalData()).toBe(existingJobs);
    expect(errors).toStrictEqual(['Invalid filter']);
  });
});
