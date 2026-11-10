import { SERV } from '@services/main.config';

import { setupDatasource } from '@datasources/specs/datasource-test-setup-util';
import { VouchersDataSource } from '@datasources/vouchers.datasource';

describe('VouchersDataSource', () => {
  it('loads vouchers and passes an optional filter', () => {
    const { dataSource, service } = setupDatasource(VouchersDataSource);
    dataSource.loadAll({ field: 'redeemed', operator: 'eq' as never, value: false });
    const [resource, params] = service.getAll.mock.lastCall!;
    expect(resource).toBe(SERV.VOUCHER);
    expect(params.filter).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'redeemed', value: false })])
    );
  });
});
