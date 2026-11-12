import { PreTaskContextMenuService } from '@services/context-menu/tasks/pretask-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('PreTaskContextMenuService', () => {
  it('configures the default delete actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new PreTaskContextMenuService(permissionService),
      ['Edit Pretask', 'Copy to Task', 'Copy to Pretask', 'Delete Pretask'],
      ['Delete Pretasks']
    );
  });

  it('omits the default actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new PreTaskContextMenuService(permissionService));
  });

  it('adds a pretask to a supertask when only the add option is enabled', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new PreTaskContextMenuService(permissionService, true, false),
      ['Add to supertask', 'Edit Pretask', 'Copy to Task', 'Copy to Pretask', 'Delete Pretask'],
      ['Add to supertask', 'Delete Pretasks']
    );
  });

  it('unassigns a pretask when only the unassign option is enabled', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new PreTaskContextMenuService(permissionService, false, true),
      ['Edit Pretask', 'Copy to Task', 'Copy to Pretask', 'Unassign Pretask'],
      ['Unassign Pretasks']
    );
  });

  it('includes both assignment actions when both options are enabled', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new PreTaskContextMenuService(permissionService, true, true),
      ['Add to supertask', 'Edit Pretask', 'Copy to Task', 'Copy to Pretask', 'Unassign Pretask'],
      ['Add to supertask', 'Unassign Pretasks']
    );
  });
});
