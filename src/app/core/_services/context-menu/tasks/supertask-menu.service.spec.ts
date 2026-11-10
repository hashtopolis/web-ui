import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';
import { SuperTaskContextMenuService } from '@services/context-menu/tasks/supertask-menu.service';

describe('SuperTaskContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new SuperTaskContextMenuService(permissionService),
      ['Edit Supertask', 'Apply Hashlist', 'Delete Supertask'],
      ['Delete Supertasks']
    );
  });
});
