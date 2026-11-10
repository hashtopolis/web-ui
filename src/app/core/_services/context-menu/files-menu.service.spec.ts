import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';
import { FilesContextMenuService } from '@services/context-menu/files-menu.service';

describe('FilesContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new FilesContextMenuService(permissionService),
      ['Edit File', 'Preview File', 'Download File', 'Set Secret', 'Unset Secret', 'Recount Lines', 'Delete File'],
      ['Delete Files']
    );
  });
});
