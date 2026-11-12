import { SuperHashListContextMenuService } from '@services/context-menu/hashlists/super-hashlist-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('SuperHashListContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new SuperHashListContextMenuService(permissionService),
      ['Edit Superhashlist', 'Import Cracks', 'Export Cracks', 'Delete Superhashlist'],
      ['Delete Super-Hashlist']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new SuperHashListContextMenuService(permissionService));
  });
});
