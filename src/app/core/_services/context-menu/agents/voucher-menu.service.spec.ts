import { VoucherContextMenuService } from '@services/context-menu/agents/voucher-menu.service';
import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';

describe('VoucherContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new VoucherContextMenuService(permissionService),
      ['Delete Voucher'],
      ['Delete Vouchers']
    );
  });
});
