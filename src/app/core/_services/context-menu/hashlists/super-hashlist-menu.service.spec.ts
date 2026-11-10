import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';
import { SuperHashListContextMenuService } from '@services/context-menu/hashlists/super-hashlist-menu.service';

describe('SuperHashListContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new SuperHashListContextMenuService(permissionService),
      ['Edit Superhashlist', 'Import Cracks', 'Export Cracks', 'Delete Superhashlist'],
      ['Delete Super-Hashlist']
    );
  });
});
