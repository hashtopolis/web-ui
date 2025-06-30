import { ActionMenuItem } from '@components/menus/action-menu/action-menu.model';
import { RowActionMenuAction, RowActionMenuIcon } from '@components/menus/row-action-menu/row-action-menu.constants';

export type ContextMenuCondition = { key: string; value: boolean };
export type ContextMenuType = { index: number; menuItem: ActionMenuItem; condition?: ContextMenuCondition };

export abstract class ContextMenuService {
  private contextMenuItems: Array<ContextMenuType> = [];
  private bulkMenuItems: Array<ContextMenuType> = [];

  /**
   * Check, if we have to render a context menu
   * @return true: context menu entries added, false: no context menu entries
   */
  getHasContextMenu(): boolean {
    return this.contextMenuItems.length > 0;
  }

  /**
   * Check, if we have to render a bulk menu
   * @return true: bulk menu entries added, false: no bulk menu entries
   */
  getHasBulkMenu(): boolean {
    return this.bulkMenuItems.length > 0;
  }

  /**
   * Get all context menu entries
   * @return list of context menu entries
   */
  getMenuItems() {
    return this.contextMenuItems;
  }

  /**
   * Get all bulk menu entries
   * @return list of bulk menu entries
   */
  getBulkMenuItems() {
    return this.bulkMenuItems;
  }

  /**
   * Create a new menu item for the context or bulk menu
   * @param label - label of the menu item
   * @param groupIndex - group index of the item
   * @param action - item action
   * @param icon - item icon
   * @param warning - true: add red color, false: standard color
   * @param toContextMenu - true: add to contect menu, false: add to bulk menu
   * @param condition - Context menu condition to check in data object for each table row
   * @private
   */
  private createMenuItem(
    label: string,
    groupIndex: number,
    action: string,
    icon: string,
    warning: boolean,
    toContextMenu: boolean,
    condition: ContextMenuCondition = undefined
  ) {
    const menuItem: ContextMenuType = {
      index: groupIndex,
      menuItem: {
        label: label,
        action: action,
        icon: icon,
        red: warning
      },
      condition: condition
    };

    if (toContextMenu) {
      this.contextMenuItems.push(menuItem);
    } else {
      this.bulkMenuItems.push(menuItem);
    }
  }

  /**
   * Add a new edit entry to context menu
   * @param label - label of the entry
   */
  addCtxEditItem(label: string) {
    this.createMenuItem(label, 0, RowActionMenuAction.EDIT, RowActionMenuIcon.EDIT, false, true);
  }

  /**
   * Add a new deactiva entry to context menu
   * @param label - label of the entry
   * @param condition - condition to check for display state of menu entry
   */
  addCtxDeactivateMenuItem(label: string, condition: ContextMenuCondition) {
    this.createMenuItem(label, 0, RowActionMenuAction.DEACTIVATE, RowActionMenuIcon.DEACTIVATE, false, true, condition);
  }

  /**
   * Add a new entry to the bulk menu
   * @param label - label of the entry
   */
  addBulkDeactivateMenuItem(label: string) {
    this.createMenuItem(label, 0, RowActionMenuAction.DEACTIVATE, RowActionMenuIcon.DEACTIVATE, false, false);
  }

  /**
   * Add a new activate entry to context menu
   * @param label - label of the entry
   * @param condition - condition to check for display state of menu entry
   */
  addCtxActivateMenuItem(label: string, condition: ContextMenuCondition) {
    this.createMenuItem(label, 0, RowActionMenuAction.ACTIVATE, RowActionMenuIcon.ACTIVATE, false, true, condition);
  }

  /**
   * Add a new activate entry to bulk menu
   * @param label - label of the entry
   */
  addBulkActivateMenuItem(label: string) {
    this.createMenuItem(label, 0, RowActionMenuAction.ACTIVATE, RowActionMenuIcon.ACTIVATE, false, false);
  }

  /**
   * Add a new delete entry to context menu
   * @param label - label of the entry
   * @param condition - condition to check for display state of menu entry
   */
  addCtxDeleteMenuItem(label: string, condition: ContextMenuCondition = undefined) {
    this.createMenuItem(label, 1, RowActionMenuAction.DELETE, RowActionMenuIcon.DELETE, true, true, condition);
  }

  /**
   * Add a new delete entry to bulk menu
   * @param label - label of the entry
   */
  addBulkDeleteMenuItem(label: string) {
    this.createMenuItem(label, 1, RowActionMenuAction.DELETE, RowActionMenuIcon.DELETE, true, false);
  }

  /**
   * Add a new reset entry to context menu
   * @param label - label of the entry
   */
  addCtxResetMenuItem(label: string): void {
    this.createMenuItem(label, 0, RowActionMenuAction.RESET, RowActionMenuIcon.RESET, false, true);
  }
}
