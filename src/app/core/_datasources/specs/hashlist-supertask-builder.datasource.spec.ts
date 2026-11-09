import { zSupertaskListResponse } from '@generated/api/zod';
import { of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { ChangeDetectorRef, Injector } from '@angular/core';

import { RequestParams } from '@models/request-params.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { PermissionService } from '@services/permission/permission.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { HashlistSupertaskBuilderDataSource } from '@src/app/core/_datasources/hashlist-supertask-builder.datasource';
import { mockResponse } from '@src/app/testing/mock-response';

describe('HashlistSupertaskBuilderDataSource', () => {
  let injector: MockedObject<Injector>;
  let getAll: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getAll = vi.fn().mockReturnValue(
      of(
        mockResponse({
          meta: { page: { total_elements: 27 } },
          links: {
            self: '/supertasks',
            next: 'https://api/supertasks?page%5Bafter%5D=after-cursor',
            prev: 'https://api/supertasks?page%5Bbefore%5D=before-cursor'
          }
        })
      )
    );
    const dependencies = new Map<unknown, unknown>([
      [ChangeDetectorRef, { markForCheck: vi.fn(), detectChanges: vi.fn() }],
      [GlobalService, { getAll }],
      [UIConfigService, { getUISettings: vi.fn().mockReturnValue(null) }],
      [PermissionService, {}],
      [
        JsonAPISerializer,
        {
          deserialize: vi.fn((_response: unknown, schema?: unknown) =>
            schema === zSupertaskListResponse ? [{ id: 2, type: 'supertask', supertaskName: 'builder' }] : []
          )
        }
      ],
      [AutoRefreshService, {}],
      [HttpCacheService, {}],
      [LocalStorageService, { getItem: vi.fn().mockReturnValue(null), setItem: vi.fn() }]
    ]);
    injector = { get: vi.fn((token: unknown) => dependencies.get(token)) } as unknown as MockedObject<Injector>;
  });

  it('requests supertasks and populates the table data and pagination', () => {
    const source = new HashlistSupertaskBuilderDataSource(injector);

    source.loadAll();

    const [endpoint, params] = getAll.mock.lastCall!;
    expect(endpoint).toEqual(SERV.SUPER_TASKS);
    expect((params as RequestParams).include).toBeUndefined();
    expect(source.getOriginalData()).toEqual([{ id: 2, type: 'supertask', supertaskName: 'builder' }]);
    expect(source.totalItems).toBe(27);
    expect(source.pageAfter).toBe('after-cursor');
    expect(source.pageBefore).toBe('before-cursor');
  });
});
