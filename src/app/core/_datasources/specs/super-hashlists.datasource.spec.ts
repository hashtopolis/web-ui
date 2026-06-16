/// <reference types="jasmine" />
import { HashListFormat } from '@constants/hashlist.config';
import { zHashlistListResponse } from '@generated/api/zod';
import { EMPTY, of, throwError } from 'rxjs';

import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { JHashlist } from '@models/hashlist.model';
import { JHashtype } from '@models/hashtype.model';
import { Filter, FilterType, RequestParams } from '@models/request-params.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { SuperHashlistsDataSource } from '@src/app/core/_datasources/super-hashlists.datasource';
import { mockResponse } from '@src/app/testing/mock-response';

// Mock data

const MOCK_HASHTYPE: JHashtype = {
  id: 100,
  type: 'hashType',
  description: 'SHA1',
  isSalted: false,
  isSlowHash: false
} as unknown as JHashtype;

const MOCK_CHILD_HASHLIST: JHashlist = {
  id: 56,
  type: 'hashlist',
  name: 'hashlist_sha1_131',
  format: HashListFormat.TEXT,
  hashTypeId: 100,
  hashCount: 6,
  cracked: 5,
  isSecret: false,
  isHexSalt: false,
  isSalted: false,
  accessGroupId: 1,
  notes: '',
  useBrain: false,
  brainFeatures: 3,
  isArchived: false
} as unknown as JHashlist;

const MOCK_SUPERHASHLIST: JHashlist = {
  id: 268,
  type: 'hashlist',
  name: 'sha1 super',
  format: HashListFormat.SUPERHASHLIST,
  hashTypeId: 100,
  hashType: MOCK_HASHTYPE,
  hashCount: 17,
  cracked: 15,
  isSecret: false,
  isHexSalt: false,
  isSalted: false,
  accessGroupId: 1,
  notes: '',
  useBrain: false,
  brainFeatures: 0,
  isArchived: false,
  hashlists: [MOCK_CHILD_HASHLIST]
} as unknown as JHashlist;

// A super hashlist whose hashType is null (no hashType relationship data)
const MOCK_SUPERHASHLIST_NO_HASHTYPE: JHashlist = {
  id: 269,
  type: 'hashlist',
  name: 'Super_MD5_hashlist',
  format: HashListFormat.SUPERHASHLIST,
  hashTypeId: 0,
  hashType: null,
  hashCount: 20,
  cracked: 20,
  isSecret: false,
  isHexSalt: false,
  isSalted: false,
  accessGroupId: 1,
  notes: '',
  useBrain: false,
  brainFeatures: 0,
  isArchived: false,
  hashlists: []
} as unknown as JHashlist;

// Suite

