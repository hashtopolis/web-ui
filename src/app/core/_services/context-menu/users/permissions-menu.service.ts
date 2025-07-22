import { ContextMenuCondition, ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction, RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class PermissionsContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): PermissionsContextMenuService {
    const permUpdate: Array<PermissionValues> = [Perm.RightGroup.UPDATE];
    const permDelete: Array<PermissionValues> = [Perm.RightGroup.DELETE];

    const deleteCondition: ContextMenuCondition = { key: 'userMembers', value: false };

    this.addCtxEditItem(RowActionMenuLabel.EDIT_PERMISSION, RowActionMenuAction.EDIT, permUpdate);
    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_PERMISSION, permDelete, deleteCondition);

    this.addBulkDeleteItem(BulkActionMenuLabel.DELETE_PERMISSIONS, permDelete);

    return this;
  }
}
