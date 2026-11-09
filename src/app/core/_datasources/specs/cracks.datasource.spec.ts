import { zHashListResponse, zTaskResponse } from '@generated/api/zod';
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

import { CracksDataSource } from '@datasources/cracks.datasource';

import { mockResponse } from '@src/app/testing/mock-response';

describe('CracksDataSource', () => {
  let dataSource: CracksDataSource;
  let service: { getAll: ReturnType<typeof vi.fn>; get: ReturnType<typeof vi.fn> };
  const hash = { id: 3, type: 'hash', hash: 'abc', isCracked: true };

  beforeEach(() => {
    service = { getAll: vi.fn().mockReturnValue(of(mockResponse())), get: vi.fn().mockReturnValue(of(mockResponse())) };
    vi.spyOn(JsonAPISerializer.prototype, 'deserialize').mockImplementation((_response, schema) => {
      if (schema === zHashListResponse) return [hash];
      if (schema === zTaskResponse) return { id: 8, type: 'task', taskName: 'Task' };
      return [];
    });
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
    dataSource = new CracksDataSource(TestBed.inject(Injector));
  });

  it('loads cracked hashes with chunk and hashlist relationships and updates pagination', async () => {
    service.getAll.mockReturnValue(
      of(
        mockResponse({
          meta: { page: { total_elements: 8 } },
          links: { self: '/hashes', next: 'https://api.test/hashes?page%5Bafter%5D=next' }
        })
      )
    );
    await dataSource.loadAll();
    const [resource, params] = service.getAll.mock.lastCall!;
    expect(resource).toBe(SERV.HASHES);
    expect((params as RequestParams).include).toEqual(expect.arrayContaining(['chunk', 'hashlist']));
    expect((params as RequestParams).filter).toContainEqual(
      expect.objectContaining({ field: 'isCracked', operator: FilterType.EQUAL, value: true })
    );
    expect(dataSource.getOriginalData()).toEqual([hash]);
    expect(dataSource.totalItems).toBe(8);
    expect(dataSource.pageAfter).toBe('next');
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('loads a task by id and returns the deserialized task', async () => {
    await expect(dataSource.loadTask(8)).resolves.toMatchObject({ taskName: 'Task' });
    expect(service.get).toHaveBeenCalledWith(SERV.TASKS, 8);
  });

  it('applies and retains the query filter', async () => {
    const query: Filter = { field: 'hash', operator: FilterType.ICONTAINS, value: 'abc' };
    await dataSource.loadAll(query);
    await dataSource.loadAll();
    expect((service.getAll.mock.lastCall![1] as RequestParams).filter).toContainEqual(
      expect.objectContaining({ field: 'hash', value: 'abc' })
    );
  });
});
