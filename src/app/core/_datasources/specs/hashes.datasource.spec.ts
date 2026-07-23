/// <reference types="jasmine" />
import { HashListFormat } from '@constants/hashlist.config';
import { zHashListResponse, zHashlistResponse } from '@generated/api/zod';
import { of, throwError } from 'rxjs';

import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { JHash } from '@models/hash.model';
import { JHashlist } from '@models/hashlist.model';
import { Filter, FilterType, RequestParams } from '@models/request-params.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { HashesDataSource } from '@src/app/core/_datasources/hashes.datasource';
import { mockResponse } from '@src/app/testing/mock-response';

// Mock data

const MOCK_MEMBER_A: JHashlist = {
  id: 11,
  type: 'hashlist',
  name: 'member_a',
  format: HashListFormat.TEXT
} as unknown as JHashlist;

const MOCK_MEMBER_B: JHashlist = {
  id: 22,
  type: 'hashlist',
  name: 'member_b',
  format: HashListFormat.TEXT
} as unknown as JHashlist;

const MOCK_PLAIN_HASHLIST: JHashlist = {
  id: 5,
  type: 'hashlist',
  name: 'plain_hashlist',
  format: HashListFormat.TEXT
} as unknown as JHashlist;

const MOCK_SUPER_HASHLIST: JHashlist = {
  id: 77,
  type: 'hashlist',
  name: 'super_hashlist',
  format: HashListFormat.SUPERHASHLIST,
  hashlists: [MOCK_MEMBER_A, MOCK_MEMBER_B]
} as unknown as JHashlist;

const MOCK_EMPTY_SUPER_HASHLIST: JHashlist = {
  ...MOCK_SUPER_HASHLIST,
  id: 88,
  name: 'empty_super_hashlist',
  hashlists: []
};

const MOCK_HASHES: JHash[] = [
  {
    id: 1,
    type: 'hash',
    hash: 'aabbcc',
    plaintext: 'secret',
    hashlistId: 11,
    salt: '',
    timeCracked: 0,
    isCracked: true,
    chunkId: null,
    crackPos: 0
  } as unknown as JHash
];

// Suite

