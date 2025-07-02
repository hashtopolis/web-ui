import { ContextMenuCondition, ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class PreTaskContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): PreTaskContextMenuService {
    const permUpdate: Array<PermissionValues> = [Perm.Pretask.UPDATE];
    const permDelete: Array<PermissionValues> = [Perm.Pretask.DELETE];
    const permCopyTask: Array<PermissionValues> = [Perm.Pretask.READ, Perm.Task.CREATE];
    const permCopyPreTask: Array<PermissionValues> = [Perm.Pretask.READ, Perm.Pretask.CREATE];

    const deleteCondition: ContextMenuCondition = { key: 'editst', value: false };
    const unassignCondition: ContextMenuCondition = { key: 'editst', value: true };

    this.addCtxEditItem(RowActionMenuLabel.EDIT_PRETASK, permUpdate);
    this.addCtxCopyItem(RowActionMenuLabel.COPY_TO_TASK, permCopyTask);
    this.addCtxCopyItem(RowActionMenuLabel.COPY_TO_PRETASK, permCopyPreTask);
    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_PRETASK, permDelete, deleteCondition);
    this.addCtxDeleteItem(RowActionMenuLabel.UNASSIGN_PRETASK, permDelete, unassignCondition);

    this.addBulkDeleteItem(BulkActionMenuLabel.DELETE_PRETASKS, permDelete);

    return this;
  }
}
