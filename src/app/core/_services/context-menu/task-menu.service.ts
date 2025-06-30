import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionCheck, PermissionService } from '@services/permission/permission.service';

import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

export class TaskContextMenuService extends ContextMenuService {
  constructor(private permissionService: PermissionService) {
    super();
  }

  addTaskContextMenu(): TaskContextMenuService {
    const permissions: Array<PermissionCheck> = [
      { resource: 'Chunk', type: 'UPDATE' },
      { resource: 'Task', type: 'UPDATE' }
    ];

    this.permissionService.hasAllPermissions(permissions).subscribe((response) => {
      if (response == true) {
        this.addCtxResetMenuItem(RowActionMenuLabel.RESET_CHUNK);
      }
    });

    return this;
  }
}
