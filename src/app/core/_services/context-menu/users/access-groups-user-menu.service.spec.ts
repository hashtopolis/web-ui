import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';
import { AccessGroupsUserContextMenuService } from '@services/context-menu/users/access-groups-user-menu.service';

describe('AccessGroupsUserContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new AccessGroupsUserContextMenuService(permissionService),
      ['Remove User'],
      ['Remove users']
    );
  });
});
