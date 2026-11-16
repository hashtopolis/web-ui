import { AccessGroupsUserContextMenuService } from '@services/context-menu/users/access-groups-user-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('AccessGroupsUserContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new AccessGroupsUserContextMenuService(permissionService),
      ['Remove User'],
      ['Remove users']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration(
      (permissionService) => new AccessGroupsUserContextMenuService(permissionService)
    );
  });
});
