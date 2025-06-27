import { ContextMenuService } from '@services/context-menu/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

export class AgentMenuService extends ContextMenuService {
  constructor(private permissionService: PermissionService) {
    super();
  }

  /**
   * Add context menu for all agent based tables
   * @return class instance for fluid API calls
   */
  addAgentContextMenu(): AgentMenuService {
    this.permissionService.hasPermission('Agent', 'UPDATE').subscribe((response) => {
      if (response) {
        this.addCtxEditItem(RowActionMenuLabel.EDIT_AGENT);
        this.addCtxDeactivateMenuItem(RowActionMenuLabel.DEACTIVATE_AGENT, 'isActive', true);
        this.addCtxActivateMenuItem(RowActionMenuLabel.ACTIVATE_AGENT, 'isActive', false);
        this.addCtxDeleteMenuItem(RowActionMenuLabel.UNASSIGN_AGENT, 'assignmentId', true);

        this.addBulkActivateMenuItem(BulkActionMenuLabel.ACTIVATE_AGENTS);
        this.addBulkDeactivateMenuItem(BulkActionMenuLabel.DEACTIVATE_AGENTS);
      }
    });

    this.permissionService.hasPermission('Agent', 'DELETE').subscribe((response) => {
      if (response) {
        this.addCtxDeleteMenuItem(RowActionMenuLabel.DELETE_AGENT, 'assignmentId', false);
        this.addBulkDeleteMenuItem(BulkActionMenuLabel.DELETE_AGENTS);
      }
    });

    return this;
  }

  addAgentAccessGroupMenu(): AgentMenuService {
    this.addCtxDeleteMenuItem(RowActionMenuLabel.REMOVE_ACCESSGROUP_AGENT);
    this.addBulkDeleteMenuItem(BulkActionMenuLabel.REMOVE_ACCESSGROUP_AGENTS);

    return this;
  }
}
