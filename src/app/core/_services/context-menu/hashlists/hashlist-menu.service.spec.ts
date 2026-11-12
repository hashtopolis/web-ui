import { HashListContextMenuService } from '@services/context-menu/hashlists/hashlist-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('HashListContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new HashListContextMenuService(permissionService),
      ['Edit Hashlist', 'Import Cracks', 'Export Cracks', 'Delete Hashlist', 'Archive Hashlist', 'Unarchive Hashlist'],
      ['Archive Hashlists', 'Delete Hashlists']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new HashListContextMenuService(permissionService));
  });
});
