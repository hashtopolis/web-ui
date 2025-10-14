import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class AgentErrorContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): AgentErrorContextMenuService {
    const permUpdate: Array<PermissionValues> = [Perm.Agent.UPDATE];

    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_ERROR, permUpdate);
    this.addBulkDeleteItem(BulkActionMenuLabel.DELETE_ERRORS, permUpdate);

    return this;
  }
}
