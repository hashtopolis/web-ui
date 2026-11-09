import { zAccessGroupResponse } from '@generated/api/zod';
import { Subject, of, throwError } from 'rxjs';
import type { MockedObject } from 'vitest';

import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { JAccessGroup } from '@models/access-group.model';
import { ResponseWrapper } from '@models/response.model';
import { JUser } from '@models/user.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { PermissionService } from '@services/permission/permission.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

import { AccessGroupsExpandDataSource } from '@datasources/access-groups-expand.datasource';

import { mockResponse } from '@src/app/testing/mock-response';

describe('AccessGroupsExpandDataSource', () => {
  let dataSource: AccessGroupsExpandDataSource;
  let globalServiceSpy: MockedObject<GlobalService>;
  let serializerSpy: { deserialize: ReturnType<typeof vi.fn> };

  const users: JUser[] = [
    { id: 1, type: 'user', name: 'Max' },
    { id: 2, type: 'user', name: 'Hansi' }
  ];
  const response: ResponseWrapper = mockResponse();

  function accessGroup(overrides: Partial<JAccessGroup> = {}): JAccessGroup {
    return {
      id: 10,
      type: 'accessGroup',
      groupName: 'Test group',
      userMembers: users,
      ...overrides
    };
  }

  beforeEach(() => {
    globalServiceSpy = {
      get: vi.fn().mockName('GlobalService.get')
    } as MockedObject<GlobalService>;
    serializerSpy = {
      deserialize: vi.fn().mockName('JsonAPISerializer.deserialize').mockReturnValue(accessGroup())
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

    dataSource = new AccessGroupsExpandDataSource(TestBed.inject(Injector));
  });

  it('loads access-group members with the configured ID and include', () => {
    const group = accessGroup();
    serializerSpy.deserialize.mockReturnValue(group);
    globalServiceSpy.get.mockReturnValue(of(response));
    dataSource.setAccessGroupId(10);
    dataSource.setAccessGroupExpand('userMembers');

    dataSource.loadAll();

    expect(globalServiceSpy.get).toHaveBeenCalledWith(SERV.ACCESS_GROUPS, 10, { include: ['userMembers'] });
    expect(serializerSpy.deserialize).toHaveBeenCalledWith(response, zAccessGroupResponse);
    expect(dataSource.getData()).toEqual(users);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('reapplies the active column filter when reloading and clears selection', () => {
    const reloadedUsers: JUser[] = [
      { id: 3, type: 'user', name: 'Max 2' },
      { id: 4, type: 'user', name: 'Peter' }
    ];
    const group = accessGroup();
    serializerSpy.deserialize.mockReturnValue(group);
    globalServiceSpy.get.mockReturnValue(of(response));
    dataSource.setAccessGroupId(10);
    dataSource.setAccessGroupExpand('userMembers');
    dataSource.loadAll();

    const column: HTTableColumn = { id: 1, dataKey: 'name' };
    dataSource.applyClientFilter('max', column);
    dataSource.toggleRow(users[0]);
    serializerSpy.deserialize.mockReturnValue(accessGroup({ userMembers: reloadedUsers }));

    dataSource.reload();

    expect(globalServiceSpy.get).toHaveBeenCalledTimes(2);
    expect(dataSource['dataSubject'].getValue()).toEqual([reloadedUsers[0]]);
    expect(dataSource.hasSelected()).toBe(false);
  });

  it('returns all rows after clearing the active filter', () => {
    serializerSpy.deserialize.mockReturnValue(accessGroup());
    globalServiceSpy.get.mockReturnValue(of(response));
    dataSource.setAccessGroupExpand('userMembers');
    dataSource.loadAll();
    dataSource.applyClientFilter('max', { id: 1, dataKey: 'name' });

    dataSource.applyClientFilter('', null);

    expect(dataSource['dataSubject'].getValue()).toEqual(users);
  });

  it('uses an empty list when the requested include is missing from the response', () => {
    serializerSpy.deserialize.mockReturnValue({
      id: 10,
      type: 'accessGroup',
      groupName: 'Test group'
    });
    globalServiceSpy.get.mockReturnValue(of(response));
    dataSource.setAccessGroupExpand('userMembers');

    dataSource.loadAll();

    expect(dataSource.getData()).toEqual([]);
  });

  it('handles an empty included member list', () => {
    serializerSpy.deserialize.mockReturnValue(accessGroup({ userMembers: [] }));
    globalServiceSpy.get.mockReturnValue(of(response));
    dataSource.setAccessGroupExpand('userMembers');

    dataSource.loadAll();

    expect(dataSource.getData()).toEqual([]);
  });

  it('clears loading and keeps the existing data when the request fails', () => {
    serializerSpy.deserialize.mockReturnValue(accessGroup());
    globalServiceSpy.get.mockReturnValue(of(response));
    dataSource.setAccessGroupExpand('userMembers');
    dataSource.loadAll();
    globalServiceSpy.get.mockReturnValue(throwError(() => new Error('Network error')));

    dataSource.loadAll();

    expect(dataSource.getData()).toEqual(users);
    expect(serializerSpy.deserialize).toHaveBeenCalledTimes(1);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('sets loading while the request is pending and clears it when the request completes', () => {
    const pendingResponse = new Subject<ResponseWrapper>();
    globalServiceSpy.get.mockReturnValue(pendingResponse);
    serializerSpy.deserialize.mockReturnValue(accessGroup());

    dataSource.loadAll();
    expect(dataSource['loadingSubject'].getValue()).toBe(true);

    pendingResponse.next(response);
    expect(dataSource['loadingSubject'].getValue()).toBe(true);
    pendingResponse.complete();

    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('starts with the default ID and an empty include', () => {
    globalServiceSpy.get.mockReturnValue(of(response));
    serializerSpy.deserialize.mockReturnValue(accessGroup());

    dataSource.loadAll();

    expect(globalServiceSpy.get).toHaveBeenCalledWith(SERV.ACCESS_GROUPS, 0, { include: [''] });
  });
});
