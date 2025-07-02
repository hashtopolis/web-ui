import { PermissionService } from '@services/permission/permission.service';

import { ActionMenuItem } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction, RowActionMenuIcon } from '@components/menus/row-action-menu/row-action-menu.constants';

import { PermissionValues } from '@src/app/core/_constants/userpermissions.config';

export type ContextMenuCondition = { key: string; value: boolean };
export type ContextMenuType = { index: number; menuItem: ActionMenuItem; condition?: ContextMenuCondition };

export abstract class ContextMenuService {
  private contextMenuItems: Array<ContextMenuType> = [];
  private bulkMenuItems: Array<ContextMenuType> = [];

  protected constructor(protected permissionService: PermissionService) {}

  abstract addContextMenu(item: ContextMenuType): ContextMenuService;

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
   * Add a new edit entry to context menu
   * @param label - label of the entry
   * @param action - edit action event to emit on click
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   * @param condition
   */
  protected addCtxEditItem(
    label: string,
    action: string,
    permissions: Array<PermissionValues>,
    condition: ContextMenuCondition = { key: '', value: false }
  ) {
    this.createMenuItem(label, 0, action, RowActionMenuAction.EDIT, permissions, condition);
  }

  /**
   * Add a new deactivation entry to context menu
   * @param label - label of the entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   * @param condition - condition to check for display state of menu entry
   */
  protected addCtxDeactivateItem(
    label: string,
    permissions: Array<PermissionValues>,
    condition: ContextMenuCondition = { key: '', value: false }
  ) {
    this.createMenuItem(label, 0, RowActionMenuAction.DEACTIVATE, RowActionMenuIcon.DEACTIVATE, permissions, condition);
  }

