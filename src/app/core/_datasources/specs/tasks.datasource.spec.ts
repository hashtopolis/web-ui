/// <reference types="jasmine" />
import { of, throwError } from 'rxjs';

import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { JChunk } from '@models/chunk.model';
import { Filter, FilterType, RequestParams } from '@models/request-params.model';
import { JTask, JTaskWrapperDisplay, TaskType } from '@models/task.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { TasksDataSource } from '@src/app/core/_datasources/tasks.datasource';
import { mockResponse } from '@src/app/testing/mock-response';

// Mock data

const MOCK_WRAPPER: JTaskWrapperDisplay = {
  id: 1,
  type: 'taskWrapperDisplay',
  taskWrapperId: 10,
  taskWrapperName: 'Test Wrapper',
  taskWrapperIsArchived: 0
} as unknown as JTaskWrapperDisplay;

/** Item that has no taskWrapperId — the map() fallback should use id instead. */
const MOCK_WRAPPER_NO_WRAPPER_ID: JTaskWrapperDisplay = {
  id: 99,
  type: 'taskWrapperDisplay',
  taskWrapperName: 'No-ID Wrapper',
  taskWrapperIsArchived: 0
} as unknown as JTaskWrapperDisplay;

// Suite

describe('TasksDataSource', () => {
  let dataSource: TasksDataSource;
  let gsSpy: jasmine.SpyObj<GlobalService>;
  let deserializeSpy: jasmine.Spy;

  beforeEach(() => {
    gsSpy = jasmine.createSpyObj('GlobalService', ['getAll']);

    const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck', 'detectChanges']);
    const uiServiceSpy = jasmine.createSpyObj('UIConfigService', ['getUISettings']);
    uiServiceSpy.getUISettings.and.returnValue({});
    const autoRefreshSpy = jasmine.createSpyObj(
      'AutoRefreshService',
      ['toggleAutoRefresh', 'startAutoRefresh', 'stopAutoRefresh'],
      { refresh$: of() }
    );
    const cacheSpy = jasmine.createSpyObj('HttpCacheService', ['invalidate']);
    const storageSpy = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem']);
    storageSpy.getItem.and.returnValue(null);

    gsSpy.getAll.and.returnValue(of(mockResponse()));

    deserializeSpy = spyOn(JsonAPISerializer.prototype, 'deserialize').and.returnValue([MOCK_WRAPPER]);

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

  // setFilterQuery()

  describe('setFilterQuery()', () => {
    it('should store the provided filter', () => {
      const filter: Filter = { field: 'taskWrapperName', operator: FilterType.EQUAL, value: 'foo' };
      dataSource.setFilterQuery(filter);
      expect(dataSource['filterQuery']).toEqual(filter);
    });
  });

  // setHashlistID()

  describe('setHashlistID()', () => {
    it('should store the provided hashlist ID', () => {
      dataSource.setHashlistID(7);
      expect(dataSource['_hashlistID']).toBe(7);
    });
  });

  // setIsArchived()

  describe('setIsArchived()', () => {
    it('should set _isArchived to the provided value', () => {
      dataSource.setIsArchived(true);
      expect(dataSource['_isArchived']).toBeTrue();

      dataSource.setIsArchived(false);
      expect(dataSource['_isArchived']).toBeFalse();
    });

    it('should reset pageAfter, pageBefore and index', () => {
      dataSource.pageAfter = 'abc';
      dataSource.pageBefore = 'xyz';
      dataSource.index = 5;

      dataSource.setIsArchived(true);

      expect(dataSource.pageAfter).toBeNull();
      expect(dataSource.pageBefore).toBeNull();
      expect(dataSource.index).toBe(0);
    });

    it('should clear table filter and current selection as part of reset()', () => {
      dataSource.filter = 'sha1';
      dataSource.selection.select(MOCK_WRAPPER);

      dataSource.setIsArchived(true);

      expect(dataSource.filter).toBe('');
      expect(dataSource.selection.selected.length).toBe(0);
    });
  });

  // loadAll()

  describe('loadAll()', () => {
    it('should call service.getAll with SERV.TASKS_WRAPPER_DISPLAYS', () => {
      dataSource.loadAll();
      const [serviceConfig] = gsSpy.getAll.calls.mostRecent().args;
      expect(serviceConfig).toEqual(SERV.TASKS_WRAPPER_DISPLAYS);
    });

    it('should set loading to false after a successful response', () => {
      dataSource.loadAll();
      expect(dataSource['loadingSubject'].getValue()).toBeFalse();
    });

    it('should populate the data with the deserialized items', () => {
      dataSource.loadAll();
      expect(dataSource.getOriginalData().length).toBe(1);
      expect(dataSource.getOriginalData()[0].taskWrapperName).toBe(MOCK_WRAPPER.taskWrapperName);
    });

    it('should always include a taskWrapperIsArchived filter', () => {
      dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).filter).toContain(jasmine.objectContaining({ field: 'taskWrapperIsArchived' }));
    });

    it('should pass the current _isArchived value in the filter', () => {
      dataSource.setIsArchived(true);
      dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).filter).toContain(
        jasmine.objectContaining({ field: 'taskWrapperIsArchived', value: true })
      );
    });

    it('should add an extra filter when a query is provided', () => {
      const query: Filter = { field: 'taskWrapperName', operator: FilterType.EQUAL, value: 'bar' };
      dataSource.loadAll(query);
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).filter).toContain(
        jasmine.objectContaining({ field: 'taskWrapperName', value: 'bar' })
      );
    });

    it('should add a hashlistId filter when _hashlistID is set', () => {
      dataSource.setHashlistID(42);
      dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).filter).toContain(jasmine.objectContaining({ field: 'hashlistId', value: 42 }));
    });

    it('should not add a hashlistId filter when _hashlistID is 0', () => {
      dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      const filter = (params as RequestParams).filter ?? [];
      expect(filter.some((f: Filter) => f.field === 'hashlistId')).toBeFalse();
    });

    it('should preserve taskWrapperId when it is present on the item', () => {
      dataSource.loadAll();
      expect(dataSource.getOriginalData()[0].taskWrapperId).toBe(MOCK_WRAPPER.taskWrapperId);
    });

    it('should fall back to id as taskWrapperId when taskWrapperId is absent', () => {
      deserializeSpy.and.returnValue([MOCK_WRAPPER_NO_WRAPPER_ID]);
      dataSource.loadAll();
      expect(dataSource.getOriginalData()[0].taskWrapperId).toBe(MOCK_WRAPPER_NO_WRAPPER_ID.id);
    });

    it('should set totalItems from meta.page.total_elements', () => {
      gsSpy.getAll.and.returnValue(of(mockResponse({ meta: { page: { total_elements: 99 } } })));
      dataSource.loadAll();
      expect(dataSource.totalItems).toBe(99);
    });

    it('should extract the page[after] cursor from links.next', () => {
      gsSpy.getAll.and.returnValue(
        of(
          mockResponse({
            meta: { page: { total_elements: 50 } },
            links: { self: '/test', next: 'https://api/test?page%5Bafter%5D=cursor123' }
          })
        )
      );
      dataSource.loadAll();
      expect(dataSource.pageAfter).toBe('cursor123');
    });

    it('should extract the page[before] cursor from links.prev', () => {
      gsSpy.getAll.and.returnValue(
        of(
          mockResponse({
            meta: { page: { total_elements: 50 } },
            links: { self: '/test', prev: 'https://api/test?page%5Bbefore%5D=cursorXYZ' }
          })
        )
      );
      dataSource.loadAll();
      expect(dataSource.pageBefore).toBe('cursorXYZ');
    });

    it('should set pageAfter to null when links.next is absent', () => {
      gsSpy.getAll.and.returnValue(of(mockResponse({ meta: { page: { total_elements: 0 } } })));
      dataSource.loadAll();
      expect(dataSource.pageAfter).toBeNull();
    });

    it('should compute supertask currentSpeed and totalAssignedAgents from related subtask chunks', () => {
      const supertaskWrapper: JTaskWrapperDisplay = {
        ...MOCK_WRAPPER,
        taskType: TaskType.SUPERTASK,
        taskWrapperId: 1300
      } as unknown as JTaskWrapperDisplay;
      const subtask: JTask = {
        id: 1337,
        type: 'task',
        taskWrapperId: 1300,
        keyspace: 1000
      } as unknown as JTask;
      const now = Math.floor(Date.now() / 1000);
      const chunk: JChunk = {
        id: 1,
        type: 'chunk',
        taskId: 1337,
        agentId: 1,
        skip: 0,
        length: 100,
        dispatchTime: now,
        solveTime: now,
        checkpoint: 50,
        progress: 5000,
        state: 0,
        cracked: 0,
        speed: 14000
      } as unknown as JChunk;

      gsSpy.getAll.and.returnValues(of(mockResponse()), of(mockResponse()), of(mockResponse()));
      deserializeSpy.and.returnValues([supertaskWrapper], [subtask], [chunk]);

      dataSource.loadAll();

      expect(gsSpy.getAll.calls.count()).toBe(3);
      expect(dataSource.getOriginalData()[0].currentSpeed).toBe(14000);
      expect(dataSource.getOriginalData()[0].totalAssignedAgents).toBe(1);
    });

    it('should call handleFilterError and stop loading when request fails', () => {
      gsSpy.getAll.and.returnValue(throwError(() => new Error('backend failed')));
      const handleFilterErrorSpy = spyOn(dataSource as never, 'handleFilterError').and.callThrough();

      dataSource.loadAll();

      expect(handleFilterErrorSpy).toHaveBeenCalled();
      expect(dataSource['loadingSubject'].getValue()).toBeFalse();
    });
  });

  // reload()

  describe('reload()', () => {
    it('should clear selected rows before reloading', () => {
      dataSource.selection.select(MOCK_WRAPPER);
      gsSpy.getAll.calls.reset();

      dataSource.reload();

      expect(dataSource.selection.selected.length).toBe(0);
      expect(gsSpy.getAll).toHaveBeenCalled();
    });

    it('should call loadAll() with filterQuery when filterQuery has a value', () => {
      const filter: Filter = { field: 'taskWrapperName', operator: FilterType.EQUAL, value: 'myTask' };
      dataSource.setFilterQuery(filter);
      gsSpy.getAll.calls.reset();

      dataSource.reload();

      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).filter).toContain(
        jasmine.objectContaining({ field: 'taskWrapperName', value: 'myTask' })
      );
    });

    it('should call loadAll() without the stored filter when filterQuery has no value', () => {
      dataSource.setFilterQuery({ field: 'taskWrapperName', operator: FilterType.EQUAL, value: '' });
      gsSpy.getAll.calls.reset();

      dataSource.reload();

      expect(gsSpy.getAll).toHaveBeenCalled();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      const filter = (params as RequestParams).filter ?? [];
      expect(filter.some((f: Filter) => f.field === 'taskWrapperName')).toBeFalse();
    });

    it('should call loadAll() without filter args when no filterQuery is set', () => {
      gsSpy.getAll.calls.reset();
      dataSource.reload();
      expect(gsSpy.getAll).toHaveBeenCalled();
    });
  });
});
