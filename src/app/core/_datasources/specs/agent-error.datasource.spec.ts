import { zAgentErrorListResponse } from '@generated/api/zod';
import { of, throwError } from 'rxjs';
import type { MockedObject } from 'vitest';

import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { JAgentErrors } from '@models/agent-errors.model';
import { Filter, FilterType, RequestParams } from '@models/request-params.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { PermissionService } from '@services/permission/permission.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { AgentErrorDatasource } from '@src/app/core/_datasources/agent-error.datasource';
import { mockResponse } from '@src/app/testing/mock-response';

const AGENT_ERROR = { id: 4, type: 'agentError', message: 'Connection failed' } as unknown as JAgentErrors;

describe('AgentErrorDatasource', () => {
  let dataSource: AgentErrorDatasource;
  let service: MockedObject<GlobalService>;

  beforeEach(() => {
    service = { getAll: vi.fn().mockReturnValue(of(mockResponse())) } as unknown as MockedObject<GlobalService>;
    const cdr = { markForCheck: vi.fn(), detectChanges: vi.fn() };
    const ui = { getUISettings: vi.fn().mockReturnValue({}) };
    const refresh = { toggleAutoRefresh: vi.fn(), startAutoRefresh: vi.fn(), stopAutoRefresh: vi.fn(), refresh$: of() };
    const cache = { invalidate: vi.fn() };
    const storage = { getItem: vi.fn().mockReturnValue(null), setItem: vi.fn() };
    vi.spyOn(JsonAPISerializer.prototype, 'deserialize').mockImplementation((_response, schema) =>
      schema === zAgentErrorListResponse ? [AGENT_ERROR] : []
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
    dataSource = new AgentErrorDatasource(TestBed.inject(Injector));
  });

  it('requests errors with the task include and optional agent ID filter', () => {
    dataSource.setAgentId(23);
    dataSource.loadAll();

    const [resource, params] = service.getAll.mock.lastCall!;
    expect(resource).toBe(SERV.AGENT_ERRORS);
    expect((params as RequestParams).include).toContain('task');
    expect((params as RequestParams).filter).toContainEqual({
      field: 'agentId',
      operator: FilterType.EQUAL,
      value: 23
    });
  });

  it('omits the agent ID filter when no ID is set', () => {
    dataSource.loadAll();
    const params = service.getAll.mock.lastCall![1] as RequestParams;
    expect(params.filter ?? []).not.toContainEqual(expect.objectContaining({ field: 'agentId' }));
  });

  it('sets the deserialized errors and pagination cursors from the response', () => {
    service.getAll.mockReturnValue(
      of(
        mockResponse({
          links: {
            next: 'http://test/errors?page%5Bafter%5D=next-cursor',
            prev: 'http://test/errors?page%5Bbefore%5D=prev-cursor'
          },
          meta: { page: { total_elements: 8 } }
        })
      )
    );

    dataSource.loadAll();

    expect(dataSource.getOriginalData()).toEqual([AGENT_ERROR]);
    expect(dataSource.totalItems).toBe(8);
    expect(dataSource.pageAfter).toBe('next-cursor');
    expect(dataSource.pageBefore).toBe('prev-cursor');
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('retains filters across loads and clears them when requested', () => {
    const filter: Filter = { field: 'message', operator: FilterType.EQUAL, value: 'failed' };
    dataSource.loadAll(filter);
    expect((service.getAll.mock.lastCall![1] as RequestParams).filter).toContainEqual(filter);

    dataSource.loadAll();
    expect((service.getAll.mock.lastCall![1] as RequestParams).filter).toContainEqual(filter);

    dataSource.clearFilter();
    expect((service.getAll.mock.lastCall![1] as RequestParams).filter ?? []).not.toContainEqual(filter);
  });

  it('clears the current selection when reloading', () => {
    dataSource.selection.select(AGENT_ERROR);

    dataSource.reload();

    expect(dataSource.selection.isSelected(AGENT_ERROR)).toBe(false);
    expect(service.getAll).toHaveBeenCalled();
  });

  it('ends loading after a request error', () => {
    service.getAll.mockReturnValue(throwError(() => new Error('request failed')));

    dataSource.loadAll();

    expect(dataSource.getOriginalData()).toEqual([]);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });
});
