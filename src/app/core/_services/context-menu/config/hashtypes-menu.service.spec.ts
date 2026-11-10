import { HashTypesContextMenuService } from '@services/context-menu/config/hashtypes-menu.service';
import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';

describe('HashTypesContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new HashTypesContextMenuService(permissionService),
      ['Edit Hashtype', 'Delete Hashtype'],
      ['Delete Hashtypes']
    );
  });
});
