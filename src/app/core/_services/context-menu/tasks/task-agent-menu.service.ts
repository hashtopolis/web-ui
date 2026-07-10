import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction, RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class TaskAgentContextMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  addContextMenu(): TaskAgentContextMenuService {
    const permAgentUpdate: Array<PermissionValues> = [Perm.Agent.UPDATE];
    this.addBulkActivateItem(BulkActionMenuLabel.ACTIVATE_AGENTS, permAgentUpdate);
    this.addBulkDeactivateItem(BulkActionMenuLabel.DEACTIVATE_AGENTS, permAgentUpdate);
    this.addBulkUnassignItem(BulkActionMenuLabel.UNASSIGN_AGENTS, permAgentUpdate);

    this.addCtxEditItem(RowActionMenuLabel.EDIT_AGENT, RowActionMenuAction.EDIT, permAgentUpdate);
    this.addCtxDeactivateItem(RowActionMenuLabel.DEACTIVATE_AGENT, permAgentUpdate, {
      key: 'isActive',
      value: true
    });
    this.addCtxActivateItem(RowActionMenuLabel.ACTIVATE_AGENT, permAgentUpdate, {
      key: 'isActive',
      value: false
    });
    this.addCtxUnassignItem(RowActionMenuLabel.UNASSIGN_AGENT, permAgentUpdate);

    return this;
  }
}
