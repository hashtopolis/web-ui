import { ContextMenuCondition, ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction, RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class UsersContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): UsersContextMenuService {
    const permUpdate: Array<PermissionValues> = [Perm.User.UPDATE];
    const permDelete: Array<PermissionValues> = [Perm.User.DELETE];

    const isActivateCondition: ContextMenuCondition = { key: 'isValid', value: false };
    const isDeactivateCondition: ContextMenuCondition = { key: 'isValid', value: true };

    this.addCtxEditItem(RowActionMenuLabel.EDIT_USER, RowActionMenuAction.EDIT, permUpdate);
    this.addCtxActivateItem(RowActionMenuLabel.ACTIVATE_USER, permUpdate, isActivateCondition);
    this.addCtxDeactivateItem(RowActionMenuLabel.DEACTIVATE_USER, permUpdate, isDeactivateCondition);
    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_USER, permDelete);

    this.addBulkActivateItem(BulkActionMenuLabel.ACTIVATE_USERS, permUpdate);
    this.addBulkDeactivateItem(BulkActionMenuLabel.DEACTIVATE_USERS, permUpdate);
    this.addBulkDeleteItem(BulkActionMenuLabel.DELETE_USERS, permDelete);

    return this;
  }
}
