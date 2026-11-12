import { CrackersContextMenuService } from '@services/context-menu/crackers/crackers-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('CrackersContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new CrackersContextMenuService(permissionService),
      ['Add Version', 'Delete Cracker'],
      ['Delete Crackers']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new CrackersContextMenuService(permissionService));
  });
});
