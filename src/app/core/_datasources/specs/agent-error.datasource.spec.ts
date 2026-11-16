import { zAgentErrorListResponse } from '@generated/api/zod';
import { of, throwError } from 'rxjs';

import { Filter, FilterType, RequestParams } from '@models/request-params.model';

import { SERV } from '@services/main.config';

import { AgentErrorDatasource } from '@src/app/core/_datasources/agent-error.datasource';
import { setupDatasource } from '@src/app/testing/datasource-test-setup';
import { mockValidResponse } from '@src/app/testing/mock-response';

const AGENT_ERROR = {
  id: 4,
  type: 'agentError',
  agentId: 23,
  taskId: 5,
  chunkId: null,
  time: 1710000000,
  error: 'Connection failed'
};

const ERROR_ATTRIBUTES = {
  agentId: AGENT_ERROR.agentId,
  taskId: AGENT_ERROR.taskId,
  chunkId: AGENT_ERROR.chunkId,
  time: AGENT_ERROR.time,
  error: AGENT_ERROR.error
};

const agentErrorResponse = (totalElements = 1) =>
  mockValidResponse(zAgentErrorListResponse, {
    data: [{ id: AGENT_ERROR.id, type: 'agentError', attributes: ERROR_ATTRIBUTES }],
    links: {
      next: 'http://test/errors?page%5Bafter%5D=next-cursor',
      prev: 'http://test/errors?page%5Bbefore%5D=prev-cursor'
    },
    meta: { page: { total_elements: totalElements } }
  });

describe('AgentErrorDatasource', () => {
  let dataSource: AgentErrorDatasource;
  let service: ReturnType<typeof setupDatasource<AgentErrorDatasource>>['service'];
  let serializer: ReturnType<typeof setupDatasource<AgentErrorDatasource>>['serializer'];

  beforeEach(() => {
    const setup = setupDatasource(AgentErrorDatasource);
    dataSource = setup.dataSource;
    service = setup.service;
    serializer = setup.serializer;
    serializer.deserialize.mockReturnValue([AGENT_ERROR]);
  });

  it('requests errors with a task include and the configured agent ID filter', () => {
    dataSource.setAgentId(23);
    dataSource.loadAll();

    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.AGENT_ERRORS, expect.anything());
    const params = service.getAll.mock.lastCall![1] as RequestParams;
    expect(params!.include).toContain('task');
    expect(params!.filter).toContainEqual({ field: 'agentId', operator: FilterType.EQUAL, value: 23 });
  });

  it('omits the agent ID filter when no ID is set', () => {
    dataSource.loadAll();

    const params = service.getAll.mock.lastCall![1] as RequestParams;
    expect(params!.filter ?? []).not.toContainEqual(expect.objectContaining({ field: 'agentId' }));
  });

  it('deserializes errors, updates pagination cursors, and ends loading', () => {
    service.getAll.mockReturnValue(of(agentErrorResponse(8)));

    dataSource.loadAll();

    expect(serializer.deserialize).toHaveBeenCalledExactlyOnceWith(expect.anything(), zAgentErrorListResponse);
    expect(dataSource.getOriginalData()).toStrictEqual([AGENT_ERROR]);
    expect(dataSource.totalItems).toBe(8);
    expect(dataSource.pageAfter).toBe('next-cursor');
    expect(dataSource.pageBefore).toBe('prev-cursor');
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('retains the active filter and clears it with the pagination cursor', () => {
    const filter: Filter = { field: 'error', operator: FilterType.EQUAL, value: 'failed' };
    dataSource.loadAll(filter);
    expect((service.getAll.mock.calls[0][1] as RequestParams).filter).toContainEqual(filter);

    dataSource.loadAll();
    expect((service.getAll.mock.calls[1][1] as RequestParams).filter).toContainEqual(filter);

    dataSource.totalItems = 75;
    dataSource.index = 2;
    dataSource.pageAfter = 'current-page-cursor';
    dataSource.clearFilter();

    const clearFilterParams = service.getAll.mock.calls[2][1] as RequestParams;
    expect(clearFilterParams.filter ?? []).not.toContainEqual(filter);
    expect(clearFilterParams.page?.after).toBeUndefined();
    expect(dataSource.index).toBe(0);
  });

  it('clears the current selection when reloading', () => {
    dataSource.loadAll();
    const error = dataSource.getOriginalData()[0];
    dataSource.selection.select(error);
    service.getAll.mockClear();

    dataSource.reload();

    expect(dataSource.selection.isSelected(error)).toBe(false);
    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.AGENT_ERRORS, expect.anything());
  });

  it('preserves existing errors and ends loading when the next request fails', () => {
    dataSource.loadAll();
    const loadedErrors = dataSource.getOriginalData();
    service.getAll.mockReturnValue(throwError(() => new Error('request failed')));

    dataSource.loadAll();

    expect(dataSource.getOriginalData()).toStrictEqual(loadedErrors);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });
});
