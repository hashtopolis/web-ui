import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class HealthCheckContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): HealthCheckContextMenuService {
    const permRead: Array<PermissionValues> = [Perm.Chunk.READ];
    const permDelete: Array<PermissionValues> = [Perm.Chunk.DELETE];

    this.addCtxViewItem(RowActionMenuLabel.VIEW_HEALTHCHECK, permRead);
    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_HEALTHCHECK, permDelete);

    this.addBulkDeleteItem(BulkActionMenuLabel.DELETE_HEALTHCHECKS, permDelete);

    return this;
  }
}
