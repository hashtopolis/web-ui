import { BackgroundJobContextMenuService } from '@services/context-menu/config/background-job-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('BackgroundJobContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new BackgroundJobContextMenuService(permissionService),
      ['Delete Background Job'],
      ['Delete Background Jobs']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new BackgroundJobContextMenuService(permissionService));
  });
});
