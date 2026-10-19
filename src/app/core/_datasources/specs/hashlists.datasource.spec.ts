import { HashListFormat } from '@constants/hashlist.config';
import { zHashlistListResponse, zHashlistResponse } from '@generated/api/zod';
import { of, throwError } from 'rxjs';
import type { Mock, MockedObject } from 'vitest';

import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { JHashlist } from '@models/hashlist.model';
import { Filter, FilterType, RequestParams } from '@models/request-params.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { HashlistsDataSource } from '@src/app/core/_datasources/hashlists.datasource';
import { mockResponse } from '@src/app/testing/mock-response';

// Mock data

const MOCK_HASHLIST: JHashlist = {
  id: 4,
  type: 'hashlist',
  name: 'hashlist_sha1_1',
  format: HashListFormat.TEXT,
  hashTypeId: 100,
  hashType: { id: 100, description: 'SHA1' } as unknown as JHashlist['hashType'],
  hashCount: 10346,
  cracked: 10346,
  separator: ':',
  isSecret: false,
  isHexSalt: false,
  isSalted: false,
  accessGroupId: 1,
  notes: '',
  useBrain: false,
  brainFeatures: 3,
  isArchived: false
} as unknown as JHashlist;

const MOCK_HASHLIST_WITHOUT_HASHTYPE: JHashlist = {
  ...MOCK_HASHLIST,
  id: 5,
  hashType: null,
  hashTypeDescription: undefined,
  hashTypeId: 0
};

const MOCK_SUPER_HASHLIST: JHashlist = {
  id: 77,
  type: 'hashlist',
  name: 'superhashlist',
  hashTypeId: 100,
  hashType: { id: 100, description: 'SHA1' } as unknown as JHashlist['hashType'],
  hashCount: 2,
  cracked: 1,
  isSecret: false,
  isHexSalt: false,
  isSalted: false,
  accessGroupId: 1,
  notes: '',
  useBrain: false,
  brainFeatures: 3,
  isArchived: false,
  hashlists: [MOCK_HASHLIST]
} as unknown as JHashlist;

// Suite

