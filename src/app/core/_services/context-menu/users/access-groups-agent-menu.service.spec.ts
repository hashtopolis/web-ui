import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';
import { AccessGroupsAgentContextMenuService } from '@services/context-menu/users/access-groups-agent-menu.service';

describe('AccessGroupsAgentContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new AccessGroupsAgentContextMenuService(permissionService),
      ['Remove Agent'],
      ['Remove agents']
    );
  });
});
