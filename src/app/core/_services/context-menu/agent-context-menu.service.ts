import { Injectable } from '@angular/core';

import { ContextMenuService } from '@services/context-menu/context-menu.service';
import { PermissionService } from '@services/permission/permission.service';

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
        this.contextMenuService.addEditItem(RowActionMenuLabel.EDIT_AGENT);
        this.contextMenuService.addDeactivateMenuItem(RowActionMenuLabel.DEACTIVATE_AGENT, 'isActive', true);
        this.contextMenuService.addActivateMenuItem(RowActionMenuLabel.ACTIVATE_AGENT, 'isActive', false);
        this.contextMenuService.addDeleteMenuItem(RowActionMenuLabel.UNASSIGN_AGENT, 'assignmentId', true);
      }
    });

    this.permissionService.hasPermission('Agent', 'DELETE').subscribe((response) => {
      if (response) {
        this.contextMenuService.addDeleteMenuItem(RowActionMenuLabel.DELETE_AGENT, 'assignmentId', false);
      }
    });
  }
}
