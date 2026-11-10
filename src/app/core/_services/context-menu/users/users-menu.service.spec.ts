import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';
import { UsersContextMenuService } from '@services/context-menu/users/users-menu.service';

describe('UsersContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new UsersContextMenuService(permissionService),
      ['Edit User', 'Activate User', 'Deactivate User', 'Delete User'],
      ['Activate Users', 'Deactivate Users', 'Delete Users']
    );
  });
});
