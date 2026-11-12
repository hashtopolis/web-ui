import { Subject } from 'rxjs';
import type { MockedObject } from 'vitest';

import { HttpErrorResponse } from '@angular/common/http';
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
  public handleError(error: HttpErrorResponse): void {
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
      expect(dataSource.reload).toHaveBeenCalledOnce();
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

    expect(states).toStrictEqual([false, true]);
    expect(rows).toStrictEqual([[], data]);
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

    expect(dataSource['dataSubject'].getValue()).toStrictEqual([second, first]);
    expect(dataSource.index).toBe(0);
    expect(firstPage).toHaveBeenCalledOnce();
    expect(dataSource['filterItems']('beta', null)).toStrictEqual([first]);
    expect(dataSource['filterItems']('ALPHA', { dataKey: 'all' } as never)).toStrictEqual([second]);
    expect(dataSource['filterItems']('x', {} as never)).toStrictEqual([]);
  });

  it('sorts numbers descending and keeps null or mixed values stable', () => {
    const high = { id: 1, type: 'row', rank: 10 } as never;
    const low = { id: 2, type: 'row', rank: 2 } as never;
    dataSource.sortingColumn = { dataKey: 'rank', direction: TableSortDirection.DESC } as never;
    expect(dataSource['applySorting']([low, high])).toStrictEqual([high, low]);
    expect(dataSource['applySorting']([{ id: 3, type: 'row', rank: null }, high] as never[])[0]).toMatchObject({
      rank: null
    });
    const mixed = { id: 4, type: 'row', rank: '10' } as never;
    expect(dataSource['applySorting']([low, high, mixed])).toStrictEqual([high, low, mixed]);
  });

  it('starts with no rows selected', () => {
    const first = { id: 1, type: 'sample' } as BaseModel;
    const second = { id: 2, type: 'sample' } as BaseModel;
    dataSource.setData([first, second]);
    expect(dataSource.hasSelected()).toBe(false);
  });

  it('selects one row and marks the selection as indeterminate', () => {
    const first = { id: 1, type: 'sample' } as BaseModel;
    const second = { id: 2, type: 'sample' } as BaseModel;
    dataSource.setData([first, second]);
    dataSource.toggleRow(first);
    expect(dataSource.isSelected(first)).toBe(true);
    expect(dataSource.isSelected(second)).toBe(false);
    expect(dataSource.indeterminate()).toBe(true);
  });

  it('deselects a selected row when toggled', () => {
    const first = { id: 1, type: 'sample' } as BaseModel;
    dataSource.selection.select(first);
    dataSource.toggleRow(first);
    expect(dataSource.isSelected(first)).toBe(false);
  });

  it('selects all rows when only some are selected', () => {
    const first = { id: 1, type: 'sample' } as BaseModel;
    const second = { id: 2, type: 'sample' } as BaseModel;
    dataSource.setData([first, second]);
    dataSource.selection.select(first);
    dataSource.toggleAll();
    expect(dataSource.isAllSelected()).toBe(true);
    expect(dataSource.indeterminate()).toBe(false);
  });

  it('clears the selection when all rows are selected', () => {
    const first = { id: 1, type: 'sample' } as BaseModel;
    const second = { id: 2, type: 'sample' } as BaseModel;
    dataSource.setData([first, second]);
    dataSource.selection.select(first, second);
    dataSource.toggleAll();
    expect(dataSource.hasSelected()).toBe(false);
  });

  it('clears the selection', () => {
    const first = { id: 1, type: 'sample' } as BaseModel;
    dataSource.selection.select(first);
    dataSource.clearSelection();
    expect(dataSource.hasSelected()).toBe(false);
  });

  it('resets filter, selection, and visible rows without changing pages', () => {
    const row = { id: 1, type: 'sample' } as BaseModel;
    const firstPage = vi.fn().mockName('paginator.firstPage');
    dataSource.setData([row]);
    dataSource['dataSubject'].next([]);
    dataSource.paginator = { firstPage } as never;
    dataSource.filter = 'needle';
    dataSource.selection.select(row);
    dataSource.reset(false);
    expect(dataSource.filter).toBe('');
    expect(dataSource.hasSelected()).toBe(false);
    expect(dataSource['dataSubject'].getValue()).toStrictEqual([row]);
    expect(firstPage).not.toHaveBeenCalled();
  });

  it('returns to the first page when reset requests it', () => {
    const row = { id: 1, type: 'sample' } as BaseModel;
    const firstPage = vi.fn().mockName('paginator.firstPage');
    dataSource.setData([row]);
    dataSource.paginator = { firstPage } as never;
    dataSource.reset(true);
    expect(firstPage).toHaveBeenCalledOnce();
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

  it('invalidates cache and reloads on force reload', () => {
    dataSource.forceReload();
    expect(cacheService.invalidate).toHaveBeenCalledOnce();
    expect(dataSource.reload).toHaveBeenCalledOnce();
  });

  it('enables auto-refresh and refreshes immediately when toggled on', () => {
    dataSource.toggleAutoRefresh(true);
    expect(autoRefreshService.toggleAutoRefresh).toHaveBeenCalledExactlyOnceWith(true, { immediate: true });
    expect(dataSource.autoRefreshEnabled).toBe(true);
  });

  it('disables auto-refresh and refreshes immediately when toggled off', () => {
    dataSource.autoRefreshEnabled = true;
    dataSource.toggleAutoRefresh(false);
    expect(autoRefreshService.toggleAutoRefresh).toHaveBeenCalledExactlyOnceWith(false, { immediate: true });
    expect(dataSource.autoRefreshEnabled).toBe(false);
  });

  it('starts auto-refresh without refreshing immediately', () => {
    dataSource.startAutoRefresh();
    expect(autoRefreshService.startAutoRefresh).toHaveBeenCalledExactlyOnceWith({ immediate: false });
    expect(dataSource.autoRefreshEnabled).toBe(true);
  });

  it('stops auto-refresh and no longer reloads on refresh events', () => {
    dataSource.startAutoRefresh();
    dataSource.stopAutoRefresh();
    refresh$.next();
    expect(autoRefreshService.stopAutoRefresh).toHaveBeenCalledOnce();
    expect(dataSource.autoRefreshEnabled).toBe(false);
    expect(dataSource.reload).not.toHaveBeenCalled();
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
    dataSource.handleError(new HttpErrorResponse({ error: { title: 'Forbidden details' }, status: 403 }));
    dataSource.handleError(new HttpErrorResponse({ status: 403 }));
    dataSource.handleError(new HttpErrorResponse({ status: 400 }));
    dataSource.handleError(new HttpErrorResponse({ status: 500, statusText: 'Server error' }));
    dataSource.handleError(new HttpErrorResponse({ status: 200 }));

    expect(errors).toStrictEqual([
      'Forbidden details',
      'Access forbidden. Please check your permissions.',
      'Invalid filter parameter',
      'Server error',
      'Unknown Error'
    ]);
  });
});
