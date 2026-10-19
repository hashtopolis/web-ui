import type { MockedObject } from 'vitest';

import { ChangeDetectorRef, Injector } from '@angular/core';

import { BaseModel } from '@models/base.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { GlobalService } from '@services/main.service';
import { PermissionService } from '@services/permission/permission.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { BaseDataSource } from '@datasources/base.datasource';

class TestBaseDataSource extends BaseDataSource<BaseModel> {
  public reload = vi.fn().mockName('reload');
}

describe('BaseDataSource Pagination', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  let dataSource: TestBaseDataSource;
  let mockInjector: MockedObject<Injector>;

  beforeEach(() => {
    // Create mocks
    const mockUIConfigService = {
      getUISettings: vi.fn().mockName('UIConfigService.getUISettings')
    };
    mockUIConfigService.getUISettings.mockReturnValue({});

    const mockLocalStorageService = {
      getItem: vi.fn().mockName('getItem').mockReturnValue(null)
    };
    const mockCdr = {
      markForCheck: vi.fn().mockName('ChangeDetectorRef.markForCheck'),
      detectChanges: vi.fn().mockName('ChangeDetectorRef.detectChanges')
    };

    // Use plain objects for services not explicitly used in the test
    const mockGlobalService = {};
    const mockAutoRefreshService = {};
    const mockHttpCacheService = {};
    const mockPermissionService = {};

    // Setup Injector mock
    mockInjector = {
      get: vi.fn().mockName('Injector.get')
    };

    // Map dependencies to their mocks
    vi.when(mockInjector.get).calledWith(ChangeDetectorRef).thenReturn(mockCdr);
    vi.when(mockInjector.get).calledWith(UIConfigService).thenReturn(mockUIConfigService);
    vi.when(mockInjector.get).calledWith(GlobalService).thenReturn(mockGlobalService);
    vi.when(mockInjector.get).calledWith(AutoRefreshService).thenReturn(mockAutoRefreshService);
    vi.when(mockInjector.get).calledWith(HttpCacheService).thenReturn(mockHttpCacheService);
    vi.when(mockInjector.get).calledWith(LocalStorageService).thenReturn(mockLocalStorageService);
    vi.when(mockInjector.get).calledWith(PermissionService).thenReturn(mockPermissionService);
    vi.when(mockInjector.get).calledWith(JsonAPISerializer).thenReturn({});

    // Initialize the DataSource
    dataSource = new TestBaseDataSource(mockInjector);
  });

  it('should reset index and trigger reload when page becomes out of bounds (simulating cursor-based pagination)', async () => {
    // Scenario:
    // Total 6 items, pageSize 5.
    // You are on Page 2 (index 1) and delete an item.
    // The API provided a cursor for the end of page 1 ('cursor_after_item_5').
    const mockCursor = 'cursor_after_item_5';

    // We simulate the API response:
    // "You are on index 1, and your cursor is 'cursor_after_item_5'"
    // But since totalItems is 5 after deleting the sixth and pageSize is 5, index 1 is now invalid.
    dataSource.setPaginationConfig(5, 4, null, mockCursor, 1);

    // Verify state:
    // The logic should have detected index 1 > maxPageIndex (0)
    // And reset the cursors to undefined
    expect(dataSource.index).toBe(0);
    expect(dataSource.pageAfter).toBeUndefined();
    expect(dataSource.pageBefore).toBeUndefined();

    // Trigger the setTimeout
    await vi.advanceTimersByTimeAsync(0);

    // Verify that reload was called
    expect(dataSource.reload).toHaveBeenCalled();
  });

  it('should NOT reload if totalItems is 0 when out of bounds', async () => {
    // Current state: 0 items total.
    dataSource.setPaginationConfig(5, 0, null, null, 0);

    // Trigger potential reload
    await vi.advanceTimersByTimeAsync(0);

    // Verify reload was NOT called because totalItems is not > 0
    expect(dataSource.reload).not.toHaveBeenCalled();
  });
});
