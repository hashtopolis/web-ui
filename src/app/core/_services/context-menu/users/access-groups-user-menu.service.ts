import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class AccessGroupsUserContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): AccessGroupsUserContextMenuService {
    const permUpdate: Array<PermissionValues> = [Perm.RightGroup.UPDATE];

    this.addCtxDeleteItem(RowActionMenuLabel.REMOVE_ACCESSGROUP_USER, permUpdate);
    this.addBulkDeleteItem(BulkActionMenuLabel.REMOVE_ACCESSGROUP_USERS, permUpdate);

    return this;
  }
}
