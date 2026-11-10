import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';
import { PreTaskContextMenuService } from '@services/context-menu/tasks/pretask-menu.service';

describe('PreTaskContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new PreTaskContextMenuService(permissionService),
      ['Edit Pretask', 'Copy to Task', 'Copy to Pretask', 'Delete Pretask'],
      ['Delete Pretasks']
    );
  });

  it('includes assignment actions when both options are enabled', () => {
    expectContextMenuConfiguration(
      (permissionService) => new PreTaskContextMenuService(permissionService, true, true),
      ['Add to supertask', 'Edit Pretask', 'Copy to Task', 'Copy to Pretask', 'Unassign Pretask'],
      ['Add to supertask', 'Unassign Pretasks']
    );
  });
});
