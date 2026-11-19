import { VoucherContextMenuService } from '@services/context-menu/agents/voucher-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('VoucherContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new VoucherContextMenuService(permissionService),
      ['Delete Voucher'],
      ['Delete Vouchers']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new VoucherContextMenuService(permissionService));
  });
});
