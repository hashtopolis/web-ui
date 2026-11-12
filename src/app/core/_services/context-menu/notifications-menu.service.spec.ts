import { NotificationsContextMenuService } from '@services/context-menu/notifications-menu.service';

import {
  expectAllowedContextMenuConfiguration,
  expectDeniedContextMenuConfiguration
} from '@src/app/testing/context-menu-test-helpers';

describe('NotificationsContextMenuService', () => {
  it('adds the configured row and bulk actions when permitted', () => {
    expectAllowedContextMenuConfiguration(
      (permissionService) => new NotificationsContextMenuService(permissionService),
      ['Deactivate Notification', 'Activate Notification', 'Delete Notification'],
      ['Activate Notification', 'Deactivate Notification', 'Delete Notification']
    );
  });

  it('omits row and bulk actions when permission is denied', () => {
    expectDeniedContextMenuConfiguration((permissionService) => new NotificationsContextMenuService(permissionService));
  });
});
