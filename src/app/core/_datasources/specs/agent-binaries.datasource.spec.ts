import { HttpHeaderName } from '@constants/http.config';
import { zAgentBinaryListResponse } from '@generated/api/zod';
import { of, throwError } from 'rxjs';

import { Filter, FilterType, RequestParams } from '@models/request-params.model';

import { SERV } from '@services/main.config';

import { AgentBinariesDataSource } from '@src/app/core/_datasources/agent-binaries.datasource';
import { setupDatasource } from '@src/app/core/_datasources/specs/datasource-test-setup-util';
import { mockValidResponse } from '@src/app/testing/mock-response';

const BINARY = {
  id: 7,
  type: 'agentBinary',
  binaryType: 'python',
  filename: 'agent.bin',
  operatingSystems: 'linux',
  updateAvailable: 'false',
  updateTrack: 'stable',
  version: '1.2.3'
};

const BINARY_ATTRIBUTES = {
  binaryType: BINARY.binaryType,
  filename: BINARY.filename,
  operatingSystems: BINARY.operatingSystems,
  updateAvailable: BINARY.updateAvailable,
  updateTrack: BINARY.updateTrack,
  version: BINARY.version
};

const binaryResponse = (totalElements = 1) =>
  mockValidResponse(zAgentBinaryListResponse, {
    data: [{ id: BINARY.id, type: 'agentBinary', attributes: BINARY_ATTRIBUTES }],
    links: {
      next: 'http://test/items?page%5Bafter%5D=next-cursor',
      prev: 'http://test/items?page%5Bbefore%5D=prev-cursor'
    },
    meta: { page: { total_elements: totalElements } }
  });

describe('AgentBinariesDataSource', () => {
  let dataSource: AgentBinariesDataSource;
  let service: ReturnType<typeof setupDatasource<AgentBinariesDataSource>>['service'];
  let serializer: ReturnType<typeof setupDatasource<AgentBinariesDataSource>>['serializer'];

  beforeEach(() => {
    const setup = setupDatasource(AgentBinariesDataSource);
    dataSource = setup.dataSource;
    service = setup.service;
    serializer = setup.serializer;
    serializer.deserialize.mockReturnValue([BINARY]);
  });

  it('requests agent binaries with error-dialog suppression headers', () => {
    dataSource.loadAll();

    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.AGENT_BINARY, expect.anything(), expect.anything());
    const options = service.getAll.mock.lastCall![2];
    expect(options?.headers?.get(HttpHeaderName.SKIP_ERROR_DIALOG)).toBe('true');
  });

  it('deserializes binaries, updates pagination cursors, and ends loading', () => {
    service.getAll.mockReturnValue(of(binaryResponse(12)));

    dataSource.loadAll();

    expect(serializer.deserialize).toHaveBeenCalledExactlyOnceWith(expect.anything(), zAgentBinaryListResponse);
    expect(dataSource.getOriginalData()).toStrictEqual([BINARY]);
    expect(dataSource.totalItems).toBe(12);
    expect(dataSource.pageAfter).toBe('next-cursor');
    expect(dataSource.pageBefore).toBe('prev-cursor');
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('retains the active filter and clears it with the pagination cursor', () => {
    const filter: Filter = { field: 'filename', operator: FilterType.EQUAL, value: 'agent.bin' };
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
    const binary = dataSource.getOriginalData()[0];
    dataSource.selection.select(binary);
    service.getAll.mockClear();

    dataSource.reload();

    expect(dataSource.selection.isSelected(binary)).toBe(false);
    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.AGENT_BINARY, expect.anything(), expect.anything());
  });

  it('preserves existing binaries data, emits filter errors and ends loading when the request fails', () => {
    dataSource.loadAll();
    const loadedBinaries = dataSource.getOriginalData();
    const errors: string[] = [];
    dataSource.filterError$.subscribe((error) => errors.push(error));
    service.getAll.mockReturnValue(throwError(() => ({ status: 400, error: { title: 'Invalid filter' } })));

    dataSource.loadAll();

    expect(dataSource.getOriginalData()).toStrictEqual(loadedBinaries);
    expect(errors).toStrictEqual(['Invalid filter']);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });
});