describe('SuperHashlistsDataSource', () => {
  let dataSource: SuperHashlistsDataSource;
  let gsSpy: jasmine.SpyObj<GlobalService>;
  let _deserializeSpy: jasmine.Spy;

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

    _deserializeSpy = spyOn(JsonAPISerializer.prototype, 'deserialize').and.callFake(
      (_body: unknown, _schema?: unknown) => [MOCK_SUPERHASHLIST]
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
    dataSource = new SuperHashlistsDataSource(injector);
  });

  afterEach(() => TestBed.resetTestingModule());

  // loadAll()

  describe('loadAll()', () => {
    it('should call service.getAll with SERV.HASHLISTS', () => {
      dataSource.loadAll();
      const [serviceConfig] = gsSpy.getAll.calls.mostRecent().args;
      expect(serviceConfig).toEqual(SERV.HASHLISTS);
    });

    it('should include hashType and hashlists in request params', () => {
      dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).include).toContain('hashType');
      expect((params as RequestParams).include).toContain('hashlists');
    });

    it('should filter by format === SUPERHASHLIST (3)', () => {
      dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).filter).toContain(
        jasmine.objectContaining({ field: 'format', operator: FilterType.EQUAL, value: HashListFormat.SUPERHASHLIST })
      );
    });

    it('should deserialize the response with zHashlistListResponse', () => {
      dataSource.loadAll();
      expect(_deserializeSpy).toHaveBeenCalledWith(jasmine.anything(), zHashlistListResponse);
    });

    it('should populate data with the deserialized super hashlists', () => {
      dataSource.loadAll();
      expect(dataSource.getOriginalData().length).toBe(1);
      expect(dataSource.getOriginalData()[0].name).toBe(MOCK_SUPERHASHLIST.name);
    });

    it('should map hashTypeDescription from the included hashType', () => {
      dataSource.loadAll();
      expect(dataSource.getOriginalData()[0].hashTypeDescription).toBe(MOCK_HASHTYPE.description);
    });

    it('should set hashTypeDescription to undefined when hashType is null', () => {
      _deserializeSpy.and.returnValue([MOCK_SUPERHASHLIST_NO_HASHTYPE]);
      dataSource.loadAll();
      expect(dataSource.getOriginalData()[0].hashTypeDescription).toBeUndefined();
    });

    it('should preserve nested hashlists on each row', () => {
      dataSource.loadAll();
      const row = dataSource.getOriginalData()[0];
      expect(row.hashlists).toBeDefined();
      expect(row.hashlists!.length).toBe(1);
      expect(row.hashlists![0].name).toBe(MOCK_CHILD_HASHLIST.name);
    });

    it('should set totalItems from meta.page.total_elements', () => {
      gsSpy.getAll.and.returnValue(of(mockResponse({ meta: { page: { total_elements: 2 } } })));
      dataSource.loadAll();
      expect(dataSource.totalItems).toBe(2);
    });

    it('should extract the page[after] cursor from links.next', () => {
      gsSpy.getAll.and.returnValue(
        of(
          mockResponse({
            meta: { page: { total_elements: 10 } },
            links: {
              self: '/test',
              next: 'https://api/hashlists?page%5Bafter%5D=eyJwcmltYXJ5Ijp7Imhhc2hsaXN0SWQiOjI3MH19'
            }
          })
        )
      );
      dataSource.loadAll();
      expect(dataSource.pageAfter).toBe('eyJwcmltYXJ5Ijp7Imhhc2hsaXN0SWQiOjI3MH19');
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
      const query: Filter = { field: 'name', operator: FilterType.ICONTAINS, value: 'sha1' };
      dataSource.loadAll(query);
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).filter).toContain(jasmine.objectContaining({ field: 'name', value: 'sha1' }));
    });

    it('should persist the query as _currentFilter', () => {
      const query: Filter = { field: 'name', operator: FilterType.ICONTAINS, value: 'md5' };
      dataSource.loadAll(query);
      expect(dataSource['_currentFilter']).toEqual(query);
    });

    it('should reuse _currentFilter on a subsequent call without query', () => {
      const query: Filter = { field: 'name', operator: FilterType.ICONTAINS, value: 'sha1' };
      dataSource.loadAll(query);
      gsSpy.getAll.calls.reset();
      dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).filter).toContain(jasmine.objectContaining({ field: 'name', value: 'sha1' }));
    });

    it('should set loading to false after a successful response', () => {
      dataSource.loadAll();
      expect(dataSource['loadingSubject'].getValue()).toBeFalse();
    });

    it('should call handleFilterError and return empty data when request fails', () => {
      gsSpy.getAll.and.returnValue(throwError(() => new Error('backend error')));
      const handleFilterErrorSpy = spyOn(dataSource as never, 'handleFilterError').and.callThrough();

      dataSource.loadAll();

      expect(handleFilterErrorSpy).toHaveBeenCalled();
      expect(dataSource.getOriginalData().length).toBe(0);
    });

    it('should set loading to false even when request fails', () => {
      gsSpy.getAll.and.returnValue(throwError(() => new Error('backend error')));
      dataSource.loadAll();
      expect(dataSource['loadingSubject'].getValue()).toBeFalse();
    });
  });

  // setIsArchived()

  describe('setIsArchived()', () => {
    it('should store the isArchived value', () => {
      dataSource.setIsArchived(true);
      expect(dataSource['isArchived']).toBeTrue();

      dataSource.setIsArchived(false);
      expect(dataSource['isArchived']).toBeFalse();
    });
  });

  // reload()

  describe('reload()', () => {
    it('should clear selected rows', () => {
      dataSource.selection.select(MOCK_SUPERHASHLIST);
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
      const query: Filter = { field: 'name', operator: FilterType.ICONTAINS, value: 'sha1' };
      dataSource.loadAll(query);
      expect(dataSource['_currentFilter']).toEqual(query);

      dataSource.clearFilter();
      expect(dataSource['_currentFilter']).toBeNull();
    });

    it('should reset index to 0 and reload data', () => {
      dataSource.index = 5;
      gsSpy.getAll.calls.reset();

      dataSource.clearFilter();

      expect(dataSource.index).toBe(0);
      expect(gsSpy.getAll).toHaveBeenCalled();
    });

    it('should not apply the old filter after clearing', () => {
      const query: Filter = { field: 'name', operator: FilterType.ICONTAINS, value: 'sha1' };
      dataSource.loadAll(query);

      gsSpy.getAll.calls.reset();
      dataSource.clearFilter();

      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      const filter = (params as RequestParams).filter ?? [];
      expect(filter.some((f: Filter) => f.field === 'name')).toBeFalse();
    });
  });
});
