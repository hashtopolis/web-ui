import { Injectable } from '@angular/core';

import { ActionMenuItem } from '@components/menus/action-menu/action-menu.model';
import { RowActionMenuAction, RowActionMenuIcon } from '@components/menus/row-action-menu/row-action-menu.constants';

export type ContextMenuType = { index: number; menuItem: ActionMenuItem; condition: { key: string; value: boolean } };

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {
  private contextMenuItems: Array<ContextMenuType> = [];

  constructor() {}

  /**
   * Reset the current context menu items
   */
  reset() {
    this.contextMenuItems = [];
  }

  /**
   * Check, if we have to render a context menu
   * @return true: context menu entries added, false: no context menu entries
   */
  getHasContextMenu(): boolean {
    return this.contextMenuItems.length > 0;
  }

  /**
   * Add a new edit entry to context menu
   * @param label - label of the entry
   * @param conditionKey - condition key for entry to display
   * @param conditionValue - condition value for entry to display
   */
  addEditItem(label: string, conditionKey: string = '', conditionValue: boolean = false) {
    this.contextMenuItems.push({
      index: 0,
      menuItem: {
        label: label,
        action: RowActionMenuAction.EDIT,
        icon: RowActionMenuIcon.EDIT
      },
      condition: { key: conditionKey, value: conditionValue }
    });
  }

  /**
   * Add a new deactiva entry to context menu
   * @param label - label of the entry
   * @param conditionKey - condition key for entry to display
   * @param conditionValue - condition value for entry to display
   */
  addDeactivateMenuItem(label: string, conditionKey: string = '', conditionValue: boolean = false) {
    this.contextMenuItems.push({
      index: 0,
      menuItem: {
        label: label,
        action: RowActionMenuAction.DEACTIVATE,
        icon: RowActionMenuIcon.DEACTIVATE
      },
      condition: { key: conditionKey, value: conditionValue }
    });
  }

  /**
   * Add a new activate entry to context menu
   * @param label - label of the entry
   * @param conditionKey - condition key for entry to display
   * @param conditionValue - condition value for entry to display
   */
  addActivateMenuItem(label: string, conditionKey: string = '', conditionValue: boolean = false) {
    this.contextMenuItems.push({
      index: 0,
      menuItem: {
        label: label,
        action: RowActionMenuAction.ACTIVATE,
        icon: RowActionMenuIcon.ACTIVATE
      },
      condition: { key: conditionKey, value: conditionValue }
    });
  }

  /**
   * Add a new delete entry to context menu
   * @param label - label of the entry
   * @param conditionKey - condition key for entry to display
   * @param conditionValue - condition value for entry to display
   */
  addDeleteMenuItem(label: string, conditionKey: string = '', conditionValue: boolean = false) {
    this.contextMenuItems.push({
      index: 1,
      menuItem: {
        label: label,
        action: RowActionMenuAction.DELETE,
        icon: RowActionMenuIcon.DELETE,
        red: true
      },
      condition: { key: conditionKey, value: conditionValue }
    });
  }

  /**
   * Get all menu entries
   * @return list of amenu entries
   */
  getMenuItems() {
    return this.contextMenuItems;
  }
}
