import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction, RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class AccessGroupsContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): AccessGroupsContextMenuService {
    const permUpdate: Array<PermissionValues> = [Perm.GroupAccess.UPDATE];
    const permDelete: Array<PermissionValues> = [Perm.GroupAccess.UPDATE];

    this.addCtxEditItem(RowActionMenuLabel.EDIT_ACCESSGROUP, RowActionMenuAction.EDIT, permUpdate);
    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_ACCESSGROUP, permDelete);

    this.addBulkDeleteItem(BulkActionMenuLabel.DELETE_ACCESSGROUPS, permDelete);

    return this;
  }
}
