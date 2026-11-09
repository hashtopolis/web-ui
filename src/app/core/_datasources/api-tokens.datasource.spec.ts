import { zApiTokenListResponse } from '@generated/api/zod';
import { of } from 'rxjs';

import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { JApiToken } from '@models/api-token.model';
import { RequestParams } from '@models/request-params.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { ApiTokensDataSource } from '@datasources/api-tokens.datasource';

import { mockResponse } from '@src/app/testing/mock-response';

describe('ApiTokensDataSource', () => {
  let dataSource: ApiTokensDataSource;
  const tokens: JApiToken[] = [
    { id: 1, type: 'apiToken', startValid: 1, endValid: 9999999999, isRevoked: false, userId: 2 },
    { id: 2, type: 'apiToken', startValid: 1, endValid: 1, isRevoked: false, userId: 2 },
    { id: 3, type: 'apiToken', startValid: 1, endValid: 9999999999, isRevoked: true, userId: 2 }
  ] as JApiToken[];

  beforeEach(() => {
    const service = { getAll: vi.fn().mockReturnValue(of(mockResponse())) };
    vi.spyOn(JsonAPISerializer.prototype, 'deserialize').mockImplementation((_response, schema) =>
      schema === zApiTokenListResponse ? tokens : []
    );
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
    dataSource = new ApiTokensDataSource(TestBed.inject(Injector));
  });

  it('requests API tokens with the user relationship and annotates token status', () => {
    dataSource.loadAll();
    const [resource, params] = (TestBed.inject(GlobalService).getAll as ReturnType<typeof vi.fn>).mock.lastCall!;
    expect(resource).toBe(SERV.API_TOKENS);
    expect((params as RequestParams).include).toContain('user');
    const rows = dataSource.getOriginalData() as (JApiToken & { isActive: boolean; isExpired: boolean })[];
    expect(rows.map(({ isActive, isExpired }) => [isActive, isExpired])).toEqual([
      [true, false],
      [false, true],
      [false, false]
    ]);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('clears selection before reload', () => {
    dataSource.selection.select(tokens[0]);
    dataSource.reload();
    expect(dataSource.selection.selected).toEqual([]);
  });
});