describe('HashesDataSource', () => {
  let dataSource: HashesDataSource;
  let gsSpy: jasmine.SpyObj<GlobalService>;
  let deserializeSpy: jasmine.Spy;

  // The hashlist returned when a `hashlists` load resolves the record; reassign per test.
  let resolvedHashlist: JHashlist;

  beforeEach(() => {
    resolvedHashlist = MOCK_PLAIN_HASHLIST;

    gsSpy = jasmine.createSpyObj('GlobalService', ['get', 'getAll', 'ghelper']);

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

    gsSpy.get.and.returnValue(of(mockResponse()));
    gsSpy.getAll.and.returnValue(of(mockResponse()));
    gsSpy.ghelper.and.returnValue(of(mockResponse()));

    deserializeSpy = spyOn(JsonAPISerializer.prototype, 'deserialize').and.callFake((_body: unknown, schema?: unknown) => {
      if (schema === zHashlistResponse) return resolvedHashlist;
      if (schema === zHashListResponse) return MOCK_HASHES;
      return [];
    });

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
    dataSource = new HashesDataSource(injector);
  });

  afterEach(() => TestBed.resetTestingModule());

  // setters

  describe('setters', () => {
    it('should store id, dataType and filterParam', () => {
      dataSource.setId(42);
      dataSource.setDataType('hashlists');
      dataSource.setFilterParam('cracked');

      expect(dataSource['_id']).toBe(42);
      expect(dataSource['_dataType']).toBe('hashlists');
      expect(dataSource['_filterparam']).toBe('cracked');
    });
  });

  // loadAll() - plain hashlist

  describe('loadAll() - plain hashlist', () => {
    beforeEach(() => {
      resolvedHashlist = MOCK_PLAIN_HASHLIST;
      dataSource.setId(5);
      dataSource.setDataType('hashlists');
    });

    it('should first resolve the hashlist record via service.get including its members', () => {
      dataSource.loadAll();

      const [serviceConfig, entityId, params] = gsSpy.get.calls.mostRecent().args;
      expect(serviceConfig).toEqual(SERV.HASHLISTS);
      expect(entityId).toBe(5);
      expect((params as RequestParams).include).toContain('hashlists');
    });

    it('should fetch hashes filtered by hashlistId EQUAL the hashlist id', () => {
      dataSource.loadAll();

      const [serviceConfig, params] = gsSpy.getAll.calls.mostRecent().args;
      expect(serviceConfig).toEqual(SERV.HASHES);
      expect((params as RequestParams).filter).toContain(
        jasmine.objectContaining({ field: 'hashlistId', operator: FilterType.EQUAL, value: 5 })
      );
    });

    it('should populate hashes and totalItems from the hashes response', () => {
      gsSpy.getAll.and.returnValue(of(mockResponse({ meta: { page: { total_elements: 12 } } })));

      dataSource.loadAll();

      expect(dataSource.getOriginalData().length).toBe(1);
      expect(dataSource.getOriginalData()[0].hash).toBe('aabbcc');
      expect(dataSource.totalItems).toBe(12);
    });

    it('should append the query filter when provided', () => {
      const query: Filter = { field: 'hash', operator: FilterType.ICONTAINS, value: 'aa' };
      dataSource.loadAll(query);

      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).filter).toContain(jasmine.objectContaining({ field: 'hash', value: 'aa' }));
    });

    it('should add isCracked=true when filterParam is "cracked"', () => {
      dataSource.setFilterParam('cracked');
      dataSource.loadAll();

      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).filter).toContain(
        jasmine.objectContaining({ field: 'isCracked', operator: FilterType.EQUAL, value: true })
      );
    });

    it('should add isCracked=false when filterParam is "uncracked"', () => {
      dataSource.setFilterParam('uncracked');
      dataSource.loadAll();

      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).filter).toContain(
        jasmine.objectContaining({ field: 'isCracked', operator: FilterType.EQUAL, value: false })
      );
    });

    it('should not add an isCracked filter when filterParam is unset', () => {
      dataSource.loadAll();

      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      const filter = (params as RequestParams).filter ?? [];
      expect(filter.some((f: Filter) => f.field === 'isCracked')).toBeFalse();
    });

    it('should stop loading after a successful response', () => {
      dataSource.loadAll();
      expect(dataSource['loadingSubject'].getValue()).toBeFalse();
    });
  });

  // loadAll() - super hashlist (the bug fix)

  describe('loadAll() - super hashlist', () => {
    beforeEach(() => {
      resolvedHashlist = MOCK_SUPER_HASHLIST;
      dataSource.setId(77);
      dataSource.setDataType('hashlists');
    });

    it('should fetch hashes filtered by hashlistId IN the member ids', () => {
      dataSource.loadAll();

      const [serviceConfig, params] = gsSpy.getAll.calls.mostRecent().args;
      expect(serviceConfig).toEqual(SERV.HASHES);
      expect((params as RequestParams).filter).toContain(
        jasmine.objectContaining({
          field: 'hashlistId',
          operator: FilterType.IN,
          value: [MOCK_MEMBER_A.id, MOCK_MEMBER_B.id]
        })
      );
    });

    it('should NOT filter by the superhashlist id itself (regression for empty hashes)', () => {
      dataSource.loadAll();

      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      const filter = (params as RequestParams).filter ?? [];
      expect(filter).not.toContain(
        jasmine.objectContaining({ field: 'hashlistId', operator: FilterType.EQUAL, value: 77 })
      );
    });

    it('should populate hashes from the member hashes response', () => {
      dataSource.loadAll();
      expect(dataSource.getOriginalData().length).toBe(1);
      expect(dataSource.getOriginalData()[0].hash).toBe('aabbcc');
    });

    it('should still apply the isCracked filter alongside the IN filter', () => {
      dataSource.setFilterParam('cracked');
      dataSource.loadAll();

      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      const filter = (params as RequestParams).filter ?? [];
      expect(filter).toContain(jasmine.objectContaining({ field: 'hashlistId', operator: FilterType.IN }));
      expect(filter).toContain(jasmine.objectContaining({ field: 'isCracked', value: true }));
    });
  });

  // loadAll() - empty super hashlist

  describe('loadAll() - empty super hashlist', () => {
    beforeEach(() => {
      resolvedHashlist = MOCK_EMPTY_SUPER_HASHLIST;
      dataSource.setId(88);
      dataSource.setDataType('hashlists');
    });

    it('should not request any hashes when the superhashlist has no members', () => {
      dataSource.loadAll();
      expect(gsSpy.getAll).not.toHaveBeenCalled();
    });

    it('should render an empty, zeroed table', () => {
      dataSource.loadAll();
      expect(dataSource.getOriginalData().length).toBe(0);
      expect(dataSource.totalItems).toBe(0);
      expect(dataSource.pageAfter).toBeNull();
      expect(dataSource.pageBefore).toBeNull();
    });

    it('should stop loading', () => {
      dataSource.loadAll();
      expect(dataSource['loadingSubject'].getValue()).toBeFalse();
    });
  });

  // loadAll() - chunks

  describe('loadAll() - chunks', () => {
    beforeEach(() => {
      dataSource.setId(9);
      dataSource.setDataType('chunks');
    });

    it('should query hashes directly without resolving a hashlist record', () => {
      dataSource.loadAll();
      expect(gsSpy.get).not.toHaveBeenCalled();
      expect(gsSpy.getAll).toHaveBeenCalled();
    });

    it('should filter by chunkId EQUAL the id', () => {
      dataSource.loadAll();
      const [serviceConfig, params] = gsSpy.getAll.calls.mostRecent().args;
      expect(serviceConfig).toEqual(SERV.HASHES);
      expect((params as RequestParams).filter).toContain(
        jasmine.objectContaining({ field: 'chunkId', operator: FilterType.EQUAL, value: 9 })
      );
    });
  });

  // loadAll() - tasks

  describe('loadAll() - tasks', () => {
    beforeEach(() => {
      dataSource.setId(3);
      dataSource.setDataType('tasks');
    });

    it('should load cracks via the getCracksOfTask helper', () => {
      dataSource.loadAll();

      expect(gsSpy.get).not.toHaveBeenCalled();
      expect(gsSpy.getAll).not.toHaveBeenCalled();
      const [serviceConfig, helper, payload] = gsSpy.ghelper.calls.mostRecent().args;
      expect(serviceConfig).toEqual(SERV.HELPER);
      expect(helper).toBe('getCracksOfTask');
      expect(payload).toEqual({ task: 3 });
    });

    it('should populate the hashes from the helper response', () => {
      dataSource.loadAll();
      expect(dataSource.getOriginalData().length).toBe(1);
    });
  });

  // error handling

  describe('error handling', () => {
    beforeEach(() => {
      dataSource.setId(5);
      dataSource.setDataType('hashlists');
    });

    it('should stop loading and leave data untouched when the hashlist lookup fails', () => {
      gsSpy.get.and.returnValue(throwError(() => new Error('backend error')));

      dataSource.loadAll();

      expect(dataSource.getOriginalData().length).toBe(0);
      expect(dataSource['loadingSubject'].getValue()).toBeFalse();
    });

    it('should stop loading when the hashes request fails', () => {
      gsSpy.getAll.and.returnValue(throwError(() => new Error('backend error')));

      dataSource.loadAll();

      expect(dataSource['loadingSubject'].getValue()).toBeFalse();
    });
  });

  // reload()

  describe('reload()', () => {
    it('should clear the current selection', () => {
      dataSource.setId(5);
      dataSource.setDataType('hashlists');
      dataSource.selection.select(MOCK_HASHES[0]);

      dataSource.reload();

      expect(dataSource.selection.selected.length).toBe(0);
    });

    it('should trigger a fresh load', () => {
      dataSource.setId(9);
      dataSource.setDataType('chunks');
      gsSpy.getAll.calls.reset();

      dataSource.reload();

      expect(gsSpy.getAll).toHaveBeenCalled();
    });
  });
});
