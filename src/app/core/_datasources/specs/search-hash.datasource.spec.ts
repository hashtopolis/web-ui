import { throwError } from 'rxjs';

import { SERV } from '@services/main.config';

import { SearchHashDataSource } from '@datasources/search-hash.datasource';
import { setupDatasource } from '@datasources/specs/datasource-test-setup-util';

describe('SearchHashDataSource', () => {
  it('searches hashes for submitted values and includes hashlists', () => {
    const { dataSource, service } = setupDatasource(SearchHashDataSource);
    const ds = dataSource;
    ds.setSearch(['abc', 'def']);
    ds.loadAll();
    const [resource, params] = service.getAll.mock.lastCall!;
    expect(resource).toBe(SERV.HASHES);
    expect(params.include).toContain('hashlist');
    expect(params.filter).toEqual(
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

    dataSource.loadAll({ field: 'hashlistId', operator: 'eq' as never, value: 11 });

    const [duplicate, cracked, missing] = dataSource.getOriginalData();
    expect(duplicate.hashlists).toEqual([firstHashlist, secondHashlist]);
    expect(duplicate.hashInfo).toBe('Not cracked yet');
    expect(cracked.hashInfo).toMatch(/^Cracked on /);
    expect(missing).toMatchObject({ id: -1, hash: 'missing', hashInfo: 'Not found in any hashlist' });
  });

  it('keeps existing rows and resets loading after a request failure', () => {
    const { dataSource, service } = setupDatasource(SearchHashDataSource);
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    service.getAll.mockReturnValue(throwError(() => new Error('request failed')));
    dataSource.setSearch(['abc']);

    dataSource.loadAll();

    expect(dataSource.getOriginalData()).toEqual([]);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
    expect(error).toHaveBeenCalled();
  });
});
