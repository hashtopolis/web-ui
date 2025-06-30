import { PermissionCheck, PermissionService } from '@services/permission/permission.service';

import { ActionMenuItem } from '@components/menus/action-menu/action-menu.model';
import { RowActionMenuAction, RowActionMenuIcon } from '@components/menus/row-action-menu/row-action-menu.constants';

export type ContextMenuCondition = { key: string; value: boolean };
export type ContextMenuType = { index: number; menuItem: ActionMenuItem; condition?: ContextMenuCondition };

export abstract class ContextMenuService {
  private contextMenuItems: Array<ContextMenuType> = [];
  private bulkMenuItems: Array<ContextMenuType> = [];

  protected constructor(private permissionServce: PermissionService) {}

  /**
   * Check, if we have to render a context menu
   * @return true: context menu entries added, false: no context menu entries
   */
  getHasContextMenu(): boolean {
    return this.contextMenuItems.length > 0;
  }

  /**
   * Check, if we have to render a bulk menu
   * @return true: bulk menu entries added, false: no bulk menu entries®
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
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
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
    permissions: Array<PermissionCheck>,
    warning: boolean,
    toContextMenu: boolean,
    condition: ContextMenuCondition = { key: '', value: false }
  ) {
    if (this.permissionServce.hasAllPermissionsSync(permissions)) {
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
  }

  /**
   * Add a new edit entry to context menu
   * @param label - label of the entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   * @param condition
   */
  addCtxEditItem(
    label: string,
    permissions: PermissionCheck[],
    condition: ContextMenuCondition = { key: '', value: false }
  ) {
    this.createMenuItem(
      label,
      0,
      RowActionMenuAction.EDIT,
      RowActionMenuIcon.EDIT,
      permissions,
      false,
      true,
      condition
    );
  }

  /**
   * Add a new deactiva entry to context menu
   * @param label - label of the entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   * @param condition - condition to check for display state of menu entry
   */
  addCtxDeactivateMenuItem(
    label: string,
    permissions: PermissionCheck[],
    condition: ContextMenuCondition = { key: '', value: false }
  ) {
    this.createMenuItem(
      label,
      0,
      RowActionMenuAction.DEACTIVATE,
      RowActionMenuIcon.DEACTIVATE,
      permissions,
      false,
      true,
      condition
    );
  }

  /**
   * Add a new entry to the bulk menu
   * @param label - label of the entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   */
  addBulkDeactivateMenuItem(label: string, permissions: PermissionCheck[]) {
    this.createMenuItem(
      label,
      0,
      RowActionMenuAction.DEACTIVATE,
      RowActionMenuIcon.DEACTIVATE,
      permissions,
      false,
      false
    );
  }

  /**
   * Add a new activate entry to context menu
   * @param label - label of the entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   * @param condition - condition to check for display state of menu entry
   */
  addCtxActivateMenuItem(
    label: string,
    permissions: PermissionCheck[],
    condition: ContextMenuCondition = { key: '', value: false }
  ) {
    this.createMenuItem(
      label,
      0,
      RowActionMenuAction.ACTIVATE,
      RowActionMenuIcon.ACTIVATE,
      permissions,
      false,
      true,
      condition
    );
  }

  /**
   * Add a new activate entry to bulk menu
   * @param label - label of the entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   */
  addBulkActivateMenuItem(label: string, permissions: PermissionCheck[]) {
    this.createMenuItem(label, 0, RowActionMenuAction.ACTIVATE, RowActionMenuIcon.ACTIVATE, permissions, false, false);
  }

  /**
   * Add a new delete entry to context menu
   * @param label - label of the entry
   * @param condition - condition to check for display state of menu entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   */
  addCtxDeleteMenuItem(
    label: string,
    permissions: PermissionCheck[],
    condition: ContextMenuCondition = { key: '', value: false }
  ) {
    this.createMenuItem(
      label,
      1,
      RowActionMenuAction.DELETE,
      RowActionMenuIcon.DELETE,
      permissions,
      true,
      true,
      condition
    );
  }

  /**
   * Add a new delete entry to bulk menu
   * @param label - label of the entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   */
  addBulkDeleteMenuItem(label: string, permissions: PermissionCheck[]) {
    this.createMenuItem(label, 1, RowActionMenuAction.DELETE, RowActionMenuIcon.DELETE, permissions, true, false);
  }

  /**
   * Add a new reset entry to context menu
   * @param label - label of the entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   */
  addCtxResetMenuItem(label: string, permissions: PermissionCheck[]): void {
    this.createMenuItem(label, 0, RowActionMenuAction.RESET, RowActionMenuIcon.RESET, permissions, false, true);
  }

  /**
   * Add a new copy entry to context menu
   * @param label - label of the entry
   * @param condition - condition to check for display state of menu entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   */
  addCtxCopyMenuItem(
    label: string,
    permissions: PermissionCheck[],
    condition: ContextMenuCondition = { key: '', value: false }
  ): void {
    this.createMenuItem(
      label,
      0,
      RowActionMenuAction.COPY_TO_TASK,
      RowActionMenuIcon.COPY,
      permissions,
      false,
      true,
      condition
    );
  }

  /**
   * Add a new archive entry to context menu
   * @param label - label of the entry
   * @param condition - condition to check for display state of menu entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   */
  addCtxArchiveMenuItem(
    label: string,
    permissions: PermissionCheck[],
    condition: ContextMenuCondition = { key: '', value: false }
  ): void {
    this.createMenuItem(
      label,
      0,
      RowActionMenuAction.ARCHIVE,
      RowActionMenuIcon.ARCHIVE,
      permissions,
      false,
      true,
      condition
    );
  }

  /**
   * Add a new unarchive entry to context menu
   * @param label - label of the entry
   * @param condition - condition to check for display state of menu entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   */
  addCtxUnArchiveMenuItem(
    label: string,
    permissions: PermissionCheck[],
    condition: ContextMenuCondition = { key: '', value: false }
  ): void {
    this.createMenuItem(
      label,
      0,
      RowActionMenuAction.UNARCHIVE,
      RowActionMenuIcon.UNARCHIVE,
      permissions,
      false,
      true,
      condition
    );
  }

  /**
   * Add a new archive entry to bulks menu
   * @param label - label of the entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   */
  addBulkArchiveMenuItem(label: string, permissions: PermissionCheck[]): void {
    this.createMenuItem(label, 1, RowActionMenuAction.ARCHIVE, RowActionMenuIcon.ARCHIVE, permissions, false, false);
  }
}
