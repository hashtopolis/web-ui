import { zHashTypeListResponse } from '@generated/api/zod';
import { of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { ChangeDetectorRef, Injector } from '@angular/core';

import { FilterType, RequestParams } from '@models/request-params.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { PermissionService } from '@services/permission/permission.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { HashtypesDataSource } from '@src/app/core/_datasources/hashtypes.datasource';
import { mockResponse } from '@src/app/testing/mock-response';

describe('HashtypesDataSource', () => {
  let injector: MockedObject<Injector>;
  let getAll: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getAll = vi.fn().mockReturnValue(of(mockResponse({ meta: { page: { total_elements: 27 } } })));
    const dependencies = new Map<unknown, unknown>([
      [ChangeDetectorRef, { markForCheck: vi.fn(), detectChanges: vi.fn() }],
      [GlobalService, { getAll }],
      [UIConfigService, { getUISettings: vi.fn().mockReturnValue(null) }],
      [PermissionService, {}],
      [
        JsonAPISerializer,
        {
          deserialize: vi.fn((_response: unknown, schema?: unknown) =>
            schema === zHashTypeListResponse ? [{ id: 3, type: 'hashtype', description: 'SHA256' }] : []
          )
        }
      ],
      [AutoRefreshService, {}],
      [HttpCacheService, {}],
      [LocalStorageService, { getItem: vi.fn().mockReturnValue(null), setItem: vi.fn() }]
    ]);
    injector = { get: vi.fn((token: unknown) => dependencies.get(token)) } as unknown as MockedObject<Injector>;
  });

  it('loads, retains, and clears the active filter', () => {
    const source = new HashtypesDataSource(injector);
    const filter = { field: 'description', operator: FilterType.ICONTAINS, value: 'sha' };

    source.loadAll(filter);
    expect(getAll.mock.lastCall![0]).toEqual(SERV.HASHTYPES);
    expect((getAll.mock.lastCall![1] as RequestParams).filter).toContainEqual(filter);
    expect(source.getOriginalData()).toEqual([{ id: 3, type: 'hashtype', description: 'SHA256' }]);

    getAll.mockClear();
    source.reload();
    expect((getAll.mock.lastCall![1] as RequestParams).filter).toContainEqual(filter);

    getAll.mockClear();
    source.clearFilter();
    expect((getAll.mock.lastCall![1] as RequestParams).filter ?? []).not.toContainEqual(filter);
  });
});
