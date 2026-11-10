import { AgentErrorContextMenuService } from '@services/context-menu/agents/agent-error-menu.service';
import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';

describe('AgentErrorContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new AgentErrorContextMenuService(permissionService),
      ['Delete Error'],
      ['Delete Errors']
    );
  });
});
