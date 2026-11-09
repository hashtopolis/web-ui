import { of } from 'rxjs';

import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Filter, FilterType, RequestParams } from '@models/request-params.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { CrackersDataSource } from '@datasources/crackers.datasource';

import { mockResponse } from '@src/app/testing/mock-response';

describe('CrackersDataSource', () => {
  let dataSource: CrackersDataSource;
  let service: { getAll: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    service = { getAll: vi.fn().mockReturnValue(of(mockResponse())) };
    vi.spyOn(JsonAPISerializer.prototype, 'deserialize').mockImplementation(() => []);
    TestBed.configureTestingModule({
      providers: [
        { provide: GlobalService, useValue: service },
        { provide: ChangeDetectorRef, useValue: { markForCheck: vi.fn(), detectChanges: vi.fn() } },
        { provide: UIConfigService, useValue: { getUISettings: vi.fn().mockReturnValue({}) } },
        {
          provide: AutoRefreshService,
          useValue: { refresh$: of(), toggleAutoRefresh: vi.fn(), startAutoRefresh: vi.fn(), stopAutoRefresh: vi.fn() }
        },
        { provide: HttpCacheService, useValue: { invalidate: vi.fn() } },
        { provide: LocalStorageService, useValue: { getItem: vi.fn().mockReturnValue(null), setItem: vi.fn() } }
      ]
    });
    dataSource = new CrackersDataSource(TestBed.inject(Injector));
  });

  it('requests cracker versions and applies a supplied filter', () => {
    const query: Filter = { field: 'name', operator: FilterType.ICONTAINS, value: 'hashcat' };
    dataSource.loadAll(query);
    const [resource, params] = service.getAll.mock.lastCall!;
    expect(resource).toBe(SERV.CRACKERS_TYPES);
    expect((params as RequestParams).include).toContain('crackerVersions');
    expect((params as RequestParams).filter).toContainEqual(
      expect.objectContaining({ field: 'name', value: 'hashcat' })
    );
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('reuses the active filter until clearFilter reloads without it', () => {
    const query: Filter = { field: 'name', operator: FilterType.ICONTAINS, value: 'hashcat' };
    dataSource.loadAll(query);
    dataSource.loadAll();
    expect((service.getAll.mock.lastCall![1] as RequestParams).filter).toContainEqual(
      expect.objectContaining({ field: 'name', value: 'hashcat' })
    );
    service.getAll.mockClear();
    dataSource.clearFilter();
    expect((service.getAll.mock.lastCall![1] as RequestParams).filter ?? []).not.toContainEqual(
      expect.objectContaining({ field: 'name' })
    );
  });
});
