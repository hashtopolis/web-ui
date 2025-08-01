import { ContextMenuCondition, ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class NotificationsContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): NotificationsContextMenuService {
    const permUpdate: Array<PermissionValues> = [Perm.Notif.UPDATE];
    const permDelete: Array<PermissionValues> = [Perm.Notif.DELETE];

    const activateCondition: ContextMenuCondition = { key: 'isActive', value: false };
    const deactivateCondition: ContextMenuCondition = { key: 'isActive', value: true };

    this.addCtxDeactivateItem(RowActionMenuLabel.DEACTIVATE_NOTIFICATION, permUpdate, deactivateCondition);
    this.addCtxActivateItem(RowActionMenuLabel.ACTIVATE_NOTIFICATION, permUpdate, activateCondition);
    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_NOTIFICATION, permDelete);

    this.addBulkActivateItem(BulkActionMenuLabel.ACTIVATE_NOTIFICATION, permUpdate);
    this.addBulkDeactivateItem(BulkActionMenuLabel.ACTIVATE_NOTIFICATION, permUpdate);
    this.addBulkDeleteItem(BulkActionMenuLabel.DELETE_NOTIFICATIONS, permDelete);

    return this;
  }
}
