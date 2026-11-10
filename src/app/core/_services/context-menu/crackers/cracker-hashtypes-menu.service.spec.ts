import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';
import { CrackerHashtypesContextMenuService } from '@services/context-menu/crackers/cracker-hashtypes-menu.service';

describe('CrackerHashtypesContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new CrackerHashtypesContextMenuService(permissionService),
      ['Remove Hashtype'],
      ['Remove hashtypes']
    );
  });
});
