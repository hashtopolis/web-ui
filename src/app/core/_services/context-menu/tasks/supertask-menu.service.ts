import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction, RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class SuperTaskContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): SuperTaskContextMenuService {
    const permUpdate: Array<PermissionValues> = [Perm.SuperTask.UPDATE];
    const permDelete: Array<PermissionValues> = [Perm.SuperTask.DELETE];

    this.addCtxEditItem(RowActionMenuLabel.EDIT_SUPERTASK, RowActionMenuAction.EDIT, permUpdate);
    this.addCtxCopyItem(RowActionMenuLabel.APPLY_HASHLIST, RowActionMenuAction.APPLY_TO_HASHLIST, permUpdate);
    this.addCtxEditItem(RowActionMenuLabel.EDIT_SUBTASKS, RowActionMenuAction.EDIT_SUBTASKS, permUpdate);
    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_SUPERTASK, permDelete);

    this.addBulkDeleteItem(BulkActionMenuLabel.DELETE_SUPERTASKS, permDelete);

    return this;
  }
}
