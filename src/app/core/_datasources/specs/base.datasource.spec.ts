import { ChangeDetectorRef, Injector } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';

import { GlobalService } from '@services/main.service';
import { PermissionService } from '@services/permission/permission.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { BaseDataSource } from '@datasources/base.datasource';

class TestBaseDataSource extends BaseDataSource<BaseModel> {
  public reload = jasmine.createSpy('reload');
}

describe('BaseDataSource Pagination', () => {
  let dataSource: TestBaseDataSource;
  let mockInjector: jasmine.SpyObj<Injector>;

  beforeEach(() => {
    // Create mocks
    const mockUIConfigService = jasmine.createSpyObj('UIConfigService', ['getUISettings']);
    mockUIConfigService.getUISettings.and.returnValue({});

    const mockLocalStorageService = {
      getItem: jasmine.createSpy('getItem').and.returnValue(null)
    };
    const mockCdr = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck', 'detectChanges']);

    // Use plain objects for services not explicitly used in the test
    const mockGlobalService = {};
    const mockAutoRefreshService = {};
    const mockHttpCacheService = {};
    const mockPermissionService = {};

    // Setup Injector mock
    mockInjector = jasmine.createSpyObj('Injector', ['get']);

    // Map dependencies to their mocks
    mockInjector.get.withArgs(ChangeDetectorRef).and.returnValue(mockCdr);
    mockInjector.get.withArgs(UIConfigService).and.returnValue(mockUIConfigService);
    mockInjector.get.withArgs(GlobalService).and.returnValue(mockGlobalService);
    mockInjector.get.withArgs(AutoRefreshService).and.returnValue(mockAutoRefreshService);
    mockInjector.get.withArgs(HttpCacheService).and.returnValue(mockHttpCacheService);
    mockInjector.get.withArgs(LocalStorageService).and.returnValue(mockLocalStorageService);
    mockInjector.get.withArgs(PermissionService).and.returnValue(mockPermissionService);

    // Initialize the DataSource
    dataSource = new TestBaseDataSource(mockInjector);
  });

  it('should reset index and trigger reload when page becomes out of bounds (simulating cursor-based pagination)', fakeAsync(() => {
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
    tick();

    // Verify that reload was called
    expect(dataSource.reload).toHaveBeenCalled();
  }));

  it('should NOT reload if totalItems is 0 when out of bounds', fakeAsync(() => {
    // Current state: 0 items total.
    dataSource.setPaginationConfig(5, 0, null, null, 0);

    // Trigger potential reload
    tick();

    // Verify reload was NOT called because totalItems is not > 0
    expect(dataSource.reload).not.toHaveBeenCalled();
  }));
});
