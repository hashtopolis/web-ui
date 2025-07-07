import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class AccessGroupsAgentContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): AccessGroupsAgentContextMenuService {
    const permUpdate: Array<PermissionValues> = [Perm.RightGroup.UPDATE];

    this.addCtxDeleteItem(RowActionMenuLabel.REMOVE_ACCESSGROUP_AGENT, permUpdate);
    this.addBulkDeleteItem(BulkActionMenuLabel.REMOVE_ACCESSGROUP_AGENTS, permUpdate);

    return this;
  }
}