  /**
   * Add a new entry to the bulk menu
   * @param label - label of the entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   */
  protected addBulkDeactivateItem(label: string, permissions: Array<PermissionValues>) {
    this.createMenuItem(
      label,
      0,
      BulkActionMenuAction.DEACTIVATE,
      RowActionMenuIcon.DEACTIVATE,
      permissions,
      { key: '', value: false },
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
  protected addCtxActivateItem(
    label: string,
    permissions: Array<PermissionValues>,
    condition: ContextMenuCondition = { key: '', value: false }
  ) {
    this.createMenuItem(label, 0, RowActionMenuAction.ACTIVATE, RowActionMenuIcon.ACTIVATE, permissions, condition);
  }

  /**
   * Add a new activate entry to bulk menu
   * @param label - label of the entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   */
  protected addBulkActivateItem(label: string, permissions: Array<PermissionValues>) {
    this.createMenuItem(
      label,
      0,
      BulkActionMenuAction.ACTIVATE,
      RowActionMenuIcon.ACTIVATE,
      permissions,
      {
        key: '',
        value: false
      },
      false,
      false
    );
  }

  /**
   * Add a new delete entry to context menu
   * @param label - label of the entry
   * @param condition - condition to check for display state of menu entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   */
  protected addCtxDeleteItem(
    label: string,
    permissions: Array<PermissionValues>,
    condition: ContextMenuCondition = { key: '', value: false }
  ) {
    this.createMenuItem(
      label,
      1,
      RowActionMenuAction.DELETE,
      RowActionMenuIcon.DELETE,
      permissions,
      condition,
      true,
      true
    );
  }

  /**
   * Add a new delete entry to bulk menu
   * @param label - label of the entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   */
  protected addBulkDeleteItem(label: string, permissions: Array<PermissionValues>) {
    this.createMenuItem(
      label,
      0,
      BulkActionMenuAction.DELETE,
      RowActionMenuIcon.DELETE,
      permissions,
      {
        key: '',
        value: false
      },
      false,
      true
    );
  }

  /**
   * Add a new reset entry to context menu
   * @param label - label of the entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   */
  protected addCtxResetItem(label: string, permissions: Array<PermissionValues>): void {
    this.createMenuItem(label, 0, RowActionMenuAction.RESET, RowActionMenuIcon.RESET, permissions);
  }

  /**
   * Add a new copy entry to context menu
   * @param label - label of the entry
   * @param action - copy action event to emit on click
   * @param condition - condition to check for display state of menu entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   */
  protected addCtxCopyItem(
    label: string,
    action: string,
    permissions: Array<PermissionValues>,
    condition: ContextMenuCondition = { key: '', value: false }
  ): void {
    this.createMenuItem(label, 0, action, RowActionMenuIcon.COPY, permissions, condition);
  }

  /**
   * Add a new archive entry to context menu
   * @param label - label of the entry
   * @param condition - condition to check for display state of menu entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   */
  protected addCtxArchiveItem(
    label: string,
    permissions: Array<PermissionValues>,
    condition: ContextMenuCondition = { key: '', value: false }
  ): void {
    this.createMenuItem(label, 0, RowActionMenuAction.ARCHIVE, RowActionMenuIcon.ARCHIVE, permissions, condition);
  }

  /**
   * Add a new unarchive entry to context menu
   * @param label - label of the entry
   * @param condition - condition to check for display state of menu entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   */
  protected addCtxUnArchiveItem(
    label: string,
    permissions: Array<PermissionValues>,
    condition: ContextMenuCondition = { key: '', value: false }
  ): void {
    this.createMenuItem(label, 0, RowActionMenuAction.UNARCHIVE, RowActionMenuIcon.UNARCHIVE, permissions, condition);
  }

  /**
   * Add a new archive entry to bulks menu
   * @param label - label of the entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   * @param condition - condition to check for display state of menu entry
   */
  protected addBulkArchiveItem(
    label: string,
    permissions: Array<PermissionValues>,
    condition: ContextMenuCondition = { key: '', value: false }
  ): void {
    this.createMenuItem(
      label,
      0,
      BulkActionMenuAction.ARCHIVE,
      RowActionMenuIcon.ARCHIVE,
      permissions,
      condition,
      false,
      false
    );
  }

  /**
   * Add new import entry to the context menu
   * @param label - label of the entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   * @param condition - condition to check for display state of menu entry
   */
  protected addCtxImportItem(
    label: string,
    permissions: Array<PermissionValues>,
    condition: ContextMenuCondition = {
      key: '',
      value: false
    }
  ) {
    this.createMenuItem(label, 0, RowActionMenuAction.IMPORT, RowActionMenuIcon.IMPORT, permissions, condition);
  }

  /**
   * Add new export entry to the context menu
   * @param label - label of the entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   * @param condition - condition to check for display state of menu entry
   */
  protected addCtxExportItem(
    label: string,
    permissions: Array<PermissionValues>,
    condition: ContextMenuCondition = {
      key: '',
      value: false
    }
  ) {
    this.createMenuItem(label, 0, RowActionMenuAction.EXPORT, RowActionMenuIcon.EXPORT, permissions, condition);
  }

  /**
   * Add new download entry to the context menu
   * @param label - label of the entry
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   * @protected
   */
  protected addCtxDownloadItem(label: string, permissions: Array<PermissionValues>): void {
    this.createMenuItem(label, 0, RowActionMenuAction.DOWNLOAD, RowActionMenuIcon.DOWNLOAD, permissions);
  }

  protected addCtxNewItem(label: string, permissions: Array<PermissionValues>): void {
    this.createMenuItem(label, 0, RowActionMenuAction.NEW, RowActionMenuIcon.NEW, permissions);
  }

  protected addCtxViewItem(label: string, permissions: Array<PermissionValues>): void {
    this.createMenuItem(label, 0, RowActionMenuAction.VIEW, RowActionMenuIcon.VIEW, permissions);
  }

  /**
   * Create a new menu item for the context or bulk menu
   * @param label - label of the menu item
   * @param groupIndex - group index of the item
   * @param action - item action
   * @param icon - item icon
   * @param permissions - list of permissions which must be granted to the user to display the menu entry
   * @param condition - Context menu condition to check in data object for each table row
   * @param toContextMenu - true: add to context menu, false: add to bulk menu
   * @param warning - true: add red color, false: standard color
   * @private
   */
  private createMenuItem(
    label: string,
    groupIndex: number,
    action: string,
    icon: string,
    permissions: Array<PermissionValues>,
    condition: ContextMenuCondition = { key: '', value: false },
    toContextMenu: boolean = true,
    warning: boolean = false
  ) {
    if (this.permissionService.hasAllPermissionsSync(permissions)) {
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
}
