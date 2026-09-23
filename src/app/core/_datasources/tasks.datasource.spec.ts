/// <reference types="jasmine" />
import type { TaskWrapperDisplayListResponse } from '@generated/api/types';
import { zTaskWrapperDisplayListResponse } from '@generated/api/zod';
import { of, throwError } from 'rxjs';

import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ResponseWrapper } from '@models/response.model';

import { GlobalService } from '@services/main.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { TasksDataSource } from '@datasources/tasks.datasource';

import { mockValidResponse } from '@src/app/testing/mock-response';

type TaskWrapperDisplayAttributes = TaskWrapperDisplayListResponse['data'][number]['attributes'];

function taskWrapperDisplayAttributes(
  overrides: Partial<TaskWrapperDisplayAttributes> = {}
): TaskWrapperDisplayAttributes {
  return {
    taskWrapperPriority: 0,
    taskWrapperMaxAgents: 0,
    taskType: 0,
    hashlistId: 1,
    accessGroupId: 1,
    taskWrapperName: '',
    displayName: 'Task',
    taskWrapperIsArchived: false,
    cracked: 0,
    taskId: 1,
    taskName: 'Task',
    color: null,
    attackCmd: '',
    chunkTime: 600,
    statusTimer: 5,
    keyspace: 0,
    keyspaceProgress: 0,
    taskPriority: 0,
    taskMaxAgents: 0,
    isSmall: false,
    isCpuTask: false,
    taskIsArchived: false,
    preprocessorId: 0,
    hashlistName: 'hashlist',
    hashCount: 0,
    hashlistCracked: 0,
    hashTypeId: 0,
    hashTypeDescription: 'MD5',
    groupName: 'Default',
    ...overrides
  };
}

function buildMockResponse(
  taskWrappers: { id: number; attributes: Partial<TaskWrapperDisplayAttributes> }[]
): ResponseWrapper {
  return mockValidResponse(zTaskWrapperDisplayListResponse, {
    data: taskWrappers.map((t) => ({
      id: t.id,
      type: 'taskWrapperDisplay',
      attributes: taskWrapperDisplayAttributes(t.attributes)
    })),
    meta: { page: { total_elements: taskWrappers.length } },
    links: { self: '/test', first: '/test', last: null, next: null, prev: null }
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
    const autoRefreshSpy = jasmine.createSpyObj(
      'AutoRefreshService',
      ['toggleAutoRefresh', 'startAutoRefresh', 'stopAutoRefresh'],
      {
        refresh$: of()
      }
    );
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
        { id: 10, attributes: { displayName: 'Task B', taskType: 1 } }
      ]);
      gsSpy.getAll.and.returnValue(of(response));

      dataSource.loadAll();

      const data = dataSource.getOriginalData();
      expect(data[0].taskWrapperId).toBe(5);
      expect(data[1].taskWrapperId).toBe(10);
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
