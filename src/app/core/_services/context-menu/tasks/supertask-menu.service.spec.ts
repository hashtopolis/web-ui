import { SuperTaskContextMenuService } from '@services/context-menu/tasks/supertask-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('SuperTaskContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new SuperTaskContextMenuService(permissionService),
      ['Edit Supertask', 'Apply Hashlist', 'Delete Supertask'],
      ['Delete Supertasks']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new SuperTaskContextMenuService(permissionService));
  });
});
