import { UsersContextMenuService } from '@services/context-menu/users/users-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('UsersContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new UsersContextMenuService(permissionService),
      ['Edit User', 'Activate User', 'Deactivate User', 'Delete User'],
      ['Activate Users', 'Deactivate Users', 'Delete Users']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new UsersContextMenuService(permissionService));
  });
});
