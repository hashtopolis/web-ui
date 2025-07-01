import { ContextMenuCondition, ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';
import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class TaskContextMenuService extends ContextMenuService {
  constructor(private permissionService: PermissionService) {
    super(permissionService);
  }

  /**
   * Add context- and bulk menu fot task table
   */
  addTaskContextMenu(): TaskContextMenuService {
    const permTaskUpdate: Array<PermissionValues> = [Perm.Task.UPDATE];
    const permTaskDelete: Array<PermissionValues> = [Perm.Task.DELETE];
    const permTaskCreate: Array<PermissionValues> = [Perm.Task.CREATE];
    const permPreTaskCreate: Array<PermissionValues> = [Perm.Pretask.CREATE];

    const isTaskCondition: ContextMenuCondition = { key: 'taskType', value: false };
    const isSuperTaskCondition: ContextMenuCondition = { key: 'taskType', value: true };
    const isArchiveCondition: ContextMenuCondition = { key: 'isArchived', value: false };
    const isUnArchiveCondition: ContextMenuCondition = { key: 'isArchived', value: true };

    this.addCtxEditItem(RowActionMenuLabel.EDIT_TASK, permTaskUpdate, isTaskCondition);
    this.addCtxEditItem(RowActionMenuLabel.EDIT_SUBTASKS, permTaskUpdate, isSuperTaskCondition);

    this.addCtxCopyMenuItem(RowActionMenuLabel.COPY_TO_TASK, permTaskCreate, isTaskCondition);
    this.addCtxCopyMenuItem(RowActionMenuLabel.COPY_TO_PRETASK, permPreTaskCreate, isTaskCondition);

    this.addCtxArchiveMenuItem(RowActionMenuLabel.ARCHIVE_TASK, permTaskUpdate, isArchiveCondition);
    this.addCtxUnArchiveMenuItem(RowActionMenuLabel.UNARCHIVE_TASK, permTaskUpdate, isUnArchiveCondition);

    this.addCtxDeleteMenuItem(RowActionMenuLabel.DELETE_TASK, permTaskDelete);

    this.addBulkArchiveMenuItem(BulkActionMenuLabel.ARCHIVE_TASKS, permTaskUpdate, isArchiveCondition);
    this.addBulkDeleteMenuItem(BulkActionMenuLabel.DELETE_TASKS, permTaskDelete);

    return this;
  }
}
