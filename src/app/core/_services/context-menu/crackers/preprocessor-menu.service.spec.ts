import { PreProContextMenuService } from '@services/context-menu/crackers/preprocessor-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('PreProContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new PreProContextMenuService(permissionService),
      ['Edit Preprocessor', 'Delete Preprocessor'],
      ['Delete Preprocessors']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new PreProContextMenuService(permissionService));
  });
});
