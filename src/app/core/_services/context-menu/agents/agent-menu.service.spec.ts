import { AgentMenuService } from '@services/context-menu/agents/agent-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('AgentMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new AgentMenuService(permissionService),
      ['Edit Agent', 'Deactivate Agent', 'Activate Agent', 'Unassign Agent', 'Delete Agent'],
      ['Activate Agents', 'Deactivate Agents', 'Delete Agents']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new AgentMenuService(permissionService));
  });
});
