import { TaskAgentContextMenuService } from '@services/context-menu/tasks/task-agent-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('TaskAgentContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new TaskAgentContextMenuService(permissionService),
      ['Edit Agent', 'Deactivate Agent', 'Activate Agent', 'Unassign Agent'],
      ['Activate Agents', 'Deactivate Agents', 'Unassign agents']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new TaskAgentContextMenuService(permissionService));
  });
});
