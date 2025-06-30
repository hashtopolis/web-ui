import { ContextMenuCondition, ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionCheck, PermissionService } from '@services/permission/permission.service';

import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

export class TaskContextMenuService extends ContextMenuService {
  constructor(private permissionService: PermissionService) {
    super(permissionService);
  }

  addTaskContextMenu(): TaskContextMenuService {
    const permTaskUpdate: Array<PermissionCheck> = [{ resource: 'Task', type: 'UPDATE' }];
    const permTaskDelete: Array<PermissionCheck> = [{ resource: 'Task', type: 'DELETE' }];
    const permTaskCreate: Array<PermissionCheck> = [{ resource: 'Task', type: 'CREATE' }];
    const permPreTaskCreate: Array<PermissionCheck> = [{ resource: 'Pretask', type: 'CREATE' }];

    const isTaskCondition: ContextMenuCondition = { key: 'taskType', value: false };
    const isSuperTaskCondition: ContextMenuCondition = { key: 'taskType', value: true };
    const isArchiveCondition: ContextMenuCondition = { key: 'archive', value: false };
    const isUnArchiveCondition: ContextMenuCondition = { key: 'archive', value: true };

    this.addCtxEditItem(RowActionMenuLabel.EDIT_TASK, permTaskUpdate, isTaskCondition);
    this.addCtxEditItem(RowActionMenuLabel.EDIT_SUBTASKS, permTaskUpdate, isSuperTaskCondition);

    this.addCtxCopyMenuItem(RowActionMenuLabel.COPY_TO_TASK, permTaskCreate, isTaskCondition);
    this.addCtxCopyMenuItem(RowActionMenuLabel.COPY_TO_PRETASK, permPreTaskCreate, isTaskCondition);

    this.addCtxArchiveMenuItem(RowActionMenuLabel.ARCHIVE_TASK, permPreTaskCreate, isArchiveCondition);
    this.addCtxUnArchiveMenuItem(RowActionMenuLabel.ARCHIVE_TASK, permPreTaskCreate, isUnArchiveCondition);

    this.addCtxDeleteMenuItem(RowActionMenuLabel.DELETE_TASK, permTaskDelete);

    return this;
  }
}
