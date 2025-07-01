import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';
import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class AgentMenuService extends ContextMenuService {
  constructor(readonly permissionService: PermissionService) {
    super(permissionService);
  }

  /**
   * Add context menu for all agent based tables
   * @return class instance for fluid API calls‚
   */
  addAgentContextMenu(): AgentMenuService {
    const permAgentUpdate: Array<PermissionValues> = [Perm.Agent.UPDATE];
    const permAgentDelete: Array<PermissionValues> = [Perm.Agent.DELETE];
    const permAgentAssignmentCreate: Array<PermissionValues> = [Perm.AgentAssignment.CREATE];

    this.addCtxEditItem(RowActionMenuLabel.EDIT_AGENT, permAgentUpdate);
    this.addCtxDeactivateMenuItem(RowActionMenuLabel.DEACTIVATE_AGENT, permAgentUpdate, {
      key: 'isActive',
      value: true
    });
    this.addCtxActivateMenuItem(RowActionMenuLabel.ACTIVATE_AGENT, permAgentUpdate, { key: 'isActive', value: false });

    this.addBulkActivateMenuItem(BulkActionMenuLabel.ACTIVATE_AGENTS, permAgentUpdate);
    this.addBulkDeactivateMenuItem(BulkActionMenuLabel.DEACTIVATE_AGENTS, permAgentUpdate);

    this.addCtxDeleteMenuItem(RowActionMenuLabel.UNASSIGN_AGENT, permAgentAssignmentCreate, {
      key: 'assignmentId',
      value: true
    });

    this.addCtxDeleteMenuItem(RowActionMenuLabel.DELETE_AGENT, permAgentDelete, { key: 'assignmentId', value: false });
    this.addBulkDeleteMenuItem(BulkActionMenuLabel.DELETE_AGENTS, permAgentDelete);

    return this;
  }

  /*
  addAgentAccessGroupMenu(): AgentMenuService {
    this.addCtxDeleteMenuItem(RowActionMenuLabel.REMOVE_ACCESSGROUP_AGENT,);
    this.addBulkDeleteMenuItem(BulkActionMenuLabel.REMOVE_ACCESSGROUP_AGENTS);

    return this;
  }
  */
}
