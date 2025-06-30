import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

export class TaskContextMenuService extends ContextMenuService {
  constructor(private permissionService: PermissionService) {
    super(permissionService);
  }

  addTaskContextMenu(): TaskContextMenuService {
    return this;
  }
}
