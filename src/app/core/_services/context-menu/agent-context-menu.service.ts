import { Injectable } from '@angular/core';

import { ContextMenuService } from '@services/context-menu/context-menu.service';

import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

@Injectable({
  providedIn: 'root'
})
export class AgentContextMenuService {
  constructor(private contextMenuService: ContextMenuService) {}

  /**
   * Add context menu for all agent based tables
   */
  addAgentContextMenu(): void {
    this.contextMenuService.addEditItem(RowActionMenuLabel.EDIT_AGENT);
    this.contextMenuService.addDeactivateMenuItem(RowActionMenuLabel.DEACTIVATE_AGENT, 'isActive', true);
    this.contextMenuService.addActivateMenuItem(RowActionMenuLabel.ACTIVATE_AGENT, 'isActive', false);
    this.contextMenuService.addDeleteMenuItem(RowActionMenuLabel.UNASSIGN_AGENT, 'assignmentId', true);
    this.contextMenuService.addDeleteMenuItem(RowActionMenuLabel.DELETE_AGENT, 'assignmentId', false);
  }
}
