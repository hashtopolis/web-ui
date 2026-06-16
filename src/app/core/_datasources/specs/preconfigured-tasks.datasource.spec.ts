/// <reference types="jasmine" />
import { zPreTaskListResponse, zSupertaskResponse } from '@generated/api/zod';
import { of, throwError } from 'rxjs';

import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { UiSettings } from '@models/config-ui.schema';
import { JFile } from '@models/file.model';
import { JPretask } from '@models/pretask.model';
import { Filter, FilterType, RequestParams } from '@models/request-params.model';
import { JSuperTask } from '@models/supertask.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { PreTasksDataSource } from '@src/app/core/_datasources/preconfigured-tasks.datasource';
import { mockResponse } from '@src/app/testing/mock-response';

// Mock data

const MOCK_FILE: JFile = {
  id: 8,
  type: 'file',
  filename: 'wordlist1.txt',
  size: 1069609,
  isSecret: false,
  fileType: 0,
  accessGroupId: 1,
  lineCount: 128417
} as unknown as JFile;

const MOCK_PRETASK: JPretask = {
  id: 7,
  type: 'preTask',
  taskName: 'Preconf_Wordlist1_dive-rule',
  attackCmd: '#HL# wordlist1.txt -r dive.rule',
  chunkTime: 600,
  statusTimer: 5,
  color: 'FF0000',
  isSmall: false,
  isCpuTask: false,
  useNewBench: true,
  priority: 0,
  maxAgents: 0,
  isMaskImport: false,
  crackerBinaryTypeId: 1,
  pretaskFiles: [MOCK_FILE]
} as unknown as JPretask;

const MOCK_SUPERTASK: JSuperTask = {
  id: 1,
  type: 'supertask',
  supertaskName: 'Test Supertask',
  pretasks: [MOCK_PRETASK]
} as unknown as JSuperTask;

const MOCK_SUPERTASK_NO_PRETASKS: JSuperTask = {
  id: 2,
  type: 'supertask',
  supertaskName: 'Empty Supertask',
  pretasks: []
} as unknown as JSuperTask;

// Suite

