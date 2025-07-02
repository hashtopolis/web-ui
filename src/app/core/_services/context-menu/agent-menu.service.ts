import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

import { Perm, PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export class AgentMenuService extends ContextMenuService {
  constructor(override permissionService: PermissionService) {
    super(permissionService);
  }

  /**
   * Add context menu for all agent based tables
   * @return class instance for fluid API calls‚
   */
  addContextMenu(): AgentMenuService {
    const permAgentUpdate: Array<PermissionValues> = [Perm.Agent.UPDATE];
    const permAgentDelete: Array<PermissionValues> = [Perm.Agent.DELETE];
    const permAgentAssignmentCreate: Array<PermissionValues> = [Perm.AgentAssignment.CREATE];

    this.addCtxEditItem(RowActionMenuLabel.EDIT_AGENT, permAgentUpdate);
    this.addCtxDeactivateItem(RowActionMenuLabel.DEACTIVATE_AGENT, permAgentUpdate, {
      key: 'isActive',
      value: true
    });
    this.addCtxActivateItem(RowActionMenuLabel.ACTIVATE_AGENT, permAgentUpdate, { key: 'isActive', value: false });

    this.addBulkActivateItem(BulkActionMenuLabel.ACTIVATE_AGENTS, permAgentUpdate);
    this.addBulkDeactivateItem(BulkActionMenuLabel.DEACTIVATE_AGENTS, permAgentUpdate);

    this.addCtxDeleteItem(RowActionMenuLabel.UNASSIGN_AGENT, permAgentAssignmentCreate, {
      key: 'assignmentId',
      value: true
    });

    this.addCtxDeleteItem(RowActionMenuLabel.DELETE_AGENT, permAgentDelete, { key: 'assignmentId', value: false });
    this.addBulkDeleteItem(BulkActionMenuLabel.DELETE_AGENTS, permAgentDelete);

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
