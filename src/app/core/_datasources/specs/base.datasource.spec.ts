import { Subject } from 'rxjs';
import type { MockedObject } from 'vitest';

import { ChangeDetectorRef, Injector } from '@angular/core';

import { BaseModel } from '@models/base.model';
import { TableSortDirection } from '@models/config-ui.model';

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
  public handleError(error: never): void {
    this.handleFilterError(error);
  }
}

describe('BaseDataSource Pagination', () => {
  let dataSource: TestBaseDataSource;
  let mockInjector: MockedObject<Injector>;
  let cdr: { markForCheck: ReturnType<typeof vi.fn>; detectChanges: ReturnType<typeof vi.fn> };
  let refresh$: Subject<void>;
  let autoRefreshService: {
    toggleAutoRefresh: ReturnType<typeof vi.fn>;
    startAutoRefresh: ReturnType<typeof vi.fn>;
    stopAutoRefresh: ReturnType<typeof vi.fn>;
    refresh$: Subject<void>;
  };
  let cacheService: { invalidate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    // Create mocks
    const mockUIConfigService = {
      getUISettings: vi.fn().mockName('UIConfigService.getUISettings')
    };
    mockUIConfigService.getUISettings.mockReturnValue({});

    const mockLocalStorageService = {
      getItem: vi.fn().mockName('getItem').mockReturnValue(null)
    };
    cdr = {
      markForCheck: vi.fn().mockName('ChangeDetectorRef.markForCheck'),
      detectChanges: vi.fn().mockName('ChangeDetectorRef.detectChanges')
    };

    // Use plain objects for services not explicitly used in the test
    const mockGlobalService = {};
    refresh$ = new Subject<void>();
    autoRefreshService = { toggleAutoRefresh: vi.fn(), startAutoRefresh: vi.fn(), stopAutoRefresh: vi.fn(), refresh$ };
    cacheService = { invalidate: vi.fn() };
    const mockPermissionService = {};

    // Setup Injector mock
    mockInjector = {
      get: vi.fn().mockName('Injector.get')
    };

    // Map dependencies to their mocks
    vi.when(mockInjector.get).calledWith(ChangeDetectorRef).thenReturn(cdr);
    vi.when(mockInjector.get).calledWith(UIConfigService).thenReturn(mockUIConfigService);
    vi.when(mockInjector.get).calledWith(GlobalService).thenReturn(mockGlobalService);
    vi.when(mockInjector.get).calledWith(AutoRefreshService).thenReturn(autoRefreshService);
    vi.when(mockInjector.get).calledWith(HttpCacheService).thenReturn(cacheService);
    vi.when(mockInjector.get).calledWith(LocalStorageService).thenReturn(mockLocalStorageService);
    vi.when(mockInjector.get).calledWith(PermissionService).thenReturn(mockPermissionService);
    vi.when(mockInjector.get).calledWith(JsonAPISerializer).thenReturn({});

    // Initialize the DataSource
    dataSource = new TestBaseDataSource(mockInjector);
  });

  it('should reset index and trigger reload when page becomes out of bounds (simulating cursor-based pagination)', async () => {
    // The reload is scheduled with setTimeout, so this test drives the clock.
    vi.useFakeTimers();
    try {
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
    } finally {
      vi.useRealTimers();
    }
  });

  it('should NOT reload if totalItems is 0 when out of bounds', async () => {
    // The reload would be scheduled with setTimeout, so flush the clock before asserting it never ran.
    vi.useFakeTimers();
    try {
      // Current state: 0 items total.
      dataSource.setPaginationConfig(5, 0, null, null, 0);

      // Trigger potential reload
      await vi.advanceTimersByTimeAsync(0);

      // Verify reload was NOT called because totalItems is not > 0
      expect(dataSource.reload).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  it('publishes loading and data changes through its observable API', () => {
    const states: boolean[] = [];
    const rows: BaseModel[][] = [];
    dataSource.loading$.subscribe((value) => states.push(value));
    dataSource.connect({} as never).subscribe((value) => rows.push(value));
    const data = [{ id: 1, type: 'sample' } as BaseModel];

    dataSource.loading = true;
    dataSource.setData(data);

    expect(states).toEqual([false, true]);
    expect(rows).toEqual([[], data]);
    expect(dataSource.getOriginalData()).toBe(data);
    expect(dataSource.lastUpdated).toBeInstanceOf(Date);
  });

  it('filters by a field or full object, sorts the visible rows, and resets pagination', () => {
    const first = { id: 1, type: 'sample', name: 'beta', score: 2 } as BaseModel & { name: string; score: number };
    const second = { id: 2, type: 'sample', name: 'Alpha', score: 10 } as BaseModel & { name: string; score: number };
    dataSource.setData([first, second]);
    const firstPage = vi.fn();
    dataSource.paginator = { firstPage } as never;
    dataSource.index = 3;
    dataSource.sortingColumn = { dataKey: 'name', direction: TableSortDirection.ASC } as never;

    dataSource.applyClientFilter('a', { dataKey: 'name' } as never);

    expect(dataSource['dataSubject'].getValue()).toEqual([second, first]);
    expect(dataSource.index).toBe(0);
    expect(firstPage).toHaveBeenCalled();
    expect(dataSource['filterItems']('beta', null)).toEqual([first]);
    expect(dataSource['filterItems']('ALPHA', { dataKey: 'all' } as never)).toEqual([second]);
    expect(dataSource['filterItems']('x', {} as never)).toEqual([]);
  });

  it('sorts numbers descending and keeps null or mixed values stable', () => {
    const high = { id: 1, type: 'row', rank: 10 } as never;
    const low = { id: 2, type: 'row', rank: 2 } as never;
    dataSource.sortingColumn = { dataKey: 'rank', direction: TableSortDirection.DESC } as never;
    expect(dataSource['applySorting']([low, high])).toEqual([high, low]);
    expect(dataSource['applySorting']([{ id: 3, type: 'row', rank: null }, high] as never[])[0]).toMatchObject({
      rank: null
    });
    expect(dataSource['applySorting']([{ id: 4, type: 'row', rank: '10' }, low] as never[])).toHaveLength(2);
  });

  it('supports row selection, select all, and toggle behavior', () => {
    const first = { id: 1, type: 'sample' } as BaseModel;
    const second = { id: 2, type: 'sample' } as BaseModel;
    dataSource.setData([first, second]);
    expect(dataSource.hasSelected()).toBe(false);
    dataSource.toggleRow(first);
    expect(dataSource.isSelected(first)).toBe(true);
    expect(dataSource.indeterminate()).toBe(true);
    dataSource.toggleAll();
    expect(dataSource.isAllSelected()).toBe(true);
    dataSource.toggleAll();
    expect(dataSource.hasSelected()).toBe(false);
    dataSource.selection.select(first);
    dataSource.clearSelection();
    expect(dataSource.selection.hasValue()).toBe(false);
  });

  it('resets filter, data and selection and optionally returns paginator to its first page', () => {
    const row = { id: 1, type: 'sample' } as BaseModel;
    const firstPage = vi.fn();
    dataSource.setData([row]);
    dataSource.paginator = { firstPage } as never;
    dataSource.filter = 'needle';
    dataSource.selection.select(row);
    dataSource.reset(false);
    expect(dataSource.filter).toBe('');
    expect(dataSource.selection.hasValue()).toBe(false);
    expect(firstPage).not.toHaveBeenCalled();
    dataSource.reset(true);
    expect(firstPage).toHaveBeenCalledOnce();
    expect(dataSource['dataSubject'].getValue()).toEqual([row]);
  });

  it('synchronizes valid pagination with the paginator and keeps prior total when omitted', () => {
    const firstPage = vi.fn();
    dataSource.paginator = { firstPage, length: 0, pageIndex: 0 } as never;
    dataSource.setPaginationConfig(5, 12, 'after', 'before', 1);
    dataSource.setPaginationConfig(5, undefined, null, null, 1);
    expect(dataSource.totalItems).toBe(12);
    expect(dataSource.index).toBe(1);
    expect(dataSource.pageAfter).toBeNull();
    expect(dataSource.paginator).toMatchObject({ length: 12, pageIndex: 1 });
  });

  it('invalidates cache on force reload and wires auto-refresh lifecycle actions', () => {
    dataSource.forceReload();
    expect(cacheService.invalidate).toHaveBeenCalledOnce();
    expect(dataSource.reload).toHaveBeenCalledOnce();

    dataSource.toggleAutoRefresh(true);
    expect(autoRefreshService.toggleAutoRefresh).toHaveBeenCalledWith(true, { immediate: true });
    dataSource.toggleAutoRefresh(false);
    expect(dataSource.autoRefreshEnabled).toBe(false);
    dataSource.startAutoRefresh();
    expect(autoRefreshService.startAutoRefresh).toHaveBeenCalledWith({ immediate: false });
    dataSource.stopAutoRefresh();
    expect(autoRefreshService.stopAutoRefresh).toHaveBeenCalledOnce();
    expect(dataSource.autoRefreshEnabled).toBe(false);
  });

  it('restores the active cursor and reloads when auto-refresh emits', () => {
    dataSource.pageAfter = 'used-after';
    dataSource.pageBefore = 'used-before';
    dataSource.setPaginationConfig(5, 20, 'next-after', 'next-before', 1);
    dataSource.toggleAutoRefresh(true);

    refresh$.next();

    expect(cacheService.invalidate).toHaveBeenCalledOnce();
    expect(dataSource.pageAfter).toBe('used-after');
    expect(dataSource.pageBefore).toBe('used-before');
    expect(dataSource.reload).toHaveBeenCalledOnce();
  });

  it('emits normalized HTTP filter error messages', () => {
    const errors: string[] = [];
    dataSource.filterError$.subscribe((error) => errors.push(error));
    dataSource.handleError({ error: { title: 'Forbidden details' }, status: 403 } as never);
    dataSource.handleError({ status: 403 } as never);
    dataSource.handleError({ status: 400 } as never);
    dataSource.handleError({ status: 500, statusText: 'Server error' } as never);
    dataSource.handleError({} as never);

    expect(errors).toEqual([
      'Forbidden details',
      'Access forbidden. Please check your permissions.',
      'Invalid filter parameter',
      'Server error'
    ]);
  });
});
