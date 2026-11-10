import { expectContextMenuConfiguration } from '@services/context-menu/context-menu-test-helpers';
import { NotificationsContextMenuService } from '@services/context-menu/notifications-menu.service';

describe('NotificationsContextMenuService', () => {
  it('configures the row and bulk actions and filters them by permission', () => {
    expectContextMenuConfiguration(
      (permissionService) => new NotificationsContextMenuService(permissionService),
      ['Deactivate Notification', 'Activate Notification', 'Delete Notification'],
      ['Activate Notification', 'Deactivate Notification', 'Delete Notification']
    );
  });
});
