import { AgentBinariesMenuServiceContextMenuService } from '@services/context-menu/crackers/agent-binaries-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('AgentBinariesMenuServiceContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new AgentBinariesMenuServiceContextMenuService(permissionService),
      ['Edit Agent Binary', 'Download Agent Binary', 'Copy link Agent Binary', 'Delete Agent Binary'],
      ['Delete Agent Binaries']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration(
      (permissionService) => new AgentBinariesMenuServiceContextMenuService(permissionService)
    );
  });
});