describe('HashlistsDataSource', () => {
  let dataSource: HashlistsDataSource;
  let gsSpy: MockedObject<GlobalService>;
  let deserializeSpy: Mock;

  beforeEach(() => {
    gsSpy = {
      get: vi.fn().mockName('GlobalService.get'),
      getAll: vi.fn().mockName('GlobalService.getAll')
    } as MockedObject<GlobalService>;

    const cdrSpy = {
      markForCheck: vi.fn().mockName('ChangeDetectorRef.markForCheck'),
      detectChanges: vi.fn().mockName('ChangeDetectorRef.detectChanges')
    };
    const uiServiceSpy = {
      getUISettings: vi.fn().mockName('UIConfigService.getUISettings')
    };
    uiServiceSpy.getUISettings.mockReturnValue({});
    const autoRefreshSpy = {
      toggleAutoRefresh: vi.fn().mockName('AutoRefreshService.toggleAutoRefresh'),
      startAutoRefresh: vi.fn().mockName('AutoRefreshService.startAutoRefresh'),
      stopAutoRefresh: vi.fn().mockName('AutoRefreshService.stopAutoRefresh'),
      refresh$: of()
    };
    const cacheSpy = {
      invalidate: vi.fn().mockName('HttpCacheService.invalidate')
    };
    const storageSpy = {
      getItem: vi.fn().mockName('LocalStorageService.getItem'),
      setItem: vi.fn().mockName('LocalStorageService.setItem')
    };
    storageSpy.getItem.mockReturnValue(null);

    gsSpy.getAll.mockReturnValue(of(mockResponse()));
    gsSpy.get.mockReturnValue(of(mockResponse()));

    deserializeSpy = vi
      .spyOn(JsonAPISerializer.prototype, 'deserialize')
      .mockImplementation((_body: unknown, schema?: unknown) => {
        if (schema === zHashlistResponse) return MOCK_SUPER_HASHLIST;
        if (schema === zHashlistListResponse) return [MOCK_HASHLIST];
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
    dataSource = new HashlistsDataSource(injector);
  });

  // setIsArchived()

  describe('setIsArchived()', () => {
    it('should store the provided archived value', () => {
      dataSource.setIsArchived(true);
      expect(dataSource['isArchived']).toBe(true);

      dataSource.setIsArchived(false);
      expect(dataSource['isArchived']).toBe(false);
    });

    it('should reset pageAfter, pageBefore and index', () => {
      dataSource.pageAfter = 'aaa';
      dataSource.pageBefore = 'bbb';
      dataSource.index = 10;

      dataSource.setIsArchived(true);

      expect(dataSource.pageAfter).toBeNull();
      expect(dataSource.pageBefore).toBeNull();
      expect(dataSource.index).toBe(0);
    });

    it('should clear filter and selection as part of reset(true)', () => {
      dataSource.filter = 'sha1';
      dataSource.selection.select(MOCK_HASHLIST);

      dataSource.setIsArchived(true);

      expect(dataSource.filter).toBe('');
      expect(dataSource.selection.selected.length).toBe(0);
    });
  });

  // setSuperHashListID()

  describe('setSuperHashListID()', () => {
    it('should store the provided super hashlist ID', () => {
      dataSource.setSuperHashListID(123);
      expect(dataSource['superHashListID']).toBe(123);
    });
  });

  // loadAll() - normal mode (no superHashListID)

  describe('loadAll() - normal mode', () => {
    it('should call service.getAll with SERV.HASHLISTS', () => {
      dataSource.loadAll();
      const [serviceConfig] = vi.mocked(gsSpy.getAll).mock.lastCall!;
      expect(serviceConfig).toEqual(SERV.HASHLISTS);
    });

    it('should include hashType and accessGroup', () => {
      dataSource.loadAll();
      const [, params] = vi.mocked(gsSpy.getAll).mock.lastCall!;
      const include = (params as RequestParams).include ?? [];
      expect(include).toContain('hashType');
      expect(include).toContain('accessGroup');
    });

    it('should always include isArchived and format filters', () => {
      dataSource.loadAll();
      const [, params] = vi.mocked(gsSpy.getAll).mock.lastCall!;
      const filter = (params as RequestParams).filter ?? [];

      expect(filter).toContain(expect.objectContaining({ field: 'isArchived', value: false }));
      expect(filter).toContain(
        expect.objectContaining({
          field: 'format',
          operator: FilterType.NOTIN,
          value: [HashListFormat.SUPERHASHLIST]
        })
      );
    });

    it('should pass isArchived=true after setIsArchived(true)', () => {
      dataSource.setIsArchived(true);
      dataSource.loadAll();
      const [, params] = vi.mocked(gsSpy.getAll).mock.lastCall!;
      expect((params as RequestParams).filter).toContain(expect.objectContaining({ field: 'isArchived', value: true }));
    });

    it('should append the query filter when provided', () => {
      const query: Filter = { field: 'name', operator: FilterType.ICONTAINS, value: 'sha1' };
      dataSource.loadAll(query);
      const [, params] = vi.mocked(gsSpy.getAll).mock.lastCall!;
      expect((params as RequestParams).filter).toContain(expect.objectContaining({ field: 'name', value: 'sha1' }));
    });

    it('should map hashTypeDescription and hashTypeId from hashType relation', () => {
      dataSource.loadAll();
      const item = dataSource.getOriginalData()[0];
      expect(item.hashTypeDescription).toBe('SHA1');
      expect(item.hashTypeId).toBe(100);
    });

    it('should set hashTypeDescription to empty string when hashType is missing', () => {
      deserializeSpy.mockImplementation((_body: unknown, schema?: unknown) => {
        if (schema === zHashlistListResponse) return [MOCK_HASHLIST_WITHOUT_HASHTYPE];
        return MOCK_SUPER_HASHLIST;
      });

      dataSource.loadAll();

      const item = dataSource.getOriginalData()[0];
      expect(item.hashTypeDescription).toBe('');
    });

    it('should set totalItems from meta.page.total_elements', () => {
      gsSpy.getAll.mockReturnValue(of(mockResponse({ meta: { page: { total_elements: 264 } } })));
      dataSource.loadAll();
      expect(dataSource.totalItems).toBe(264);
    });

    it('should extract page[after] cursor from links.next', () => {
      gsSpy.getAll.mockReturnValue(
        of(
          mockResponse({
            meta: { page: { total_elements: 264 } },
            links: {
              self: '/test',
              next: 'https://api/hashlists?page%5Bafter%5D=eyJwcmltYXJ5Ijp7Imhhc2hsaXN0SWQiOjI4fX0%3D'
            }
          })
        )
      );

      dataSource.loadAll();
      expect(dataSource.pageAfter).toBe('eyJwcmltYXJ5Ijp7Imhhc2hsaXN0SWQiOjI4fX0=');
    });

    it('should set pageBefore to null when links.prev is null', () => {
      gsSpy.getAll.mockReturnValue(
        of(
          mockResponse({
            meta: { page: { total_elements: 264 } },
            links: { self: '/test', prev: null }
          })
        )
      );

      dataSource.loadAll();
      expect(dataSource.pageBefore).toBeNull();
    });

    it('should stop loading when request succeeds', () => {
      dataSource.loadAll();
      expect(dataSource['loadingSubject'].getValue()).toBe(false);
    });

    it('should call handleFilterError and stop loading when request fails', () => {
      gsSpy.getAll.mockReturnValue(throwError(() => new Error('backend error')));
      const handleFilterErrorSpy = vi.spyOn(dataSource as never, 'handleFilterError');

      dataSource.loadAll();

      expect(handleFilterErrorSpy).toHaveBeenCalled();
      expect(dataSource['loadingSubject'].getValue()).toBe(false);
    });

    it('should keep data untouched when deserialize returns null', () => {
      deserializeSpy.mockImplementation((_body: unknown, schema?: unknown) => {
        if (schema === zHashlistListResponse) return null;
        return MOCK_SUPER_HASHLIST;
      });

      dataSource.loadAll();
      expect(dataSource.getOriginalData().length).toBe(0);
    });
  });

  // loadAll() - super hashlist mode

  describe('loadAll() - super hashlist mode', () => {
    beforeEach(() => {
      dataSource.setSuperHashListID(77);
    });

    it('should call service.get with SERV.HASHLISTS and superHashListID', () => {
      dataSource.loadAll();
      expect(gsSpy.get).toHaveBeenCalled();
      expect(gsSpy.getAll).not.toHaveBeenCalled();

      const [serviceConfig, entityId] = vi.mocked(gsSpy.get).mock.lastCall!;
      expect(serviceConfig).toEqual(SERV.HASHLISTS);
      expect(entityId).toBe(77);
    });

    it('should include hashlists and hashType in params', () => {
      dataSource.loadAll();
      const [, , params] = vi.mocked(gsSpy.get).mock.lastCall!;
      const include = (params as RequestParams).include ?? [];
      expect(include).toContain('hashlists');
      expect(include).toContain('hashType');
    });

    it('should populate data from superHashList.hashlists', () => {
      dataSource.loadAll();
      expect(dataSource.getOriginalData().length).toBe(1);
      expect(dataSource.getOriginalData()[0].name).toBe(MOCK_HASHLIST.name);
    });

    it('should set totalItems to hashlists.length in superhashlist mode', () => {
      dataSource.loadAll();
      expect(dataSource.totalItems).toBe(1);
      expect(dataSource.pageAfter).toBeNull();
      expect(dataSource.pageBefore).toBeNull();
      expect(dataSource.index).toBe(0);
    });

    it('should use empty list when superHashList.hashlists is undefined', () => {
      deserializeSpy.mockImplementation((_body: unknown, schema?: unknown) => {
        if (schema === zHashlistResponse) {
          return { ...MOCK_SUPER_HASHLIST, hashlists: undefined };
        }
        return [MOCK_HASHLIST];
      });

      dataSource.loadAll();
      expect(dataSource.getOriginalData().length).toBe(0);
      expect(dataSource.totalItems).toBe(0);
    });

    it('should call handleFilterError and stop loading when request fails', () => {
      gsSpy.get.mockReturnValue(throwError(() => new Error('backend error')));
      const handleFilterErrorSpy = vi.spyOn(dataSource as never, 'handleFilterError');

      dataSource.loadAll();

      expect(handleFilterErrorSpy).toHaveBeenCalled();
      expect(dataSource['loadingSubject'].getValue()).toBe(false);
    });
  });

  // reload()

  describe('reload()', () => {
    it('should clear selected rows', () => {
      dataSource.selection.select(MOCK_HASHLIST);
      dataSource.reload();
      expect(dataSource.selection.selected.length).toBe(0);
    });

    it('should call loadAll()', () => {
      gsSpy.getAll.mockClear();
      dataSource.reload();
      expect(gsSpy.getAll).toHaveBeenCalled();
    });
  });

  // clearFilter()

  describe('clearFilter()', () => {
    it('should reset index to 0 and reload data', () => {
      dataSource.index = 5;
      gsSpy.getAll.mockClear();

      dataSource.clearFilter();

      expect(dataSource.index).toBe(0);
      expect(gsSpy.getAll).toHaveBeenCalled();
    });
  });
});
