import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';
import { AccessGroupsContextMenuService } from '@services/context-menu/users/access-groups-menu.service';

describe('AccessGroupsContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new AccessGroupsContextMenuService(permissionService),
      ['Edit Access Group', 'Delete Access Group'],
      ['Delete Access Groups']
    );
  });
});
