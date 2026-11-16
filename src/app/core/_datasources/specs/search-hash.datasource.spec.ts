import { throwError } from 'rxjs';

import { FilterType } from '@models/request-params.model';

import { SERV } from '@services/main.config';

import { SearchHashDataSource } from '@datasources/search-hash.datasource';

import { setupDatasource } from '@src/app/testing/datasource-test-setup';

describe('SearchHashDataSource', () => {
  it('searches hashes for submitted values and includes hashlists', () => {
    const { dataSource, service } = setupDatasource(SearchHashDataSource);
    dataSource.setSearch(['abc', 'def']);
    dataSource.loadAll();
    const [resource, params] = service.getAll.mock.lastCall!;
    expect(resource).toBe(SERV.HASHES);
    expect(params!.include).toContain('hashlist');
    expect(params!.filter).toStrictEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'hash', value: ['abc', 'def'] })])
    );
  });

  it('groups duplicate hash results, formats cracked rows, and inserts missing searches', () => {
    const { dataSource } = setupDatasource(SearchHashDataSource);
    const firstHashlist = { id: 11, type: 'hashlist', name: 'First' };
    const secondHashlist = { id: 12, type: 'hashlist', name: 'Second' };
    const results = [
      { id: 1, type: 'hash', hash: 'abc', plaintext: 'secret', isCracked: false, hashlist: firstHashlist },
      { id: 2, type: 'hash', hash: 'abc', plaintext: 'secret', isCracked: false, hashlist: secondHashlist },
      { id: 3, type: 'hash', hash: 'other', plaintext: 'found', isCracked: true, timeCracked: 1700000000 }
    ];
    vi.spyOn(dataSource.serializer, 'deserialize').mockImplementation(() => results as never);
    dataSource.setSearch(['abc', 'other', 'missing']);
    dataSource.setDateFormat('yyyy-MM-dd');

    dataSource.loadAll({ field: 'hashlistId', operator: FilterType.EQUAL, value: 11 });

    const [duplicate, cracked, missing] = dataSource.getOriginalData();
    expect(duplicate.hashlists).toStrictEqual([firstHashlist, secondHashlist]);
    expect(duplicate.hashInfo).toBe('Not cracked yet');
    expect(cracked.hashInfo).toMatch(/^Cracked on /);
    expect(missing).toMatchObject({ id: -1, hash: 'missing', hashInfo: 'Not found in any hashlist' });
  });

  it('keeps existing rows and resets loading after a request failure', () => {
    const { dataSource, service } = setupDatasource(SearchHashDataSource);
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const requestError = new Error('request failed');
    const existingRow = {
      id: 7,
      hash: 'existing',
      plaintext: 'pw',
      hashlists: [],
      hashInfo: 'Not cracked yet',
      type: 'SearchHash'
    } as never;
    dataSource.setData([existingRow]);
    service.getAll.mockReturnValue(throwError(() => requestError));
    dataSource.setSearch(['abc']);

    dataSource.loadAll();

    expect(dataSource.getOriginalData()).toStrictEqual([existingRow]);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
    expect(error).toHaveBeenCalledExactlyOnceWith('Error loading hashes', requestError);
  });

  it('clears selection and reloads the hash resource', () => {
    const { dataSource, service } = setupDatasource(SearchHashDataSource);
    dataSource.setSearch(['abc']);
    dataSource.selection.select({} as never);

    dataSource.reload();

    expect(dataSource.selection.hasValue()).toBe(false);
    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.HASHES, expect.anything());
  });
});
