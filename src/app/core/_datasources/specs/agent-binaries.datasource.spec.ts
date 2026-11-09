import { HttpHeaderName } from '@constants/http.config';
import { zAgentBinaryListResponse } from '@generated/api/zod';
import { of, throwError } from 'rxjs';
import type { MockedObject } from 'vitest';

import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { JAgentBinary } from '@models/agent-binary.model';
import { Filter, FilterType, RequestParams } from '@models/request-params.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { PermissionService } from '@services/permission/permission.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { AgentBinariesDataSource } from '@src/app/core/_datasources/agent-binaries.datasource';
import { mockResponse } from '@src/app/testing/mock-response';

const BINARY = { id: 7, type: 'agentBinary', filename: 'agent.bin' } as unknown as JAgentBinary;

describe('AgentBinariesDataSource', () => {
  let dataSource: AgentBinariesDataSource;
  let service: MockedObject<GlobalService>;

  beforeEach(() => {
    service = { getAll: vi.fn().mockReturnValue(of(mockResponse())) } as unknown as MockedObject<GlobalService>;
    const cdr = { markForCheck: vi.fn(), detectChanges: vi.fn() };
    const ui = { getUISettings: vi.fn().mockReturnValue({}) };
    const refresh = { toggleAutoRefresh: vi.fn(), startAutoRefresh: vi.fn(), stopAutoRefresh: vi.fn(), refresh$: of() };
    const cache = { invalidate: vi.fn() };
    const storage = { getItem: vi.fn().mockReturnValue(null), setItem: vi.fn() };
    vi.spyOn(JsonAPISerializer.prototype, 'deserialize').mockImplementation((_response, schema) =>
      schema === zAgentBinaryListResponse ? [BINARY] : []
    );

    TestBed.configureTestingModule({
      providers: [
        { provide: GlobalService, useValue: service },
        { provide: ChangeDetectorRef, useValue: cdr },
        { provide: UIConfigService, useValue: ui },
        { provide: PermissionService, useValue: {} },
        { provide: JsonAPISerializer, useValue: new JsonAPISerializer() },
        { provide: AutoRefreshService, useValue: refresh },
        { provide: HttpCacheService, useValue: cache },
        { provide: LocalStorageService, useValue: storage }
      ]
    });
    dataSource = new AgentBinariesDataSource(TestBed.inject(Injector));
  });

  it('requests agent binaries with error-dialog suppression headers', () => {
    dataSource.loadAll();
    const [resource, _params, options] = service.getAll.mock.lastCall!;
    expect(resource).toBe(SERV.AGENT_BINARY);
    expect(
      (options as { headers: { get(name: string): string | null } }).headers.get(HttpHeaderName.SKIP_ERROR_DIALOG)
    ).toBe('true');
  });

  it('deserializes the response, updates pagination cursors, and ends loading', () => {
    service.getAll.mockReturnValue(
      of(
        mockResponse({
          links: {
            next: 'http://test/items?page%5Bafter%5D=next-cursor',
            prev: 'http://test/items?page%5Bbefore%5D=prev-cursor'
          },
          meta: { page: { total_elements: 12 } }
        })
      )
    );

    dataSource.loadAll();

    expect(dataSource.getOriginalData()).toEqual([BINARY]);
    expect(dataSource.totalItems).toBe(12);
    expect(dataSource.pageAfter).toBe('next-cursor');
    expect(dataSource.pageBefore).toBe('prev-cursor');
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('retains a filter for later loads and removes it when clearFilter is called', () => {
    const filter: Filter = { field: 'filename', operator: FilterType.EQUAL, value: 'agent.bin' };
    dataSource.loadAll(filter);
    const firstParams = service.getAll.mock.lastCall![1] as RequestParams;
    expect(firstParams.filter).toContainEqual(filter);

    dataSource.loadAll();
    const retainedParams = service.getAll.mock.lastCall![1] as RequestParams;
    expect(retainedParams.filter).toContainEqual(filter);

    dataSource.clearFilter();
    const clearedParams = service.getAll.mock.lastCall![1] as RequestParams;
    expect(clearedParams.filter ?? []).not.toContainEqual(filter);
  });

  it('emits filter errors and ends loading when the request fails', () => {
    const errors: string[] = [];
    dataSource.filterError$.subscribe((error) => errors.push(error));
    service.getAll.mockReturnValue(throwError(() => ({ status: 400, error: { title: 'Invalid filter' } })));

    dataSource.loadAll();

    expect(errors).toEqual(['Invalid filter']);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });
});
