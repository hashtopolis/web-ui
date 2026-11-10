import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';
import { PermissionsContextMenuService } from '@services/context-menu/users/permissions-menu.service';

describe('PermissionsContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new PermissionsContextMenuService(permissionService),
      ['Edit Permission Group', 'Delete Permission Group'],
      ['Delete Permission Groups']
    );
  });
});
