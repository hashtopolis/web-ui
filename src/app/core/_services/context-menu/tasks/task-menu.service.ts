import { ContextMenuCondition, ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction, RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class TaskContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  /**
   * Add context- and bulk menu fot task table
   */
  addContextMenu(): TaskContextMenuService {
    const permTaskUpdate: Array<PermissionValues> = [Perm.Task.UPDATE];
    const permTaskDelete: Array<PermissionValues> = [Perm.Task.DELETE];
    const permTaskCreate: Array<PermissionValues> = [Perm.Task.CREATE];
    const permPreTaskCreate: Array<PermissionValues> = [Perm.Pretask.CREATE];

    const isTaskCondition: ContextMenuCondition = { key: 'taskType', value: false };
    const isSuperTaskCondition: ContextMenuCondition = { key: 'taskType', value: true };
    const isArchiveCondition: ContextMenuCondition = { key: 'isArchived', value: false };
    const isUnArchiveCondition: ContextMenuCondition = { key: 'isArchived', value: true };

    this.addCtxEditItem(RowActionMenuLabel.EDIT_TASK, RowActionMenuAction.EDIT_TASKS, permTaskUpdate, isTaskCondition);
    this.addCtxEditItem(
      RowActionMenuLabel.SHOW_SUBTASK,
      RowActionMenuAction.SHOW_SUBTASKS,
      permTaskUpdate,
      isSuperTaskCondition
    );

    this.addCtxCopyItem(
      RowActionMenuLabel.COPY_TO_TASK,
      RowActionMenuAction.COPY_TO_TASK,
      permTaskCreate,
      isTaskCondition
    );
    this.addCtxCopyItem(
      RowActionMenuLabel.COPY_TO_PRETASK,
      RowActionMenuAction.COPY_TO_PRETASK,
      permPreTaskCreate,
      isTaskCondition
    );

    this.addCtxArchiveItem(RowActionMenuLabel.ARCHIVE_TASK, permTaskUpdate, isArchiveCondition);
    this.addCtxUnArchiveItem(RowActionMenuLabel.UNARCHIVE_TASK, permTaskUpdate, isUnArchiveCondition);

    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_TASK, permTaskDelete);

    this.addBulkArchiveItem(BulkActionMenuLabel.ARCHIVE_TASKS, permTaskUpdate, isArchiveCondition);
    this.addBulkDeleteItem(BulkActionMenuLabel.DELETE_TASKS, permTaskDelete);

    return this;
  }
}
