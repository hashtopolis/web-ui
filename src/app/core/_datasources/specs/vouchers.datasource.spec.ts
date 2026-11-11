import { throwError } from 'rxjs';

import { SERV } from '@services/main.config';

import { setupDatasource } from '@datasources/specs/datasource-test-setup-util';
import { VouchersDataSource } from '@datasources/vouchers.datasource';

describe('VouchersDataSource', () => {
  it('loads vouchers and passes an optional filter', () => {
    const { dataSource, service } = setupDatasource(VouchersDataSource);
    dataSource.loadAll({ field: 'redeemed', operator: 'eq' as never, value: false });
    const [resource, params] = service.getAll.mock.lastCall!;
    expect(resource).toBe(SERV.VOUCHER);
    expect(params!.filter).toStrictEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'redeemed', value: false })])
    );
  });

  it('clears selection and reloads vouchers', () => {
    const { dataSource, service } = setupDatasource(VouchersDataSource);
    dataSource.selection.select({} as never);

    dataSource.reload();

    expect(dataSource.selection.hasValue()).toBe(false);
    expect(service.getAll).toHaveBeenCalledWith(SERV.VOUCHER, expect.anything());
  });

  it('keeps existing vouchers and ends loading when the request fails', () => {
    const { dataSource, service } = setupDatasource(VouchersDataSource);
    const row = { id: 9 } as never;
    dataSource.setData([row]);
    service.getAll.mockReturnValue(throwError(() => new Error('request failed')));

    dataSource.loadAll();

    expect(dataSource.getOriginalData()).toStrictEqual([row]);
    expect(dataSource['loadingSubject'].getValue()).toBe(false);
  });
});
