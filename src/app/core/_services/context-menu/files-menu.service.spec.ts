import { FilesContextMenuService } from '@services/context-menu/files-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('FilesContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new FilesContextMenuService(permissionService),
      ['Edit File', 'Preview File', 'Download File', 'Set Secret', 'Unset Secret', 'Recount Lines', 'Delete File'],
      ['Delete Files']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new FilesContextMenuService(permissionService));
  });
});
