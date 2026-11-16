import { PermissionsContextMenuService } from '@services/context-menu/users/permissions-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('PermissionsContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new PermissionsContextMenuService(permissionService),
      ['Edit Permission Group', 'Delete Permission Group'],
      ['Delete Permission Groups']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new PermissionsContextMenuService(permissionService));
  });
});
