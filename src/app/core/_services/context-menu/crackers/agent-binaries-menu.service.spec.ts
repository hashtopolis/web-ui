import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';
import { AgentBinariesMenuServiceContextMenuService } from '@services/context-menu/crackers/agent-binaries-menu.service';

describe('AgentBinariesMenuServiceContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new AgentBinariesMenuServiceContextMenuService(permissionService),
      ['Edit Agent Binary', 'Download Agent Binary', 'Copy link Agent Binary', 'Delete Agent Binary'],
      ['Delete Agent Binaries']
    );
  });
});
