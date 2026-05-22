/// <reference types="jasmine" />
import { zFileListResponse, zPreTaskResponse, zTaskResponse } from '@generated/api/zod';
import { of, throwError } from 'rxjs';

import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { FileType, JFile } from '@models/file.model';
import { JPretask } from '@models/pretask.model';
import { Filter, FilterType, RequestParams } from '@models/request-params.model';
import { JTask } from '@models/task.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { FilesDataSource } from '@src/app/core/_datasources/files.datasource';
import { mockResponse } from '@src/app/testing/mock-response';

// Mock data

const MOCK_FILE: JFile = {
  id: 2,
  type: 'file',
  filename: 'wordlist1.txt',
  size: 29825361920,
  isSecret: false,
  fileType: FileType.WORDLIST,
  accessGroupId: 1,
  lineCount: 2473033125,
  accessGroup: { id: 1, groupName: 'Default Group' }
} as unknown as JFile;

const MOCK_TASK: JTask = {
  id: 100,
  type: 'task',
  taskName: 'Test Task',
  files: [MOCK_FILE]
} as unknown as JTask;

const MOCK_PRETASK: JPretask = {
  id: 200,
  type: 'pretask',
  taskName: 'Test Pretask',
  pretaskFiles: [MOCK_FILE]
} as unknown as JPretask;

// Suite

