import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';
import { PreProContextMenuService } from '@services/context-menu/crackers/preprocessor-menu.service';

describe('PreProContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new PreProContextMenuService(permissionService),
      ['Edit Preprocessor', 'Delete Preprocessor'],
      ['Delete Preprocessors']
    );
  });
});
