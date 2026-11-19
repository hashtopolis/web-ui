import { CrackerHashtypesContextMenuService } from '@services/context-menu/crackers/cracker-hashtypes-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('CrackerHashtypesContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new CrackerHashtypesContextMenuService(permissionService),
      ['Remove Hashtype'],
      ['Remove hashtypes']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration(
      (permissionService) => new CrackerHashtypesContextMenuService(permissionService)
    );
  });
});
