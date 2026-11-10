import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';
import { CrackersContextMenuService } from '@services/context-menu/crackers/crackers-menu.service';

describe('CrackersContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new CrackersContextMenuService(permissionService),
      ['Add Version', 'Delete Cracker'],
      ['Delete Crackers']
    );
  });
});
