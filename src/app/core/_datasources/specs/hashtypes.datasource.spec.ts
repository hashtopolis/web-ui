import { HttpHeaderName } from '@constants/http.config';
import { zHashTypeListResponse } from '@generated/api/zod';
import { of, throwError } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { JHashtype } from '@models/hashtype.model';
import { Filter, FilterType, RequestParams } from '@models/request-params.model';

import { SERV } from '@services/main.config';

import { HashtypesDataSource } from '@src/app/core/_datasources/hashtypes.datasource';
import { setupDatasource } from '@src/app/testing/datasource-test-setup';
import { mockValidResponse } from '@src/app/testing/mock-response';

const HASHTYPE = { id: 3, type: 'hashType', description: 'SHA256', isSalted: false, isSlowHash: false } as JHashtype;
const HASHTYPE_RESPONSE = (totalElements = 27) =>
  mockValidResponse(zHashTypeListResponse, {
    data: [
      {
        id: HASHTYPE.id,
        type: 'hashType',
        attributes: {
          description: HASHTYPE.description,
          isSalted: HASHTYPE.isSalted,
          isSlowHash: HASHTYPE.isSlowHash
        }
      }
    ],
    links: {
      next: 'http://test/hashtypes?page%5Bafter%5D=next-cursor',
      prev: 'http://test/hashtypes?page%5Bbefore%5D=prev-cursor'
    },
    meta: { page: { total_elements: totalElements } }
  });

describe('HashtypesDataSource', () => {
  let dataSource: HashtypesDataSource;
  let service: ReturnType<typeof setupDatasource<HashtypesDataSource>>['service'];
  let serializer: ReturnType<typeof setupDatasource<HashtypesDataSource>>['serializer'];
  const filter: Filter = { field: 'description', operator: FilterType.ICONTAINS, value: 'sha' };

  beforeEach(() => {
    const setup = setupDatasource(HashtypesDataSource);
    dataSource = setup.dataSource;
    service = setup.service;
    serializer = setup.serializer;
    serializer.deserialize.mockReturnValue([HASHTYPE]);
  });

  afterEach(() => TestBed.resetTestingModule());

  it('requests hashtypes with the provided filter and error-dialog suppression, then populates data and pagination', () => {
    service.getAll.mockReturnValue(of(HASHTYPE_RESPONSE()));

    dataSource.loadAll(filter);

    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.HASHTYPES, expect.anything(), expect.anything());
    const options = service.getAll.mock.lastCall![2];
    expect(options?.headers?.get(HttpHeaderName.SKIP_ERROR_DIALOG)).toBe('true');
    expect((service.getAll.mock.lastCall![1] as RequestParams).filter).toStrictEqual([filter]);
    expect(serializer.deserialize).toHaveBeenCalledExactlyOnceWith(expect.anything(), zHashTypeListResponse);
    expect(dataSource.getOriginalData()).toStrictEqual([HASHTYPE]);
    expect(dataSource.totalItems).toBe(27);
    expect(dataSource.pageAfter).toBe('next-cursor');
    expect(dataSource.pageBefore).toBe('prev-cursor');
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('retains the active filter when reloading and clears the selection', () => {
    service.getAll.mockReturnValue(of(HASHTYPE_RESPONSE()));
    dataSource.loadAll(filter);
    dataSource.selection.select(HASHTYPE);
    service.getAll.mockClear();

    dataSource.reload();

    expect(dataSource.selection.isSelected(HASHTYPE)).toBe(false);
    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.HASHTYPES, expect.anything(), expect.anything());
    expect((service.getAll.mock.lastCall![1] as RequestParams).filter).toStrictEqual([filter]);
  });

  it('removes the active filter and resets pagination when clearing the filter', () => {
    service.getAll.mockReturnValue(of(HASHTYPE_RESPONSE()));
    dataSource.loadAll(filter);
    dataSource.index = 2;
    dataSource.pageAfter = 'current-page-cursor';
    dataSource.pageBefore = 'previous-page-cursor';
    service.getAll.mockClear();

    dataSource.clearFilter();

    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.HASHTYPES, expect.anything(), expect.anything());
    const params = service.getAll.mock.lastCall![1] as RequestParams;
    expect(params!.filter).toBeUndefined();
    expect(params.page?.after).toBeUndefined();
    expect(params.page?.before).toBeUndefined();
    expect(dataSource.index).toBe(0);
  });

  it('preserves existing rows, emits filter errors, and ends loading on request failure', () => {
    service.getAll.mockReturnValue(of(HASHTYPE_RESPONSE()));
    dataSource.loadAll();
    const errors: string[] = [];
    dataSource.filterError$.subscribe((error) => errors.push(error));
    service.getAll.mockReturnValue(throwError(() => ({ status: 400, error: { title: 'Invalid filter' } })));

    dataSource.loadAll(filter);

    expect(dataSource.getOriginalData()).toStrictEqual([HASHTYPE]);
    expect(errors).toStrictEqual(['Invalid filter']);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });
});
