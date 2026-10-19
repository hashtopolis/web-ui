import { zHashTypeListResponse } from '@generated/api/zod';
import { of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { JHashtype } from '@models/hashtype.model';
import { FilterType, RequestParams } from '@models/request-params.model';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { CrackerHashtypesDataSource } from '@datasources/cracker-hashtypes.datasource';

import { mockValidResponse } from '@src/app/testing/mock-response';

const RESPONSE = mockValidResponse(zHashTypeListResponse, {
  data: [
    { id: 0, type: 'hashType', attributes: { description: 'MD5', isSalted: false, isSlowHash: false } },
    { id: 1000, type: 'hashType', attributes: { description: 'NTLM', isSalted: false, isSlowHash: false } }
  ],
  links: {
    self: '/api/v2/ui/crackers/12/hashtypes',
    next: 'http://localhost:8080/api/v2/ui/crackers/12/hashtypes?page[size]=2&page[after]=abc',
    prev: null
  },
  meta: { page: { total_elements: 582 } }
});

describe('CrackerHashtypesDataSource', () => {
  let dataSource: CrackerHashtypesDataSource;
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
    dataSource = new CrackerHashtypesDataSource(TestBed.inject(Injector));
    dataSource.setCrackerBinaryId(12);
  });

  afterEach(() => TestBed.resetTestingModule());

  it('requests one page of the hashtypes of the cracker version', () => {
    dataSource.pageSize = 25;
    dataSource.loadAll();

    const [serviceConfig, params] = gsSpy.getAll.mock.lastCall!;
    expect(serviceConfig.URL).toBe(`${SERV.CRACKERS.URL}/12/hashtypes`);
    expect((params as RequestParams).page?.size).toBe(25);
  });

  it('shows the page and takes the total and the next cursor from the response', () => {
    dataSource.loadAll();

    expect(dataSource.getOriginalData().map((hashtype: JHashtype) => hashtype.description)).toEqual(['MD5', 'NTLM']);
    expect(dataSource.totalItems).toBe(582);
    expect(dataSource.pageAfter).toBe('abc');
  });

  it('keeps a filter for reloads', () => {
    const filter = { field: 'description', operator: FilterType.ICONTAINS, value: 'md5' };
    dataSource.loadAll(filter);
    dataSource.reload();

    const params = gsSpy.getAll.mock.lastCall![1] as RequestParams;
    expect(params.filter).toEqual([filter]);
  });
});
