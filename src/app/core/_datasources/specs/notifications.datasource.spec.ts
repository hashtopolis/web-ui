import type { Mock, MockedObject } from 'vitest';
/// <reference types="jasmine" />
import { zNotificationSettingListResponse } from '@generated/api/zod';
import { of, throwError } from 'rxjs';

import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { JNotification } from '@models/notification.model';
import { Filter, FilterType, RequestParams } from '@models/request-params.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { NotificationsDataSource } from '@src/app/core/_datasources/notifications.datasource';
import { mockResource, mockResponse } from '@src/app/testing/mock-response';

// Mock data

const MOCK_NOTIFICATION: JNotification = {
  id: 1,
  type: 'notificationSetting',
  action: 'agentError',
  isActive: true,
  notification: 'ChatBot',
  receiver: 'user@example.org',
  userId: 1,
  objectId: undefined
} as unknown as JNotification;

const MOCK_NOTIFICATION_WITH_OBJECT: JNotification = {
  id: 3,
  type: 'notificationSetting',
  action: 'hashlistAllCracked',
  isActive: true,
  notification: 'Slack',
  receiver: 'user@example.org',
  userId: 1,
  objectId: 4
} as unknown as JNotification;

// Suite

describe('NotificationsDataSource', () => {
  let dataSource: NotificationsDataSource;
  let gsSpy: MockedObject<GlobalService>;
  let _deserializeSpy: Mock;

  beforeEach(() => {
    gsSpy = {
      getAll: vi.fn().mockName('GlobalService.getAll')
    };

    const cdrSpy = {
      markForCheck: vi.fn().mockName('ChangeDetectorRef.markForCheck'),
      detectChanges: vi.fn().mockName('ChangeDetectorRef.detectChanges')
    };
    const uiServiceSpy = {
      getUISettings: vi.fn().mockName('UIConfigService.getUISettings')
    };
    uiServiceSpy.getUISettings.mockReturnValue({});
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
      getItem: vi.fn().mockName('LocalStorageService.getItem'),
      setItem: vi.fn().mockName('LocalStorageService.setItem')
    };
    storageSpy.getItem.mockReturnValue(null);

    gsSpy.getAll.mockReturnValue(of(mockResponse()));

    _deserializeSpy = vi
      .spyOn(JsonAPISerializer.prototype, 'deserialize')
      .mockImplementation((_body: unknown, _schema?: unknown) => [MOCK_NOTIFICATION]);

    TestBed.configureTestingModule({
      providers: [
        { provide: GlobalService, useValue: gsSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy },
        { provide: UIConfigService, useValue: uiServiceSpy },
        { provide: AutoRefreshService, useValue: autoRefreshSpy },
        { provide: HttpCacheService, useValue: cacheSpy },
        { provide: LocalStorageService, useValue: storageSpy }
      ]
    });

    const injector = TestBed.inject(Injector);
    dataSource = new NotificationsDataSource(injector);
  });

  afterEach(() => TestBed.resetTestingModule());

  // loadAll()

  describe('loadAll()', () => {
    it('should call service.getAll with SERV.NOTIFICATIONS', () => {
      dataSource.loadAll();
      const [serviceConfig] = vi.mocked(gsSpy.getAll).mock.lastCall;
      expect(serviceConfig).toEqual(SERV.NOTIFICATIONS);
    });

    it('should deserialize the response with zNotificationSettingListResponse', () => {
      dataSource.loadAll();
      expect(_deserializeSpy).toHaveBeenCalledWith(expect.anything(), zNotificationSettingListResponse);
    });

    it('should populate data with the deserialized notifications', () => {
      dataSource.loadAll();
      expect(dataSource.getOriginalData().length).toBe(1);
      expect(dataSource.getOriginalData()[0].receiver).toBe(MOCK_NOTIFICATION.receiver);
    });

    it('should set totalItems from meta.page.total_elements', () => {
      gsSpy.getAll.mockReturnValue(of(mockResponse({ meta: { page: { total_elements: 3 } } })));
      dataSource.loadAll();
      expect(dataSource.totalItems).toBe(3);
    });

    it('should extract the page[after] cursor from links.next', () => {
      gsSpy.getAll.mockReturnValue(
        of(
          mockResponse({
            meta: { page: { total_elements: 10 } },
            links: {
              self: '/test',
              next: 'https://api/notifications?page%5Bafter%5D=eyJwcmltYXJ5Ijp7Im5vdGlmaWNhdGlvblNldHRpbmdJZCI6NH19'
            }
          })
        )
      );
      dataSource.loadAll();
      expect(dataSource.pageAfter).toBe('eyJwcmltYXJ5Ijp7Im5vdGlmaWNhdGlvblNldHRpbmdJZCI6NH19');
    });

    it('should set pageAfter to null when links.next is null', () => {
      dataSource.loadAll();
      expect(dataSource.pageAfter).toBeNull();
    });

    it('should set pageBefore to null when links.prev is null', () => {
      dataSource.loadAll();
      expect(dataSource.pageBefore).toBeNull();
    });

    it('should append a query filter when provided', () => {
      const query: Filter = { field: 'action', operator: FilterType.ICONTAINS, value: 'error' };
      dataSource.loadAll(query);
      const [, params] = vi.mocked(gsSpy.getAll).mock.lastCall;
      expect((params as RequestParams).filter).toContain(expect.objectContaining({ field: 'action', value: 'error' }));
    });

    it('should persist the query as _currentFilter', () => {
      const query: Filter = { field: 'action', operator: FilterType.ICONTAINS, value: 'hashlist' };
      dataSource.loadAll(query);
      expect(dataSource['_currentFilter']).toEqual(query);
    });

    it('should reuse _currentFilter on a subsequent call without query', () => {
      const query: Filter = { field: 'receiver', operator: FilterType.ICONTAINS, value: 'example.org' };
      dataSource.loadAll(query);
      gsSpy.getAll.mockClear();
      dataSource.loadAll();
      const [, params] = vi.mocked(gsSpy.getAll).mock.lastCall;
      expect((params as RequestParams).filter).toContain(
        expect.objectContaining({ field: 'receiver', value: 'example.org' })
      );
    });

    it('should set loading to false after a successful response', () => {
      dataSource.loadAll();
      expect(dataSource['loadingSubject'].getValue()).toBe(false);
    });

    it('should call handleFilterError and return empty data when request fails', () => {
      gsSpy.getAll.mockReturnValue(throwError(() => new Error('backend error')));
      const handleFilterErrorSpy = vi.spyOn(dataSource as never, 'handleFilterError');

      dataSource.loadAll();

      expect(handleFilterErrorSpy).toHaveBeenCalled();
      expect(dataSource.getOriginalData().length).toBe(0);
    });

    it('should set loading to false even when request fails', () => {
      gsSpy.getAll.mockReturnValue(throwError(() => new Error('backend error')));
      dataSource.loadAll();
      expect(dataSource['loadingSubject'].getValue()).toBe(false);
    });

    it('should handle notifications with objectId', () => {
      _deserializeSpy.mockReturnValue([MOCK_NOTIFICATION_WITH_OBJECT]);
      dataSource.loadAll();
      const data = dataSource.getOriginalData();
      expect(data[0].objectId).toBe(4);
      expect(data[0].action).toBe('hashlistAllCracked');
    });
  });

  // reload()

  describe('reload()', () => {
    it('should clear selected rows', () => {
      dataSource.selection.select(MOCK_NOTIFICATION);
      dataSource.reload();
      expect(dataSource.selection.selected.length).toBe(0);
    });

    it('should call loadAll()', () => {
      gsSpy.getAll.mockClear();
      dataSource.reload();
      expect(gsSpy.getAll).toHaveBeenCalled();
    });
  });

  // clearFilter()

  describe('clearFilter()', () => {
    it('should reset _currentFilter to null', () => {
      const query: Filter = { field: 'action', operator: FilterType.ICONTAINS, value: 'error' };
      dataSource.loadAll(query);
      expect(dataSource['_currentFilter']).toEqual(query);

      dataSource.clearFilter();
      expect(dataSource['_currentFilter']).toBeNull();
    });

    it('should reset index to 0 and reload data', () => {
      dataSource.index = 5;
      gsSpy.getAll.mockClear();

      dataSource.clearFilter();

      expect(dataSource.index).toBe(0);
      expect(gsSpy.getAll).toHaveBeenCalled();
    });

    it('should not apply the old filter after clearing', () => {
      const query: Filter = { field: 'action', operator: FilterType.ICONTAINS, value: 'error' };
      dataSource.loadAll(query);

      gsSpy.getAll.mockClear();
      dataSource.clearFilter();

      const [, params] = vi.mocked(gsSpy.getAll).mock.lastCall;
      const filter = (params as RequestParams).filter ?? [];
      expect(filter.some((f: Filter) => f.field === 'action')).toBe(false);
    });
  });
});

