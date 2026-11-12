import { AgentErrorContextMenuService } from '@services/context-menu/agents/agent-error-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('AgentErrorContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new AgentErrorContextMenuService(permissionService),
      ['Delete Error'],
      ['Delete Errors']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new AgentErrorContextMenuService(permissionService));
  });
});
