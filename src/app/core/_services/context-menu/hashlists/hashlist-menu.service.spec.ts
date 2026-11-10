import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';
import { HashListContextMenuService } from '@services/context-menu/hashlists/hashlist-menu.service';

describe('HashListContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new HashListContextMenuService(permissionService),
      ['Edit Hashlist', 'Import Cracks', 'Export Cracks', 'Delete Hashlist', 'Archive Hashlist', 'Unarchive Hashlist'],
      ['Archive Hashlists', 'Delete Hashlists']
    );
  });
});
