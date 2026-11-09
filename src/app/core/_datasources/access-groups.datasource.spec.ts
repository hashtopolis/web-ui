import { HttpHeaderName } from '@constants/http.config';
import { zAccessGroupListResponse } from '@generated/api/zod';
import { Subject, of, throwError } from 'rxjs';
import type { MockedObject } from 'vitest';

import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { JAccessGroup } from '@models/access-group.model';
import { Filter, FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { PermissionService } from '@services/permission/permission.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { AccessGroupsDataSource } from '@datasources/access-groups.datasource';

import { mockResponse } from '@src/app/testing/mock-response';

describe('AccessGroupsDataSource', () => {
  let dataSource: AccessGroupsDataSource;
  let globalServiceSpy: MockedObject<GlobalService>;
  let serializerSpy: { deserialize: ReturnType<typeof vi.fn> };

  const groups: JAccessGroup[] = [
    { id: 1, type: 'accessGroup', groupName: 'First group' },
    { id: 2, type: 'accessGroup', groupName: 'Second group' }
  ];

  function response(overrides: Record<string, unknown> = {}): ResponseWrapper {
    return mockResponse({
      meta: { page: { total_elements: groups.length } },
      ...overrides
    });
  }

  beforeEach(() => {
    globalServiceSpy = {
      getAll: vi.fn().mockName('GlobalService.getAll').mockReturnValue(of(response()))
    } as MockedObject<GlobalService>;
    serializerSpy = {
      deserialize: vi.fn().mockName('JsonAPISerializer.deserialize').mockReturnValue(groups)
    };

    const cdrSpy = {
      markForCheck: vi.fn().mockName('ChangeDetectorRef.markForCheck'),
      detectChanges: vi.fn().mockName('ChangeDetectorRef.detectChanges')
    };
    const uiServiceSpy = {
      getUISettings: vi.fn().mockName('UIConfigService.getUISettings').mockReturnValue({})
    };
    const autoRefreshSpy = {
      toggleAutoRefresh: vi.fn().mockName('AutoRefreshService.toggleAutoRefresh'),
      startAutoRefresh: vi.fn().mockName('AutoRefreshService.startAutoRefresh'),
      stopAutoRefresh: vi.fn().mockName('AutoRefreshService.stopAutoRefresh'),
      refresh$: of()
    };
    const cacheSpy = {
      invalidate: vi.fn().mockName('HttpCacheService.invalidate')
    };
    const storageSpy = {
      getItem: vi.fn().mockName('LocalStorageService.getItem').mockReturnValue(null),
      setItem: vi.fn().mockName('LocalStorageService.setItem')
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: GlobalService, useValue: globalServiceSpy },
        { provide: JsonAPISerializer, useValue: serializerSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy },
        { provide: UIConfigService, useValue: uiServiceSpy },
        { provide: PermissionService, useValue: {} },
        { provide: AutoRefreshService, useValue: autoRefreshSpy },
        { provide: HttpCacheService, useValue: cacheSpy },
        { provide: LocalStorageService, useValue: storageSpy }
      ]
    });

    dataSource = new AccessGroupsDataSource(TestBed.inject(Injector));
  });

  it('loads access groups with includes, pagination, and response cursors', () => {
    const apiResponse = response({
      links: {
        next: 'https://hashtopolis.test/groups?page%5Bafter%5D=next-cursor',
        prev: 'https://hashtopolis.test/groups?page%5Bbefore%5D=previous-cursor'
      }
    });
    globalServiceSpy.getAll.mockReturnValue(of(apiResponse));

    dataSource.loadAll();

    expect(globalServiceSpy.getAll).toHaveBeenCalledWith(
      SERV.ACCESS_GROUPS,
      { page: { size: dataSource.pageSize }, include: ['userMembers', 'agentMembers'] },
      expect.objectContaining({ headers: expect.any(HttpHeaders) })
    );
    const requestOptions = globalServiceSpy.getAll.mock.calls[0][2];
    expect(requestOptions?.headers?.get(HttpHeaderName.SKIP_ERROR_DIALOG)).toBe('true');
    expect(serializerSpy.deserialize).toHaveBeenCalledWith(apiResponse, zAccessGroupListResponse);
    expect(dataSource['dataSubject'].getValue()).toEqual(groups);
    expect(dataSource.totalItems).toBe(groups.length);
    expect(dataSource.pageAfter).toBe('next-cursor');
    expect(dataSource.pageBefore).toBe('previous-cursor');
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('applies a query filter and resets pagination before requesting', () => {
    const query: Filter = { field: 'groupName', operator: FilterType.ICONTAINS, value: 'admins' };
    dataSource.pageAfter = 'old-after';
    dataSource.pageBefore = 'old-before';
    dataSource.index = 3;

    dataSource.loadAll(query);

    expect(globalServiceSpy.getAll).toHaveBeenCalledWith(
      SERV.ACCESS_GROUPS,
      {
        page: { size: dataSource.pageSize },
        include: ['userMembers', 'agentMembers'],
        filter: [query]
      },
      expect.objectContaining({ headers: expect.any(HttpHeaders) })
    );
    expect(dataSource.index).toBe(0);
    expect(dataSource.pageAfter).toBeNull();
    expect(dataSource.pageBefore).toBeNull();
  });

  it('reuses the current filter when loading without a new query', () => {
    const query: Filter = { field: 'groupName', operator: FilterType.EQUAL, value: 'Admins' };
    dataSource.loadAll(query);
    globalServiceSpy.getAll.mockClear();

    dataSource.loadAll();

    expect(globalServiceSpy.getAll).toHaveBeenCalledWith(
      SERV.ACCESS_GROUPS,
      {
        page: { size: dataSource.pageSize },
        include: ['userMembers', 'agentMembers'],
        filter: [query]
      },
      expect.any(Object)
    );
  });

  it('omits empty filters and handles missing pagination links and zero results', () => {
    const emptyResult = mockResponse();
    globalServiceSpy.getAll.mockReturnValue(of(emptyResult));
    const emptyFilter: Filter = { field: 'groupName', operator: FilterType.ICONTAINS, value: '' };

    dataSource.loadAll(emptyFilter);

    expect(globalServiceSpy.getAll).toHaveBeenCalledWith(
      SERV.ACCESS_GROUPS,
      { page: { size: dataSource.pageSize }, include: ['userMembers', 'agentMembers'] },
      expect.any(Object)
    );
    expect(dataSource['dataSubject'].getValue()).toEqual(groups);
    expect(dataSource.totalItems).toBe(0);
    expect(dataSource.pageAfter).toBeNull();
    expect(dataSource.pageBefore).toBeNull();
  });

  it('emits filter errors and clears loading when the request fails', () => {
    const error = new HttpErrorResponse({ status: 400, error: { title: 'Invalid group filter' } });
    globalServiceSpy.getAll.mockReturnValue(throwError(() => error));
    const filterErrors: string[] = [];
    dataSource.filterError$.subscribe((message) => filterErrors.push(message));
    dataSource.setData(groups);

    dataSource.loadAll();

    expect(filterErrors).toEqual(['Invalid group filter']);
    expect(dataSource['dataSubject'].getValue()).toEqual(groups);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('keeps loading true while a request is pending and clears it on completion', () => {
    const pendingResponse = new Subject<ResponseWrapper>();
    globalServiceSpy.getAll.mockReturnValue(pendingResponse);

    dataSource.loadAll();
    expect(dataSource['loadingSubject'].getValue()).toBe(true);

    pendingResponse.next(response());
    expect(dataSource['loadingSubject'].getValue()).toBe(true);
    pendingResponse.complete();

    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('reloads with the saved filter after clearing the current selection', () => {
    const query: Filter = { field: 'groupName', operator: FilterType.EQUAL, value: 'Admins' };
    dataSource.loadAll(query);
    dataSource.toggleRow(groups[0]);
    globalServiceSpy.getAll.mockClear();

    dataSource.reload();

    expect(dataSource.hasSelected()).toBe(false);
    expect(globalServiceSpy.getAll).toHaveBeenCalledWith(
      SERV.ACCESS_GROUPS,
      {
        page: { size: dataSource.pageSize },
        include: ['userMembers', 'agentMembers'],
        filter: [query]
      },
      expect.any(Object)
    );
  });

  it('clears the saved filter and resets pagination before reloading', () => {
    const query: Filter = { field: 'groupName', operator: FilterType.EQUAL, value: 'Admins' };
    dataSource.loadAll(query);
    dataSource.toggleRow(groups[0]);
    dataSource.pageAfter = 'after-cursor';
    dataSource.pageBefore = 'before-cursor';
    dataSource.index = 2;
    globalServiceSpy.getAll.mockClear();

    dataSource.clearFilter();

    expect(dataSource.index).toBe(0);
    expect(dataSource.pageAfter).toBeNull();
    expect(dataSource.pageBefore).toBeNull();
    expect(dataSource.hasSelected()).toBe(false);
    expect(globalServiceSpy.getAll).toHaveBeenCalledWith(
      SERV.ACCESS_GROUPS,
      { page: { size: dataSource.pageSize }, include: ['userMembers', 'agentMembers'] },
      expect.any(Object)
    );
  });
});
