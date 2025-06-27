import { Injectable } from '@angular/core';

import { ContextMenuService } from '@services/context-menu/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { BulkActionMenuLabel } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

@Injectable({
  providedIn: 'root'
})
export class AgentContextMenuService {
  constructor(
    private contextMenuService: ContextMenuService,
    private permissionService: PermissionService
  ) {}

  /**
   * Add context menu for all agent based tables
   */
  addAgentContextMenu(): void {
    this.permissionService.hasPermission('Agent', 'UPDATE').subscribe((response) => {
      if (response) {
        this.contextMenuService.addCtxEditItem(RowActionMenuLabel.EDIT_AGENT);
        this.contextMenuService.addCtxDeactivateMenuItem(RowActionMenuLabel.DEACTIVATE_AGENT, 'isActive', true);
        this.contextMenuService.addCtxActivateMenuItem(RowActionMenuLabel.ACTIVATE_AGENT, 'isActive', false);
        this.contextMenuService.addCtxDeleteMenuItem(RowActionMenuLabel.UNASSIGN_AGENT, 'assignmentId', true);

        this.contextMenuService.addBulkActivateMenuItem(BulkActionMenuLabel.ACTIVATE_AGENTS);
        this.contextMenuService.addBulkDeactivateMenuItem(BulkActionMenuLabel.DEACTIVATE_AGENTS);
      }
    });

    this.permissionService.hasPermission('Agent', 'DELETE').subscribe((response) => {
      if (response) {
        this.contextMenuService.addCtxDeleteMenuItem(RowActionMenuLabel.DELETE_AGENT, 'assignmentId', false);
        this.contextMenuService.addBulkDeleteMenuItem(BulkActionMenuLabel.DELETE_AGENTS);
      }
    });
  }
}
