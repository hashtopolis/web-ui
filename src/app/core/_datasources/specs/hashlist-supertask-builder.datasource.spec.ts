import { HttpHeaderName } from '@constants/http.config';
import { zSupertaskListResponse } from '@generated/api/zod';
import { of, throwError } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { RequestParams } from '@models/request-params.model';
import { JSuperTask } from '@models/supertask.model';

import { SERV } from '@services/main.config';

import { HashlistSupertaskBuilderDataSource } from '@src/app/core/_datasources/hashlist-supertask-builder.datasource';
import { setupDatasource } from '@src/app/testing/datasource-test-setup';
import { mockValidResponse } from '@src/app/testing/mock-response';

const SUPERTASK = { id: 2, type: 'supertask', supertaskName: 'builder', crackerBinaryTypeId: 1 } as JSuperTask;
const SUPERTASK_RESPONSE = (totalElements = 27) =>
  mockValidResponse(zSupertaskListResponse, {
    data: [
      {
        id: SUPERTASK.id,
        type: 'supertask',
        attributes: { supertaskName: SUPERTASK.supertaskName, crackerBinaryTypeId: 1 }
      }
    ],
    links: {
      next: 'http://test/supertasks?page%5Bafter%5D=next-cursor',
      prev: 'http://test/supertasks?page%5Bbefore%5D=prev-cursor'
    },
    meta: { page: { total_elements: totalElements } }
  });

describe('HashlistSupertaskBuilderDataSource', () => {
  let dataSource: HashlistSupertaskBuilderDataSource;
  let service: ReturnType<typeof setupDatasource<HashlistSupertaskBuilderDataSource>>['service'];
  let serializer: ReturnType<typeof setupDatasource<HashlistSupertaskBuilderDataSource>>['serializer'];

  beforeEach(() => {
    const setup = setupDatasource(HashlistSupertaskBuilderDataSource);
    dataSource = setup.dataSource;
    service = setup.service;
    serializer = setup.serializer;
    serializer.deserialize.mockReturnValue([SUPERTASK]);
  });

  afterEach(() => TestBed.resetTestingModule());

  it('requests supertasks with error-dialog suppression and populates data and pagination', () => {
    service.getAll.mockReturnValue(of(SUPERTASK_RESPONSE()));

    dataSource.loadAll();

    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.SUPER_TASKS, expect.anything(), expect.anything());
    const options = service.getAll.mock.lastCall![2];
    expect(options?.headers?.get(HttpHeaderName.SKIP_ERROR_DIALOG)).toBe('true');
    expect((service.getAll.mock.lastCall![1] as RequestParams).include).toBeUndefined();
    expect(serializer.deserialize).toHaveBeenCalledExactlyOnceWith(expect.anything(), zSupertaskListResponse);
    expect(dataSource.getOriginalData()).toStrictEqual([SUPERTASK]);
    expect(dataSource.totalItems).toBe(27);
    expect(dataSource.pageAfter).toBe('next-cursor');
    expect(dataSource.pageBefore).toBe('prev-cursor');
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('clears selection and requests supertasks on reload', () => {
    dataSource.selection.select(SUPERTASK);
    service.getAll.mockClear();

    dataSource.reload();

    expect(dataSource.selection.isSelected(SUPERTASK)).toBe(false);
    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.SUPER_TASKS, expect.anything(), expect.anything());
  });

  it('preserves existing rows, emits filter errors, and ends loading on request failure', () => {
    service.getAll.mockReturnValue(of(SUPERTASK_RESPONSE()));
    dataSource.loadAll();
    const errors: string[] = [];
    dataSource.filterError$.subscribe((error) => errors.push(error));
    service.getAll.mockReturnValue(throwError(() => ({ status: 400, error: { title: 'Invalid filter' } })));

    dataSource.loadAll();

    expect(dataSource.getOriginalData()).toStrictEqual([SUPERTASK]);
    expect(errors).toStrictEqual(['Invalid filter']);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });
});