describe('FilesDataSource', () => {
  let dataSource: FilesDataSource;
  let gsSpy: jasmine.SpyObj<GlobalService>;
  let _deserializeSpy: jasmine.Spy;

  beforeEach(() => {
    gsSpy = jasmine.createSpyObj('GlobalService', ['get', 'getAll']);

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
    gsSpy.get.and.returnValue(of(mockResponse()));

    _deserializeSpy = spyOn(JsonAPISerializer.prototype, 'deserialize').and.callFake(
      (_body: unknown, schema?: unknown) => {
        if (schema === zTaskResponse) return MOCK_TASK;
        if (schema === zPreTaskResponse) return MOCK_PRETASK;
        if (schema === zFileListResponse) return [MOCK_FILE];
        return [];
      }
    );

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
    dataSource = new FilesDataSource(injector);
  });

  afterEach(() => TestBed.resetTestingModule());

  // setFileType() / getFileType()

  describe('setFileType() / getFileType()', () => {
    it('should default to WORDLIST (0)', () => {
      expect(dataSource.getFileType()).toBe(FileType.WORDLIST);
    });

    it('should store and return the provided file type', () => {
      dataSource.setFileType(FileType.RULES);
      expect(dataSource.getFileType()).toBe(FileType.RULES);
    });
  });

  // setEditValues()

  describe('setEditValues()', () => {
    it('should store the editIndex and editType', () => {
      dataSource.setEditValues(42, 1);
      expect(dataSource['editIndex']).toBe(42);
      expect(dataSource['editType']).toBe(1);
    });
  });

  // loadAll() — list mode (no editIndex)

  describe('loadAll() — list mode', () => {
    it('should call service.getAll with SERV.FILES', () => {
      dataSource.loadAll();
      const [serviceConfig] = gsSpy.getAll.calls.mostRecent().args;
      expect(serviceConfig).toEqual(SERV.FILES);
    });

    it('should include accessGroup in the request params', () => {
      dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).include).toContain('accessGroup');
    });

    it('should filter by the stored fileType', () => {
      dataSource.setFileType(FileType.RULES);
      dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).filter).toContain(
        jasmine.objectContaining({ field: 'fileType', value: FileType.RULES })
      );
    });

    it('should apply the provided query filter', () => {
      const query: Filter = { field: 'filename', operator: FilterType.ICONTAINS, value: 'rockyou' };
      dataSource.loadAll(query);
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).filter).toContain(
        jasmine.objectContaining({ field: 'filename', value: 'rockyou' })
      );
    });

    it('should persist the query as _currentFilter', () => {
      const query: Filter = { field: 'filename', operator: FilterType.ICONTAINS, value: 'cyclone' };
      dataSource.loadAll(query);
      expect(dataSource['_currentFilter']).toEqual(query);
    });

    it('should reuse _currentFilter on a subsequent call without query', () => {
      const query: Filter = { field: 'filename', operator: FilterType.ICONTAINS, value: 'cyclone' };
      dataSource.loadAll(query);
      gsSpy.getAll.calls.reset();
      dataSource.loadAll(); // no query — should reuse stored filter
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).filter).toContain(
        jasmine.objectContaining({ field: 'filename', value: 'cyclone' })
      );
    });

    it('should populate data with the deserialized files', () => {
      dataSource.loadAll();
      expect(dataSource.getOriginalData().length).toBe(1);
      expect(dataSource.getOriginalData()[0].filename).toBe(MOCK_FILE.filename);
    });

    it('should set totalItems from meta.page.total_elements', () => {
      gsSpy.getAll.and.returnValue(of(mockResponse({ meta: { page: { total_elements: 6 } } })));
      dataSource.loadAll();
      expect(dataSource.totalItems).toBe(6);
    });

    it('should extract the page[after] cursor from links.next', () => {
      gsSpy.getAll.and.returnValue(
        of(
          mockResponse({
            meta: { page: { total_elements: 50 } },
            links: { self: '/test', next: 'https://api/test?page%5Bafter%5D=cursorABC' }
          })
        )
      );
      dataSource.loadAll();
      expect(dataSource.pageAfter).toBe('cursorABC');
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

    it('should set pageAfter to null when links.next is absent or null', () => {
      dataSource.loadAll();
      expect(dataSource.pageAfter).toBeNull();
    });

    it('should set loading to false after a successful response', () => {
      dataSource.loadAll();
      expect(dataSource['loadingSubject'].getValue()).toBeFalse();
    });

    it('should call handleFilterError and stop loading when the request fails', () => {
      gsSpy.getAll.and.returnValue(throwError(() => new Error('backend error')));
      const handleFilterErrorSpy = spyOn(dataSource as never, 'handleFilterError').and.callThrough();
      dataSource.loadAll();
      expect(handleFilterErrorSpy).toHaveBeenCalled();
      expect(dataSource['loadingSubject'].getValue()).toBeFalse();
    });
  });

  // loadAll() — task detail mode (editType === 0)

  describe('loadAll() — task detail mode (editType 0)', () => {
    beforeEach(() => {
      dataSource.setEditValues(100, 0);
    });

    it('should call service.get with SERV.TASKS (not getAll)', () => {
      dataSource.loadAll();
      expect(gsSpy.get).toHaveBeenCalled();
      expect(gsSpy.getAll).not.toHaveBeenCalled();
      const [serviceConfig] = gsSpy.get.calls.mostRecent().args;
      expect(serviceConfig).toEqual(SERV.TASKS);
    });

    it('should include files in the request params', () => {
      dataSource.loadAll();
      const [, , params] = gsSpy.get.calls.mostRecent().args;
      expect((params as RequestParams).include).toContain('files');
    });

    it('should use the editIndex as the entity ID', () => {
      dataSource.loadAll();
      const [, entityId] = gsSpy.get.calls.mostRecent().args;
      expect(entityId).toBe(100);
    });

    it('should populate data with task.files', () => {
      dataSource.loadAll();
      expect(dataSource.getOriginalData().length).toBe(1);
      expect(dataSource.getOriginalData()[0].filename).toBe(MOCK_FILE.filename);
    });

    it('should set loading to false after response', () => {
      dataSource.loadAll();
      expect(dataSource['loadingSubject'].getValue()).toBeFalse();
    });
  });

  // loadAll() — pretask detail mode (editType === 1)

  describe('loadAll() — pretask detail mode (editType 1)', () => {
    beforeEach(() => {
      dataSource.setEditValues(200, 1);
    });

    it('should call service.get with SERV.PRETASKS (not getAll)', () => {
      dataSource.loadAll();
      expect(gsSpy.get).toHaveBeenCalled();
      expect(gsSpy.getAll).not.toHaveBeenCalled();
      const [serviceConfig] = gsSpy.get.calls.mostRecent().args;
      expect(serviceConfig).toEqual(SERV.PRETASKS);
    });

    it('should include pretaskFiles in the request params', () => {
      dataSource.loadAll();
      const [, , params] = gsSpy.get.calls.mostRecent().args;
      expect((params as RequestParams).include).toContain('pretaskFiles');
    });

    it('should use the editIndex as the entity ID', () => {
      dataSource.loadAll();
      const [, entityId] = gsSpy.get.calls.mostRecent().args;
      expect(entityId).toBe(200);
    });

    it('should populate data with pretask.pretaskFiles', () => {
      dataSource.loadAll();
      expect(dataSource.getOriginalData().length).toBe(1);
      expect(dataSource.getOriginalData()[0].filename).toBe(MOCK_FILE.filename);
    });

    // The `if (!this.editType)` guard inside the editType===1 subscribe branch is dead code
    // because !1 === false, so setPaginationConfig is never reached in pretask mode.
    it('should NOT configure pagination (if (!editType) guard is always false when editType=1)', () => {
      gsSpy.get.and.returnValue(of(mockResponse({ meta: { page: { total_elements: 99 } } })));
      dataSource.loadAll();
      expect(dataSource.totalItems).toBe(0);
    });

    it('should set loading to false after response', () => {
      dataSource.loadAll();
      expect(dataSource['loadingSubject'].getValue()).toBeFalse();
    });
  });

  // reload()

  describe('reload()', () => {
    it('should clear selected rows', () => {
      dataSource.selection.select(MOCK_FILE);
      dataSource.reload();
      expect(dataSource.selection.selected.length).toBe(0);
    });

    it('should call loadAll()', () => {
      gsSpy.getAll.calls.reset();
      dataSource.reload();
      expect(gsSpy.getAll).toHaveBeenCalled();
    });
  });

  // clearFilter()

  describe('clearFilter()', () => {
    it('should reset _currentFilter to null', () => {
      const query: Filter = { field: 'filename', operator: FilterType.ICONTAINS, value: 'rockyou' };
      dataSource.loadAll(query);
      expect(dataSource['_currentFilter']).toEqual(query);
      dataSource.clearFilter();
      expect(dataSource['_currentFilter']).toBeNull();
    });

    it('should call loadAll() to reload data after clearing', () => {
      gsSpy.getAll.calls.reset();
      dataSource.clearFilter();
      expect(gsSpy.getAll).toHaveBeenCalled();
    });

    it('should not apply the old filter in the reloaded request', () => {
      const query: Filter = { field: 'filename', operator: FilterType.ICONTAINS, value: 'rockyou' };
      dataSource.loadAll(query);
      gsSpy.getAll.calls.reset();
      dataSource.clearFilter(); // resets _currentFilter and calls loadAll() internally
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      const filter = (params as RequestParams).filter ?? [];
      expect(filter.some((f: Filter) => f.field === 'filename')).toBeFalse();
    });
  });
});
