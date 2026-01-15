import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction, RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class PreTaskContextMenuService extends ContextMenuService {
  constructor(
    override permissionService: PermissionService,

    /* Flag indicating whether the "Add Pretask to Supertask" option should be included */
    private addOption = false,

    /* Flag indicating whether the "Unassign Pretask from Supertask" option should be included */
    private unassignOption = false
  ) {
    super(permissionService);
  }

  addContextMenu(): PreTaskContextMenuService {
    const permUpdate: Array<PermissionValues> = [Perm.Pretask.UPDATE];
    const permDelete: Array<PermissionValues> = [Perm.Pretask.DELETE];
    const permCopyTask: Array<PermissionValues> = [Perm.Pretask.READ, Perm.Task.CREATE];
    const permCopyPreTask: Array<PermissionValues> = [Perm.Pretask.READ, Perm.Pretask.CREATE];

    if (this.addOption) {
      this.addCtxAddItem(RowActionMenuLabel.ADD_PRETASK_TO_SUPERTASK, RowActionMenuAction.ADD, permUpdate);
      this.addBulkAddItem(BulkActionMenuLabel.ADD_PRETASK_TO_SUPERTASK, permUpdate);
    }

    this.addCtxEditItem(RowActionMenuLabel.EDIT_PRETASK, RowActionMenuAction.EDIT, permUpdate);
    this.addCtxCopyItem(RowActionMenuLabel.COPY_TO_TASK, RowActionMenuAction.COPY_TO_TASK, permCopyTask);
    this.addCtxCopyItem(RowActionMenuLabel.COPY_TO_PRETASK, RowActionMenuAction.COPY_TO_PRETASK, permCopyPreTask);
    if (this.unassignOption) {
      this.addCtxDeleteItem(RowActionMenuLabel.UNASSIGN_PRETASK, permDelete);
      this.addBulkDeleteItem(BulkActionMenuLabel.UNASSIGN_PRETASKS, permDelete);
    } else {
      this.addCtxDeleteItem(RowActionMenuLabel.DELETE_PRETASK, permDelete);
      this.addBulkDeleteItem(BulkActionMenuLabel.DELETE_PRETASKS, permDelete);
    }
    return this;
  }
}
