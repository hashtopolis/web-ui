import { zGlobalPermissionGroupResponse } from '@generated/api/zod';
import { of, throwError } from 'rxjs';
import type { MockedObject } from 'vitest';

import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Permission } from '@models/global-permission-group.model';
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

import { AccessPermissionGroupsExpandDataSource } from '@datasources/access-permission-groups-expand.datasource';

import { mockResponse } from '@src/app/testing/mock-response';

describe('AccessPermissionGroupsExpandDataSource', () => {
  let dataSource: AccessPermissionGroupsExpandDataSource;
  let globalServiceSpy: MockedObject<GlobalService>;
  let serializerSpy: { deserialize: ReturnType<typeof vi.fn> };

  const users: JUser[] = [
    { id: 1, type: 'user', name: 'Max' },
    { id: 2, type: 'user', name: 'Hansi' }
  ];
  const permissions: Permission = {
    permTaskRead: true,
    permTaskUpdate: false
  };
  const group = {
    id: 10,
    type: 'globalPermissionGroup',
    name: 'Test group',
    permissions,
    userMembers: users
  };
  const response: ResponseWrapper = mockResponse();

  beforeEach(() => {
    globalServiceSpy = {
      get: vi.fn().mockName('GlobalService.get').mockReturnValue(of(response))
    } as MockedObject<GlobalService>;
    serializerSpy = {
      deserialize: vi.fn().mockName('JsonAPISerializer.deserialize').mockReturnValue(group)
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

    dataSource = new AccessPermissionGroupsExpandDataSource(TestBed.inject(Injector));
  });

  it('loads user members using the configured group ID and include', () => {
    dataSource.setAccessPermGroupId(10);
    dataSource.setAccessPermGroupExpand('userMembers');

    dataSource.loadAll();

    expect(globalServiceSpy.get).toHaveBeenCalledExactlyOnceWith(SERV.ACCESS_PERMISSIONS_GROUPS, 10, {
      include: ['userMembers']
    });
    expect(serializerSpy.deserialize).toHaveBeenCalledExactlyOnceWith(response, zGlobalPermissionGroupResponse, {
      include: ['userMembers']
    });
    expect(dataSource['dataSubject'].getValue()).toStrictEqual(users);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('loads the permission matrix when permissions are enabled', () => {
    dataSource.setAccessPermGroupId(25);
    dataSource.setAccessPermGroupExpand('userMembers,permissions');
    dataSource.setPermissions(1);

    dataSource.loadAll();

    expect(globalServiceSpy.get).toHaveBeenCalledExactlyOnceWith(SERV.ACCESS_PERMISSIONS_GROUPS, 25, {
      include: ['userMembers,permissions']
    });
    expect(dataSource['dataSubject'].getValue()).toStrictEqual([
      {
        id: 0,
        type: 'userPermission',
        name: 'Task',
        key: 'Task',
        create: false,
        read: true,
        update: false,
        delete: false,
        keys: { read: 'permTaskRead', update: 'permTaskUpdate' }
      }
    ]);
  });

  it('clears loading and preserves existing data when the request fails', () => {
    dataSource.setData(users);
    globalServiceSpy.get.mockReturnValue(throwError(() => new Error('Network error')));

    dataSource.loadAll();

    expect(serializerSpy.deserialize).not.toHaveBeenCalled();
    expect(dataSource['dataSubject'].getValue()).toStrictEqual(users);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('returns an empty matrix for an empty permission map', () => {
    dataSource.loadFromMap({});

    expect(dataSource['dataSubject'].getValue()).toStrictEqual([]);
    expect(dataSource.getOriginalData()).toStrictEqual([]);
  });
});
