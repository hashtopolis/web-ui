import { AccessGroupsContextMenuService } from '@services/context-menu/users/access-groups-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('AccessGroupsContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new AccessGroupsContextMenuService(permissionService),
      ['Edit Access Group', 'Delete Access Group'],
      ['Delete Access Groups']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new AccessGroupsContextMenuService(permissionService));
  });
});