describe('PreTasksDataSource', () => {
  let dataSource: PreTasksDataSource;
  let gsSpy: jasmine.SpyObj<GlobalService>;
  let uiServiceSpy: jasmine.SpyObj<UIConfigService>;
  let deserializeSpy: jasmine.Spy;

  beforeEach(() => {
    gsSpy = jasmine.createSpyObj('GlobalService', ['get', 'getAll']);

    const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck', 'detectChanges']);
    uiServiceSpy = jasmine.createSpyObj('UIConfigService', ['getUISettings']);
    uiServiceSpy.getUISettings.and.returnValue(null);
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

    deserializeSpy = spyOn(JsonAPISerializer.prototype, 'deserialize').and.callFake(
      (_body: unknown, schema?: unknown) => {
        if (schema === zSupertaskResponse) return MOCK_SUPERTASK;
        if (schema === zPreTaskListResponse) return [MOCK_PRETASK];
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
    dataSource = new PreTasksDataSource(injector);
  });

  afterEach(() => TestBed.resetTestingModule());

  // setSuperTaskId()

  describe('setSuperTaskId()', () => {
    it('should store the provided supertask ID', () => {
      dataSource.setSuperTaskId(42);
      expect(dataSource['_superTaskId']).toBe(42);
    });
  });

  // setReverseQuery()

  describe('setReverseQuery()', () => {
    it('should store the provided reverse-query flag', () => {
      dataSource.setReverseQuery(true);
      expect(dataSource['_reverseQuery']).toBeTrue();

      dataSource.setReverseQuery(false);
      expect(dataSource['_reverseQuery']).toBeFalse();
    });
  });

  // loadAll() — simple mode (no superTaskId)

  describe('loadAll() — simple mode', () => {
    it('should call service.getAll with SERV.PRETASKS', async () => {
      await dataSource.loadAll();
      const [serviceConfig] = gsSpy.getAll.calls.mostRecent().args;
      expect(serviceConfig).toEqual(SERV.PRETASKS);
    });

    it('should include pretaskFiles in the request params', async () => {
      await dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).include).toContain('pretaskFiles');
    });

    it('should populate data with the deserialized pretasks', async () => {
      await dataSource.loadAll();
      expect(dataSource.getOriginalData().length).toBe(1);
      expect(dataSource.getOriginalData()[0].taskName).toBe(MOCK_PRETASK.taskName);
    });

    it('should set totalItems from meta.page.total_elements', async () => {
      gsSpy.getAll.and.returnValue(of(mockResponse({ meta: { page: { total_elements: 32 } } })));
      await dataSource.loadAll();
      expect(dataSource.totalItems).toBe(32);
    });

    it('should extract the page[after] cursor from links.next', async () => {
      gsSpy.getAll.and.returnValue(
        of(
          mockResponse({
            meta: { page: { total_elements: 32 } },
            links: {
              self: '/test',
              next: 'https://api/pretasks?page%5Bafter%5D=eyJwcmltYXJ5Ijp7InByaW9yaXR5Ijo2fX0%3D'
            }
          })
        )
      );
      await dataSource.loadAll();
      expect(dataSource.pageAfter).toBe('eyJwcmltYXJ5Ijp7InByaW9yaXR5Ijo2fX0=');
    });

    it('should set pageBefore to null when links.prev is null or absent', async () => {
      await dataSource.loadAll();
      expect(dataSource.pageBefore).toBeNull();
    });

    it('should append a query filter when provided', async () => {
      const query: Filter = { field: 'taskName', operator: FilterType.ICONTAINS, value: 'dive' };
      await dataSource.loadAll(query);
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).filter).toContain(
        jasmine.objectContaining({ field: 'taskName', value: 'dive' })
      );
    });

    it('should persist the query as _currentFilter', async () => {
      const query: Filter = { field: 'taskName', operator: FilterType.ICONTAINS, value: 'rockyou' };
      await dataSource.loadAll(query);
      expect(dataSource['_currentFilter']).toEqual(query);
    });

    it('should reuse _currentFilter on a subsequent call without query', async () => {
      const query: Filter = { field: 'taskName', operator: FilterType.ICONTAINS, value: 'rockyou' };
      await dataSource.loadAll(query);
      gsSpy.getAll.calls.reset();
      await dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).filter).toContain(
        jasmine.objectContaining({ field: 'taskName', value: 'rockyou' })
      );
    });

    it('should add isMaskImport=false filter when hideImportMasks is 1', async () => {
      uiServiceSpy.getUISettings.and.returnValue({ hideImportMasks: 1 } as unknown as UiSettings);
      await dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).filter).toContain(
        jasmine.objectContaining({ field: 'isMaskImport', operator: FilterType.EQUAL, value: false })
      );
    });

    it('should NOT add isMaskImport filter when hideImportMasks is 0', async () => {
      uiServiceSpy.getUISettings.and.returnValue({ hideImportMasks: 0 } as unknown as UiSettings);
      await dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      const filter: Filter[] = (params as RequestParams).filter ?? [];
      expect(filter.some((f) => f.field === 'isMaskImport')).toBeFalse();
    });

    it('should NOT add isMaskImport filter when hideImportMasks is absent', async () => {
      uiServiceSpy.getUISettings.and.returnValue(null);
      await dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      const filter: Filter[] = (params as RequestParams).filter ?? [];
      expect(filter.some((f) => f.field === 'isMaskImport')).toBeFalse();
    });

    it('should set loading to false after a successful response', async () => {
      await dataSource.loadAll();
      expect(dataSource['loadingSubject'].getValue()).toBeFalse();
    });

    it('should call handleFilterError and return empty data when request fails', async () => {
      gsSpy.getAll.and.returnValue(throwError(() => new Error('backend error')));
      const handleFilterErrorSpy = spyOn(dataSource as never, 'handleFilterError').and.callThrough();

      await dataSource.loadAll();

      expect(handleFilterErrorSpy).toHaveBeenCalled();
      expect(dataSource.getOriginalData().length).toBe(0);
      expect(dataSource['loadingSubject'].getValue()).toBeFalse();
    });
  });

  // loadAll() — supertask mode, pretasks assigned (IN)

  describe('loadAll() — supertask mode (assigned pretasks, reverseQuery=false)', () => {
    beforeEach(() => {
      dataSource.setSuperTaskId(1);
    });

    it('should call service.get with SERV.SUPER_TASKS to fetch the supertask', async () => {
      await dataSource.loadAll();
      expect(gsSpy.get).toHaveBeenCalled();
      const [serviceConfig, entityId] = gsSpy.get.calls.mostRecent().args;
      expect(serviceConfig).toEqual(SERV.SUPER_TASKS);
      expect(entityId).toBe(1);
    });

    it('should include pretasks in the supertask request params', async () => {
      await dataSource.loadAll();
      const [, , params] = gsSpy.get.calls.mostRecent().args;
      expect((params as RequestParams).include).toContain('pretasks');
    });

    it('should call service.getAll with SERV.PRETASKS to load pretask files', async () => {
      await dataSource.loadAll();
      expect(gsSpy.getAll).toHaveBeenCalled();
      const [serviceConfig] = gsSpy.getAll.calls.mostRecent().args;
      expect(serviceConfig).toEqual(SERV.PRETASKS);
    });

    it('should filter pretasks by pretaskId IN the assigned IDs', async () => {
      await dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).filter).toContain(
        jasmine.objectContaining({ field: 'pretaskId', operator: FilterType.IN, value: [MOCK_PRETASK.id] })
      );
    });

    it('should populate data from pretask files response', async () => {
      await dataSource.loadAll();
      expect(dataSource.getOriginalData().length).toBe(1);
      expect(dataSource.getOriginalData()[0].taskName).toBe(MOCK_PRETASK.taskName);
    });

    it('should set loading to false after response', async () => {
      await dataSource.loadAll();
      expect(dataSource['loadingSubject'].getValue()).toBeFalse();
    });

    it('should NOT add isMaskImport filter even when hideImportMasks is 1', async () => {
      uiServiceSpy.getUISettings.and.returnValue({ hideImportMasks: 1 } as unknown as UiSettings);
      await dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      const filter: Filter[] = (params as RequestParams).filter ?? [];
      expect(filter.some((f) => f.field === 'isMaskImport')).toBeFalse();
    });
  });

  // loadAll() — supertask mode, pretasks assigned, reverseQuery=true (NOTIN)

  describe('loadAll() — supertask mode (assigned pretasks, reverseQuery=true)', () => {
    beforeEach(() => {
      dataSource.setSuperTaskId(1);
      dataSource.setReverseQuery(true);
    });

    it('should filter pretasks by pretaskId NOTIN the assigned IDs', async () => {
      await dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).filter).toContain(
        jasmine.objectContaining({ field: 'pretaskId', operator: FilterType.NOTIN, value: [MOCK_PRETASK.id] })
      );
    });

    it('should add isMaskImport=false filter when hideImportMasks is 1', async () => {
      uiServiceSpy.getUISettings.and.returnValue({ hideImportMasks: 1 } as unknown as UiSettings);
      await dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).filter).toContain(
        jasmine.objectContaining({ field: 'isMaskImport', operator: FilterType.EQUAL, value: false })
      );
    });

    it('should NOT add isMaskImport filter when hideImportMasks is 0', async () => {
      uiServiceSpy.getUISettings.and.returnValue({ hideImportMasks: 0 } as unknown as UiSettings);
      await dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      const filter: Filter[] = (params as RequestParams).filter ?? [];
      expect(filter.some((f) => f.field === 'isMaskImport')).toBeFalse();
    });

    it('should NOT add isMaskImport filter when hideImportMasks is absent', async () => {
      uiServiceSpy.getUISettings.and.returnValue(null);
      await dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      const filter: Filter[] = (params as RequestParams).filter ?? [];
      expect(filter.some((f) => f.field === 'isMaskImport')).toBeFalse();
    });
  });

  // loadAll() — supertask mode, NO pretasks assigned, reverseQuery=false

  describe('loadAll() — supertask mode (no assigned pretasks, reverseQuery=false)', () => {
    beforeEach(() => {
      dataSource.setSuperTaskId(2);
      deserializeSpy.and.callFake((_body: unknown, schema?: unknown) => {
        if (schema === zSupertaskResponse) return MOCK_SUPERTASK_NO_PRETASKS;
        if (schema === zPreTaskListResponse) return [MOCK_PRETASK];
        return [];
      });
    });

    it('should produce an empty result set', async () => {
      await dataSource.loadAll();
      expect(dataSource.getOriginalData().length).toBe(0);
    });

    it('should reset totalItems to 0 and not call getAll', async () => {
      await dataSource.loadAll();
      expect(dataSource.totalItems).toBe(0);
      expect(gsSpy.getAll).not.toHaveBeenCalled();
    });

    it('should set loading to false', async () => {
      await dataSource.loadAll();
      expect(dataSource['loadingSubject'].getValue()).toBeFalse();
    });
  });

  // loadAll() — supertask mode, NO pretasks assigned, reverseQuery=true (NOTIN empty = all)

  describe('loadAll() — supertask mode (no assigned pretasks, reverseQuery=true)', () => {
    beforeEach(() => {
      dataSource.setSuperTaskId(2);
      dataSource.setReverseQuery(true);
      deserializeSpy.and.callFake((_body: unknown, schema?: unknown) => {
        if (schema === zSupertaskResponse) return MOCK_SUPERTASK_NO_PRETASKS;
        if (schema === zPreTaskListResponse) return [MOCK_PRETASK];
        return [];
      });
    });

    it('should load all pretasks (NOTIN empty set = all)', async () => {
      await dataSource.loadAll();
      expect(gsSpy.getAll).toHaveBeenCalled();
      const [serviceConfig] = gsSpy.getAll.calls.mostRecent().args;
      expect(serviceConfig).toEqual(SERV.PRETASKS);
    });

    it('should populate data with the full pretask list', async () => {
      await dataSource.loadAll();
      expect(dataSource.getOriginalData().length).toBe(1);
      expect(dataSource.getOriginalData()[0].taskName).toBe(MOCK_PRETASK.taskName);
    });

    it('should add isMaskImport=false filter when hideImportMasks is 1', async () => {
      uiServiceSpy.getUISettings.and.returnValue({ hideImportMasks: 1 } as unknown as UiSettings);
      await dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).filter).toContain(
        jasmine.objectContaining({ field: 'isMaskImport', operator: FilterType.EQUAL, value: false })
      );
    });
  });

  // loadAll() — supertask fetch fails (null returned)

  describe('loadAll() — supertask fetch error', () => {
    beforeEach(() => {
      dataSource.setSuperTaskId(1);
      gsSpy.get.and.returnValue(throwError(() => new Error('supertask error')));
    });

    it('should call handleFilterError when supertask fetch fails', async () => {
      const handleFilterErrorSpy = spyOn(dataSource as never, 'handleFilterError').and.callThrough();
      await dataSource.loadAll();
      expect(handleFilterErrorSpy).toHaveBeenCalled();
    });

    it('should produce an empty result and set loading to false', async () => {
      await dataSource.loadAll();
      expect(dataSource.getOriginalData().length).toBe(0);
      expect(dataSource['loadingSubject'].getValue()).toBeFalse();
    });
  });

  // reload()

  describe('reload()', () => {
    it('should clear selected rows', async () => {
      dataSource.selection.select(MOCK_PRETASK);
      dataSource.reload();
      // allow the async loadAll microtask to settle
      await Promise.resolve();
      expect(dataSource.selection.selected.length).toBe(0);
    });

    it('should call loadAll()', async () => {
      gsSpy.getAll.calls.reset();
      dataSource.reload();
      await Promise.resolve();
      expect(gsSpy.getAll).toHaveBeenCalled();
    });
  });

  // clearFilter()

  describe('clearFilter()', () => {
    it('should reset _currentFilter to null', async () => {
      const query: Filter = { field: 'taskName', operator: FilterType.ICONTAINS, value: 'dive' };
      await dataSource.loadAll(query);
      expect(dataSource['_currentFilter']).toEqual(query);

      dataSource.clearFilter();
      expect(dataSource['_currentFilter']).toBeNull();
    });

    it('should reset index to 0 and reload data', async () => {
      dataSource.index = 5;
      gsSpy.getAll.calls.reset();

      dataSource.clearFilter();
      await Promise.resolve();

      expect(dataSource.index).toBe(0);
      expect(gsSpy.getAll).toHaveBeenCalled();
    });

    it('should not apply the old filter after clearing', async () => {
      const query: Filter = { field: 'taskName', operator: FilterType.ICONTAINS, value: 'dive' };
      await dataSource.loadAll(query);

      gsSpy.getAll.calls.reset();
      dataSource.clearFilter();
      await Promise.resolve();

      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      const filter = (params as RequestParams).filter ?? [];
      expect(filter.some((f: Filter) => f.field === 'taskName')).toBeFalse();
    });
  });
});
