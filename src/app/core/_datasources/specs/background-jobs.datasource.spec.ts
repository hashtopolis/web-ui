/// <reference types="jasmine" />
import { zBackgroundJobListResponse } from '@generated/api/zod';
import { of } from 'rxjs';

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
  let gsSpy: jasmine.SpyObj<GlobalService>;

  beforeEach(() => {
    gsSpy = jasmine.createSpyObj('GlobalService', ['getAll']);
    gsSpy.getAll.and.returnValue(of(RESPONSE));

    const uiServiceSpy = jasmine.createSpyObj('UIConfigService', ['getUISettings']);
    uiServiceSpy.getUISettings.and.returnValue({});
    const storageSpy = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem']);
    storageSpy.getItem.and.returnValue(null);

    TestBed.configureTestingModule({
      providers: [
        { provide: GlobalService, useValue: gsSpy },
        {
          provide: ChangeDetectorRef,
          useValue: jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck', 'detectChanges'])
        },
        { provide: UIConfigService, useValue: uiServiceSpy },
        {
          provide: AutoRefreshService,
          useValue: jasmine.createSpyObj(
            'AutoRefreshService',
            ['toggleAutoRefresh', 'startAutoRefresh', 'stopAutoRefresh'],
            {
              refresh$: of()
            }
          )
        },
        { provide: HttpCacheService, useValue: jasmine.createSpyObj('HttpCacheService', ['invalidate']) },
        { provide: LocalStorageService, useValue: storageSpy }
      ]
    });
    dataSource = new BackgroundJobsDataSource(TestBed.inject(Injector));
  });

  afterEach(() => TestBed.resetTestingModule());

  it('requests SERV.BACKGROUND_JOBS with the user included', () => {
    dataSource.loadAll();
    const [serviceConfig, params] = gsSpy.getAll.calls.mostRecent().args;
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
