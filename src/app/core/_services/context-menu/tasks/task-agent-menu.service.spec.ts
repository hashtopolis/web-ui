import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';
import { TaskAgentContextMenuService } from '@services/context-menu/tasks/task-agent-menu.service';

describe('TaskAgentContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new TaskAgentContextMenuService(permissionService),
      ['Edit Agent', 'Deactivate Agent', 'Activate Agent', 'Unassign Agent'],
      ['Activate Agents', 'Deactivate Agents', 'Unassign agents']
    );
  });
});
