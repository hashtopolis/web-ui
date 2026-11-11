import { zCrackerBinaryTypeListResponse } from '@generated/api/zod';
import { of, throwError } from 'rxjs';

import { JCrackerBinaryType } from '@models/cracker-binary.model';
import { Filter, FilterType, RequestParams } from '@models/request-params.model';

import { SERV } from '@services/main.config';

import { CrackersDataSource } from '@datasources/crackers.datasource';

import { setupDatasource } from '@src/app/core/_datasources/specs/datasource-test-setup-util';
import { mockValidResponse } from '@src/app/testing/mock-response';

const CRACKER_TYPE: JCrackerBinaryType = {
  id: 5,
  type: 'crackerBinaryType',
  typeName: 'hashcat',
  isChunkingAvailable: true,
  crackerVersions: []
} as JCrackerBinaryType;

const crackerResponse = mockValidResponse(zCrackerBinaryTypeListResponse, {
  data: [
    {
      id: CRACKER_TYPE.id,
      type: CRACKER_TYPE.type,
      attributes: { typeName: CRACKER_TYPE.typeName, isChunkingAvailable: true },
      relationships: { crackerVersions: { data: [] } }
    }
  ],
  meta: { page: { total_elements: 17 } },
  links: {
    next: 'https://api.test/crackers?page%5Bafter%5D=next-cracker',
    prev: 'https://api.test/crackers?page%5Bbefore%5D=previous-cracker'
  }
});

describe('CrackersDataSource', () => {
  let dataSource: CrackersDataSource;
  let service: ReturnType<typeof setupDatasource<CrackersDataSource>>['service'];
  let serializer: ReturnType<typeof setupDatasource<CrackersDataSource>>['serializer'];

  beforeEach(() => {
    const setup = setupDatasource(CrackersDataSource);
    dataSource = setup.dataSource;
    service = setup.service;
    serializer = setup.serializer;
    serializer.deserialize.mockReturnValue([CRACKER_TYPE]);
    service.getAll.mockReturnValue(of(crackerResponse));
  });

  it('requests cracker versions, applies the filter, and populates the data', () => {
    const query: Filter = { field: 'name', operator: FilterType.ICONTAINS, value: 'hashcat' };
    dataSource.loadAll(query);

    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.CRACKERS_TYPES, expect.anything(), expect.anything());
    expect(serializer.deserialize).toHaveBeenCalledExactlyOnceWith(crackerResponse, zCrackerBinaryTypeListResponse);
    const params = service.getAll.mock.lastCall![1] as RequestParams;
    expect(params!.include).toContain('crackerVersions');
    expect(params!.filter).toContainEqual(expect.objectContaining({ field: 'name', value: 'hashcat' }));
    expect(dataSource.getOriginalData()).toStrictEqual([CRACKER_TYPE]);
    expect(dataSource.totalItems).toBe(17);
    expect(dataSource.pageAfter).toBe('next-cracker');
    expect(dataSource.pageBefore).toBe('previous-cracker');
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('retains the active filter and clears it with the pagination cursor', () => {
    const query: Filter = { field: 'name', operator: FilterType.ICONTAINS, value: 'hashcat' };
    dataSource.loadAll(query);
    dataSource.loadAll();
    expect((service.getAll.mock.calls[0][1] as RequestParams).filter).toContainEqual(query);
    expect((service.getAll.mock.calls[1][1] as RequestParams).filter).toContainEqual(query);

    dataSource.totalItems = 50;
    dataSource.index = 2;
    dataSource.pageAfter = 'current-page-cursor';
    dataSource.clearFilter();

    const params = service.getAll.mock.calls[2][1] as RequestParams;
    expect(params!.filter ?? []).not.toContainEqual(query);
    expect(params.page?.after).toBeUndefined();
    expect(dataSource.index).toBe(0);
    expect(service.getAll).toHaveBeenCalledTimes(3);
  });

  it('clears selection and reloads data', () => {
    dataSource.loadAll();
    const crackerType = dataSource.getOriginalData()[0];
    dataSource.selection.select(crackerType);
    service.getAll.mockClear();

    dataSource.reload();

    expect(dataSource.selection.isSelected(crackerType)).toBe(false);
    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.CRACKERS_TYPES, expect.anything(), expect.anything());
  });

  it('preserves existing cracker types, emits filter errors, and ends loading when a request fails', () => {
    dataSource.loadAll();
    const loadedCrackerTypes = dataSource.getOriginalData();
    const errors: string[] = [];
    dataSource.filterError$.subscribe((error) => errors.push(error));
    service.getAll.mockReturnValue(throwError(() => ({ status: 400, error: { title: 'Invalid filter' } })));

    dataSource.loadAll();

    expect(dataSource.getOriginalData()).toStrictEqual(loadedCrackerTypes);
    expect(errors).toStrictEqual(['Invalid filter']);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });
});
