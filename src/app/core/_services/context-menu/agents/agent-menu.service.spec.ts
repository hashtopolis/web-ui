import { AgentMenuService } from '@services/context-menu/agents/agent-menu.service';
import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';

describe('AgentMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new AgentMenuService(permissionService),
      ['Edit Agent', 'Deactivate Agent', 'Activate Agent', 'Unassign Agent', 'Delete Agent'],
      ['Activate Agents', 'Deactivate Agents', 'Delete Agents']
    );
  });
});
