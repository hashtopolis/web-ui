import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionCheck, PermissionService } from '@services/permission/permission.service';

import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

export class TaskContextMenuService extends ContextMenuService {
  constructor(private permissionService: PermissionService) {
    super(permissionService);
  }

  addTaskContextMenu(): TaskContextMenuService {
    return this;
  }
}