// Schema-level regression for bug #2224: notifications not tied to an object (e.g. a global
// agentError/logError) carry no objectId. The list-response schema must accept a null or absent
// objectId, otherwise the serializer's validateBody() logs a large ZodError to the console.
describe('zNotificationSettingListResponse objectId nullability', () => {
  const bodyWith = (attrs: Record<string, unknown>) =>
    mockResponse({
      data: [
        mockResource(
          'notificationSetting',
          1,
          {
            action: 'agentError',
            notification: 'ChatBot',
            userId: 1,
            receiver: 'user@example.org',
            isActive: true,
            ...attrs
          },
          ['user']
        )
      ]
    });

  it('accepts a numeric objectId', () => {
    expect(zNotificationSettingListResponse.safeParse(bodyWith({ objectId: 42 })).success).toBe(true);
  });

  it('accepts a null objectId (notification not tied to an object)', () => {
    expect(zNotificationSettingListResponse.safeParse(bodyWith({ objectId: null })).success).toBe(true);
  });

  it('rejects an absent objectId (the API always sends it, null when not tied to an object)', () => {
    expect(zNotificationSettingListResponse.safeParse(bodyWith({})).success).toBe(false);
  });

  it('still rejects a non-integer objectId', () => {
    expect(zNotificationSettingListResponse.safeParse(bodyWith({ objectId: 'not-a-number' })).success).toBe(false);
  });
});
