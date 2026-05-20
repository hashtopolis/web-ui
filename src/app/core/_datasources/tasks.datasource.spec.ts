/// <reference types="jasmine" />
import { of, throwError } from 'rxjs';

import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ResponseWrapper } from '@models/response.model';

import { GlobalService } from '@services/main.service';
import { UIConfigService } from '@services/shared/storage.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { TasksDataSource } from './tasks.datasource';
import { mockResponse } from '@src/app/testing/mock-response';
import { UIConfig } from '@models/config-ui.model';

function buildMockResponse(taskWrappers: { id: number; attributes: Record<string, unknown> }[]): ResponseWrapper {
  return mockResponse({
    data: taskWrappers.map((t) => ({
      id: t.id,
      type: 'taskWrapperDisplay',
      attributes: t.attributes
    })),
    meta: { page: { total_elements: taskWrappers.length } },
    links: { self: '/test', next: null, prev: null }
  });
}

describe('TasksDataSource', () => {
  let dataSource: TasksDataSource;
  let gsSpy: jasmine.SpyObj<GlobalService>;

  beforeEach(() => {
    gsSpy = jasmine.createSpyObj('GlobalService', ['getAll']);

    const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck', 'detectChanges']);
    const uiServiceSpy = jasmine.createSpyObj('UIConfigService', ['getUISettings']);
    uiServiceSpy.getUISettings.and.returnValue({});
    const autoRefreshSpy = jasmine.createSpyObj('AutoRefreshService', ['toggleAutoRefresh', 'startAutoRefresh', 'stopAutoRefresh'], {
      refresh$: of()
    });
    const cacheSpy = jasmine.createSpyObj('HttpCacheService', ['invalidate']);
    const storageSpy = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem']);
    storageSpy.getItem.and.returnValue(null);

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
    dataSource = new TasksDataSource(injector);
  });

  describe('taskWrapperId mapping', () => {
    it('should set taskWrapperId from id when API does not return taskWrapperId', () => {
      const response = buildMockResponse([
        { id: 5, attributes: { displayName: 'Task A', taskType: 1 } },
        { id: 10, attributes: { displayName: 'Task B', taskType: 2 } }
      ]);
      gsSpy.getAll.and.returnValue(of(response));

      dataSource.loadAll();

      const data = dataSource.getOriginalData();
      expect(data[0].taskWrapperId).toBe(5);
      expect(data[1].taskWrapperId).toBe(10);
    });

    it('should keep existing taskWrapperId if API returns it', () => {
      const response = buildMockResponse([
        { id: 5, attributes: { displayName: 'Task A', taskWrapperId: 99 } }
      ]);
      gsSpy.getAll.and.returnValue(of(response));

      dataSource.loadAll();

      const data = dataSource.getOriginalData();
      expect(data[0].taskWrapperId).toBe(99);
    });

    it('should preserve all other fields when mapping taskWrapperId', () => {
      const response = buildMockResponse([
        { id: 5, attributes: { displayName: 'Task A', taskType: 1, hashlistId: 3 } }
      ]);
      gsSpy.getAll.and.returnValue(of(response));

      dataSource.loadAll();

      const data = dataSource.getOriginalData();
      expect(data[0].displayName).toBe('Task A');
      expect(data[0].hashlistId).toBe(3);
      expect(data[0].id).toBe(5);
    });
  });

  describe('loadAll', () => {
    it('should set loading to false after successful load', () => {
      gsSpy.getAll.and.returnValue(of(buildMockResponse([])));
      dataSource.loadAll();
      expect(dataSource['loadingSubject'].getValue()).toBeFalse();
    });

    it('should set loading to false after failed load', () => {
      gsSpy.getAll.and.returnValue(throwError(() => new Error('Network error')));
      dataSource.loadAll();
      expect(dataSource['loadingSubject'].getValue()).toBeFalse();
    });

    it('should set data from API response', () => {
      const response = buildMockResponse([
        { id: 1, attributes: { displayName: 'Task 1' } },
        { id: 2, attributes: { displayName: 'Task 2' } }
      ]);
      gsSpy.getAll.and.returnValue(of(response));

      dataSource.loadAll();

      expect(dataSource.getOriginalData().length).toBe(2);
    });

    it('should call reload with filter when filterQuery is set', () => {
      const filter = { field: 'name', operator: 'eq' as never, value: 'test' };
      gsSpy.getAll.and.returnValue(of(buildMockResponse([])));

      dataSource.setFilterQuery(filter);
      dataSource.reload();

      expect(gsSpy.getAll).toHaveBeenCalled();
    });
  });

  describe('setIsArchived', () => {
    it('should reset pagination when isArchived changes', () => {
      dataSource.pageAfter = 'someCursor';
      dataSource.index = 5;

      gsSpy.getAll.and.returnValue(of(buildMockResponse([])));
      dataSource.setIsArchived(true);

      expect(dataSource.pageAfter).toBeNull();
      expect(dataSource.index).toBe(0);
    });
  });
});
