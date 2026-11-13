import { HashTypesContextMenuService } from '@services/context-menu/config/hashtypes-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('HashTypesContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new HashTypesContextMenuService(permissionService),
      ['Edit Hashtype', 'Delete Hashtype'],
      ['Delete Hashtypes']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new HashTypesContextMenuService(permissionService));
  });
});
