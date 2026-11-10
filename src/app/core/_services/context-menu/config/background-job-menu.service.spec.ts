import { BackgroundJobContextMenuService } from '@services/context-menu/config/background-job-menu.service';
import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';

describe('BackgroundJobContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new BackgroundJobContextMenuService(permissionService),
      ['Delete Background Job'],
      ['Delete Background Jobs']
    );
  });
});
