import { zApiTokenListResponse } from '@generated/api/zod';
import { of, throwError } from 'rxjs';

import { JApiToken } from '@models/api-token.model';
import { RequestParams } from '@models/request-params.model';

import { SERV } from '@services/main.config';

import { ApiTokensDataSource } from '@datasources/api-tokens.datasource';

import { setupDatasource } from '@src/app/testing/datasource-test-setup';
import { mockValidResponse } from '@src/app/testing/mock-response';

const TOKENS: JApiToken[] = [
  { id: 1, type: 'apiToken', startValid: 1, endValid: 9999999999, isRevoked: false, userId: 2 },
  { id: 2, type: 'apiToken', startValid: 1, endValid: 1, isRevoked: false, userId: 2 },
  { id: 3, type: 'apiToken', startValid: 1, endValid: 9999999999, isRevoked: true, userId: 2 }
] as JApiToken[];

const tokenResponse = mockValidResponse(zApiTokenListResponse, {
  data: TOKENS.map(({ id, startValid, endValid, isRevoked, userId }) => ({
    id,
    type: 'apiToken',
    attributes: { tokenName: `Token ${id}`, startValid, endValid, isRevoked, userId }
  })),
  meta: { page: { total_elements: 30 } },
  links: {
    next: 'https://api.test/tokens?page%5Bafter%5D=next-token',
    prev: 'https://api.test/tokens?page%5Bbefore%5D=previous-token'
  }
});

describe('ApiTokensDataSource', () => {
  let dataSource: ApiTokensDataSource;
  let service: ReturnType<typeof setupDatasource<ApiTokensDataSource>>['service'];
  let serializer: ReturnType<typeof setupDatasource<ApiTokensDataSource>>['serializer'];

  beforeEach(() => {
    const setup = setupDatasource(ApiTokensDataSource);
    dataSource = setup.dataSource;
    service = setup.service;
    serializer = setup.serializer;
    serializer.deserialize.mockReturnValue(TOKENS);
  });

  it('requests tokens with users, annotates token status, and ends loading', () => {
    service.getAll.mockReturnValueOnce(of(tokenResponse));
    dataSource.loadAll();

    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.API_TOKENS, expect.anything());
    expect((service.getAll.mock.lastCall![1] as RequestParams).include).toContain('user');
    expect(serializer.deserialize).toHaveBeenCalledExactlyOnceWith(tokenResponse, zApiTokenListResponse, {
      include: ['user']
    });
    const rows = dataSource.getOriginalData() as (JApiToken & { isActive: boolean; isExpired: boolean })[];
    expect(rows.map(({ isActive, isExpired }) => [isActive, isExpired])).toStrictEqual([
      [true, false],
      [false, true],
      [false, false]
    ]);
    expect(dataSource.totalItems).toBe(30);
    expect(dataSource.pageAfter).toBe('next-token');
    expect(dataSource.pageBefore).toBe('previous-token');
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });

  it('clears the current selection when reloading', () => {
    dataSource.loadAll();
    const token = dataSource.getOriginalData()[0];
    dataSource.selection.select(token);
    service.getAll.mockClear();

    dataSource.reload();

    expect(dataSource.selection.isSelected(token)).toBe(false);
    expect(service.getAll).toHaveBeenCalledExactlyOnceWith(SERV.API_TOKENS, expect.anything());
  });

  it('preserves existing tokens, emits filter errors, and ends loading when a request fails', () => {
    dataSource.loadAll();
    const loadedTokens = dataSource.getOriginalData();
    const errors: string[] = [];
    dataSource.filterError$.subscribe((error) => errors.push(error));
    service.getAll.mockReturnValue(throwError(() => ({ status: 400, error: { title: 'Invalid filter' } })));

    dataSource.loadAll();

    expect(dataSource.getOriginalData()).toStrictEqual(loadedTokens);
    expect(errors).toStrictEqual(['Invalid filter']);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });
});
