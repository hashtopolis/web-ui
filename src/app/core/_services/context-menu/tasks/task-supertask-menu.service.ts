import { ContextMenuCondition } from '@services/context-menu/base/context-menu.service';
import { PreTaskContextMenuService } from '@services/context-menu/tasks/pretask-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class TaskSuperTaskContextMenuService extends PreTaskContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  override addContextMenu(): TaskSuperTaskContextMenuService {
    super.addContextMenu();

    const permUpdate: Array<PermissionValues> = [Perm.Pretask.UPDATE, Perm.SuperTask.UPDATE];

    const isArchiveCondition: ContextMenuCondition = { key: 'isArchived', value: false };
    const isUnArchiveCondition: ContextMenuCondition = { key: 'isArchived', value: true };

    this.addCtxArchiveItem(RowActionMenuLabel.ARCHIVE_PRETASK, permUpdate, isArchiveCondition);
    this.addCtxUnArchiveItem(RowActionMenuLabel.UNARCHIVE_PRETASK, permUpdate, isUnArchiveCondition);

    this.addBulkArchiveItem(BulkActionMenuLabel.ARCHIVE_PRETASKS, permUpdate);

    return this;
  }
}
