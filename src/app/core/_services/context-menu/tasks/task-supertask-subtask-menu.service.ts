import { ContextMenuCondition, ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { RowActionMenuAction, RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class TaskSupertaskSubtaskContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  /**
   * Add context- and bulk menu fot task table
   */
  addContextMenu(): TaskSupertaskSubtaskContextMenuService {
    const permTaskUpdate: Array<PermissionValues> = [Perm.Task.UPDATE];
    const permTaskDelete: Array<PermissionValues> = [Perm.Task.DELETE];
    const permTaskCreate: Array<PermissionValues> = [Perm.Task.CREATE];
    const permPreTaskCreate: Array<PermissionValues> = [Perm.Pretask.CREATE];

    const isTaskCondition: ContextMenuCondition = { key: 'taskType', value: false };

    this.addCtxEditItem(RowActionMenuLabel.EDIT_TASK, RowActionMenuAction.EDIT_TASKS, permTaskUpdate, isTaskCondition);

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

    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_TASK, permTaskDelete);

    return this;
  }
}
