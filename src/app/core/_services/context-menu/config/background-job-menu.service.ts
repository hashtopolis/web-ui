import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class BackgroundJobContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): BackgroundJobContextMenuService {
    const permDelete: Array<PermissionValues> = [Perm.BackgroundJob.DELETE];

    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_BACKGROUND_JOB, permDelete);
    this.addBulkDeleteItem(BulkActionMenuLabel.DELETE_BACKGROUND_JOBS, permDelete);

    return this;
  }
}
