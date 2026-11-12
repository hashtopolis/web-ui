import { AccessGroupsAgentContextMenuService } from '@services/context-menu/users/access-groups-agent-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('AccessGroupsAgentContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new AccessGroupsAgentContextMenuService(permissionService),
      ['Remove Agent'],
      ['Remove agents']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration(
      (permissionService) => new AccessGroupsAgentContextMenuService(permissionService)
    );
  });
});
