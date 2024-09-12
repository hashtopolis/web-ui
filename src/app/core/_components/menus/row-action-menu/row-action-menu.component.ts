/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit } from '@angular/core';
import {
  RowActionMenuAction,
  RowActionMenuIcon,
  RowActionMenuLabel
} from './row-action-menu.constants';

import { ActionMenuItem } from '../action-menu/action-menu.model';
import { BaseMenuComponent } from '../base-menu/base-menu.component';

/**
 * Component representing the row action menu for various data types.
 */
@Component({
  selector: 'row-action-menu',
  templateUrl: './row-action-menu.component.html'
})
export class RowActionMenuComponent
  extends BaseMenuComponent
  implements OnInit
{
  ngOnInit(): void {
    if (this.isAgent()) {
      this.setAgentMenu();
    } else if (this.isAccessGroup()) {
      this.setEditDeleteMenuItems(
        RowActionMenuLabel.EDIT_ACCESSGROUP,
        RowActionMenuLabel.DELETE_ACCESSGROUP
      );
    } else if (this.isSuperHashlist()) {
      this.setSuperHashlistMenu();
    } else if (this.isFile()) {
      this.setEditDeleteMenuItems(
        RowActionMenuLabel.EDIT_FILE,
        RowActionMenuLabel.DELETE_FILE
      );
    } else if (this.isPreprocessor()) {
      this.setEditDeleteMenuItems(
        RowActionMenuLabel.EDIT_PREPROCESSOR,
        RowActionMenuLabel.DELETE_PREPROCESSOR
      );
    } else if (this.isHealthCheck()) {
      this.setViewDeleteMenuItems(
        RowActionMenuLabel.VIEW_HEALTHCHECK,
        RowActionMenuLabel.DELETE_HEALTHCHECK
      );
    } else if (this.isPermission()) {
      this.setPermissionMenu();
    } else if (this.isHashtype()) {
      this.setEditDeleteMenuItems(
        RowActionMenuLabel.EDIT_HASHTYPE,
        RowActionMenuLabel.DELETE_HASHTYPE
      );
    } else if (this.isVoucher()) {
      this.setDeleteMenuItem(RowActionMenuLabel.DELETE_VOUCHER);
    } else if (this.isUser()) {
      this.setUserMenu();
    } else if (this.isAgentBinary()) {
      this.setAgentBinaryMenu();
    } else if (this.isNotification()) {
      this.setNotificationMenu();
    } else if (this.isPretask()) {
      this.setPretaskMenu();
    } else if (this.isTaskWrapper()) {
      this.setTaskWrapperMenu();
    } else if (this.isTaskWrapperModal()) {
      this.setTaskWrapperModalMenu();
    } else if (this.isTaskChunks()) {
      this.setTaskChunksMenu();
    } else if (this.isSupertask()) {
      this.setSupertaskMenu();
    } else if (this.isHashlist()) {
      this.setHashlistMenu();
    } else if (this.isCrackerBinaryType()) {
      this.setCrackerBinaryTypeMenu();
    }
  }

  /**
   * Sets the context menu items for a permission data row.
   */
  private setPermissionMenu(): void {
    this.setActionMenuItems(0, [
      this.getEditMenuItem(RowActionMenuLabel.EDIT_PERMISSION)
    ]);
    if (!this.data.user || this.data.user.length === 0) {
      this.setActionMenuItems(1, [
        this.getDeleteMenuItem(RowActionMenuLabel.DELETE_PERMISSION)
      ]);
    }
  }

  /**
   * Sets the context menu items for a cracker data row.
   */
  private setCrackerBinaryTypeMenu(): void {
    this.setActionMenuItems(0, [
      this.getNewMenuItem(RowActionMenuLabel.NEW_VERSION)
    ]);
    this.setActionMenuItems(1, [
      this.getDeleteMenuItem(RowActionMenuLabel.DELETE_CRACKER)
    ]);
  }

  /**
   * Sets context menu with edit and delete action.
   * @param editLabel The label for the edit action.
   * @param deleteLabel The label for the delete action.
   */
  private setEditDeleteMenuItems(editLabel: string, deleteLabel: string): void {
    this.setActionMenuItems(0, [this.getEditMenuItem(editLabel)]);
    this.setActionMenuItems(1, [this.getDeleteMenuItem(deleteLabel)]);
  }

  /**
   * Sets context menu with view and delete action.
   * @param viewLabel The label for the view action.
   * @param deleteLabel The label for the delete action.
   */
  private setViewDeleteMenuItems(viewLabel: string, deleteLabel: string): void {
    this.setActionMenuItems(0, [this.getViewMenuItem(viewLabel)]);
    this.setActionMenuItems(1, [this.getDeleteMenuItem(deleteLabel)]);
  }

  /**
   * Sets context menu with delete action.
   * @param label The label for the delete action.
   */
  private setDeleteMenuItem(label: string): void {
    this.setActionMenuItems(0, [this.getDeleteMenuItem(label)]);
  }

  /**
   * Sets the context menu items for an agent binary data row.
   */
  private setAgentBinaryMenu(): void {
    this.setActionMenuItems(0, [
      this.getEditMenuItem(RowActionMenuLabel.EDIT_AGENTBINARY),
      this.getDownloadMenuItem(RowActionMenuLabel.DOWNLOAD_AGENT),
      this.getCopyMenuItem(RowActionMenuLabel.COPY_LINK_BINARY)
    ]);
    this.setActionMenuItems(1, [
      this.getDeleteMenuItem(RowActionMenuLabel.DELETE_AGENTBINARY)
    ]);
  }

  /**
   * Sets the context menu items for an agent data row.
   */
  private setAgentMenu(): void {
    this.setActionMenuItems(0, [
      this.getEditMenuItem(RowActionMenuLabel.EDIT_AGENT)
    ]);
    if (this.data['isActive']) {
      this.addActionMenuItem(
        0,
        this.getDeactivateMenuItem(RowActionMenuLabel.DEACTIVATE_AGENT)
      );
    } else {
      this.addActionMenuItem(
        0,
        this.getActivateMenuItem(RowActionMenuLabel.ACTIVATE_AGENT)
      );
    }
    if (this.data['assignmentId']) {
      this.setActionMenuItems(1, [
        this.getDeleteMenuItem(RowActionMenuLabel.UNASSIGN_AGENT)
      ]);
    } else {
      this.setActionMenuItems(1, [
        this.getDeleteMenuItem(RowActionMenuLabel.DELETE_AGENT)
      ]);
    }
  }

  /**
   * Sets the context menu items for an hashlist data row.
   */
  private setHashlistMenu(): void {
    this.setActionMenuItems(0, []);

    if (this.data['isArchived']) {
      this.setActionMenuItems(0, [
        this.getDeleteMenuItem(RowActionMenuLabel.DELETE_HASHLIST)
      ]);
    } else {
      this.setActionMenuItems(0, [
        this.getEditMenuItem(RowActionMenuLabel.EDIT_HASHLIST),
        this.getImportMenuItem(RowActionMenuLabel.IMPORT_HASHLIST),
        this.getExportMenuItem(RowActionMenuLabel.EXPORT_HASHLIST)
      ]);
      this.setActionMenuItems(1, [
        this.getDeleteMenuItem(RowActionMenuLabel.DELETE_HASHLIST)
      ]);
    }
  }

  /**
   * Sets the context menu items for an Super-hashlist data row.
   */
  private setSuperHashlistMenu(): void {
    this.setActionMenuItems(0, []);

    this.setActionMenuItems(0, [
      this.getEditMenuItem(RowActionMenuLabel.EDIT_SUPERHASHLIST),
      this.getImportMenuItem(RowActionMenuLabel.IMPORT_HASHLISTS),
      this.getExportMenuItem(RowActionMenuLabel.EXPORT_HASHLISTS)
    ]);
    this.setActionMenuItems(1, [
      this.getDeleteMenuItem(RowActionMenuLabel.DELETE_SUPERHASHLIST)
    ]);
  }

  /**
   * Sets the context menu items for a user data row.
   */
  private setUserMenu(): void {
    if (this.data['isValid']) {
      this.setActionMenuItems(0, [
        this.getDeactivateMenuItem(RowActionMenuLabel.DEACTIVATE_USER)
      ]);
    } else {
      this.setActionMenuItems(0, [
        this.getActivateMenuItem(RowActionMenuLabel.ACTIVATE_USER)
      ]);
    }

    this.addActionMenuItem(
      0,
      this.getEditMenuItem(RowActionMenuLabel.EDIT_USER)
    );
    this.setActionMenuItems(1, [
      this.getDeleteMenuItem(RowActionMenuLabel.DELETE_USER)
    ]);
  }

  /**
   * Sets the context menu items for a user data row.
   */
  private setNotificationMenu(): void {
    if (this.data['isActive']) {
      this.setActionMenuItems(0, [
        this.getDeactivateMenuItem(RowActionMenuLabel.DEACTIVATE_NOTIFICATION)
      ]);
    } else {
      this.setActionMenuItems(0, [
        this.getActivateMenuItem(RowActionMenuLabel.ACTIVATE_NOTIFICATION)
      ]);
    }

    this.addActionMenuItem(
      0,
      this.getEditMenuItem(RowActionMenuLabel.EDIT_NOTIFICATION)
    );

    this.setActionMenuItems(1, [
      this.getDeleteMenuItem(RowActionMenuLabel.DELETE_NOTIFICATION)
    ]);
  }

  /**
   * Sets the context menu items for a pretask data row.
   */
  private setPretaskMenu(): void {
    this.setActionMenuItems(0, [
      this.getEditMenuItem(RowActionMenuLabel.EDIT_PRETASK)
    ]);
    this.addActionMenuItem(0, {
      label: RowActionMenuLabel.COPY_TO_TASK,
      action: RowActionMenuAction.COPY_TO_TASK,
      icon: RowActionMenuIcon.COPY
    });
    this.addActionMenuItem(0, {
      label: RowActionMenuLabel.COPY_TO_PRETASK,
      action: RowActionMenuAction.COPY_TO_PRETASK,
      icon: RowActionMenuIcon.COPY
    });
    if (!this.data.editst) {
      this.setActionMenuItems(1, [
        this.getDeleteMenuItem(RowActionMenuLabel.DELETE_PRETASK)
      ]);
    } else {
      this.setActionMenuItems(1, [
        this.getDeleteMenuItem(RowActionMenuLabel.UNASSIGN_PRETASK)
      ]);
    }
  }

  /**
   * Sets the context menu items for a task data row.
   */
  private setTaskWrapperMenu(): void {
    // this.setActionMenuItems(0, [
    //   this.getEditMenuItem(RowActionMenuLabel.EDIT_TASK)
    // ]);

    this.setActionMenuItems(0, [
      this.getDeleteMenuItem(RowActionMenuLabel.DELETE_TASK)
    ]);

    if (this.data.taskType === 0) {
      this.addActionMenuItem(0, {
        label: RowActionMenuLabel.EDIT_TASK,
        action: RowActionMenuAction.EDIT_TASKS,
        icon: RowActionMenuIcon.EDIT
      });
      this.addActionMenuItem(0, {
        label: RowActionMenuLabel.COPY_TO_TASK,
        action: RowActionMenuAction.COPY_TO_TASK,
        icon: RowActionMenuIcon.COPY
      });
      this.addActionMenuItem(0, {
        label: RowActionMenuLabel.COPY_TO_PRETASK,
        action: RowActionMenuAction.COPY_TO_PRETASK,
        icon: RowActionMenuIcon.COPY
      });
    } else if (this.data.taskType === 1) {
      this.addActionMenuItem(0, {
        label: RowActionMenuLabel.EDIT_SUBTASKS,
        action: RowActionMenuAction.EDIT_SUBTASKS,
        icon: RowActionMenuIcon.EDIT
      });
    }

    if (this.data.isArchived) {
      this.addActionMenuItem(
        0,
        this.getUnarchiveMenuItem(RowActionMenuLabel.UNARCHIVE_TASK)
      );
    } else {
      this.addActionMenuItem(
        0,
        this.getArchiveMenuItem(RowActionMenuLabel.ARCHIVE_TASK)
      );
    }
  }

  /**
   * Sets the context menu items for a task data row.
   */
  private setTaskWrapperModalMenu(): void {
    this.setActionMenuItems(0, [
      this.getEditMenuItem(RowActionMenuLabel.EDIT_TASK)
    ]);
    this.setActionMenuItems(1, [
      this.getDeleteMenuItem(RowActionMenuLabel.DELETE_TASK)
    ]);
    this.addActionMenuItem(0, {
      label: RowActionMenuLabel.COPY_TO_TASK,
      action: RowActionMenuAction.COPY_TO_TASK,
      icon: RowActionMenuIcon.COPY
    });
    this.addActionMenuItem(0, {
      label: RowActionMenuLabel.COPY_TO_PRETASK,
      action: RowActionMenuAction.COPY_TO_PRETASK,
      icon: RowActionMenuIcon.COPY
    });
    this.addActionMenuItem(
      0,
      this.getArchiveMenuItem(RowActionMenuLabel.ARCHIVE_TASK)
    );
  }

  /**
   * Sets the context menu items for a task chunks data row.
   */
  private setTaskChunksMenu(): void {
    this.setActionMenuItems(0, [
      this.getResetMenuItem(RowActionMenuLabel.RESET_CHUNK)
    ]);
  }

  /**
   * Sets the context menu items for a pretask data row.
   */
  private setSupertaskMenu(): void {
    this.setActionMenuItems(0, [
      this.getEditMenuItem(RowActionMenuLabel.EDIT_SUPERTASK)
    ]);
    this.addActionMenuItem(0, {
      label: RowActionMenuLabel.APPLY_HASHLIST,
      action: RowActionMenuAction.APPLY_TO_HASHLIST,
      icon: RowActionMenuIcon.COPY
    });
    this.addActionMenuItem(0, {
      label: RowActionMenuLabel.EDIT_SUBTASKS,
      action: RowActionMenuAction.EDIT_SUBTASKS,
      icon: RowActionMenuIcon.EDIT
    });
    this.setActionMenuItems(1, [
      this.getDeleteMenuItem(RowActionMenuLabel.DELETE_SUPERTASK)
    ]);
  }

  /**
   * Creates an ActionMenuItem with delete action.
   * @param label The label for the menu item.
   * @returns The ActionMenuItem with delete action.
   */
  private getDeleteMenuItem(label: string): ActionMenuItem {
    return {
      label: label,
      action: RowActionMenuAction.DELETE,
      icon: RowActionMenuIcon.DELETE,
      red: true
    };
  }

  /**
   * Creates an ActionMenuItem with download action.
   * @param label The label for the menu item.
   * @returns The ActionMenuItem with download action.
   */
  private getDownloadMenuItem(label: string): ActionMenuItem {
    return {
      label: label,
      action: RowActionMenuAction.DOWNLOAD,
      icon: RowActionMenuIcon.DOWNLOAD
    };
  }

  /**
   * Creates an ActionMenuItem with copy action.
   * @param label The label for the menu item.
   * @returns The ActionMenuItem with download action.
   */
  private getCopyMenuItem(label: string): ActionMenuItem {
    return {
      label: label,
      action: RowActionMenuAction.COPY_LINK,
      icon: RowActionMenuIcon.COPY
    };
  }

  /**
   * Creates an ActionMenuItem with view action.
   * @param label The label for the menu item.
   * @returns The ActionMenuItem with view action.
   */
  private getViewMenuItem(label: string): ActionMenuItem {
    return {
      label: label,
      action: RowActionMenuAction.VIEW,
      icon: RowActionMenuIcon.VIEW
    };
  }

  /**
   * Creates an ActionMenuItem with edit action.
   * @param label The label for the menu item.
   * @returns The ActionMenuItem with edit action.
   */
  private getEditMenuItem(label: string): ActionMenuItem {
    return {
      label: label,
      action: RowActionMenuAction.EDIT,
      icon: RowActionMenuIcon.EDIT
    };
  }

  /**
   * Creates an ActionMenuItem with import action.
   * @param label The label for the menu item.
   * @returns The ActionMenuItem with import action.
   */
  private getImportMenuItem(label: string): ActionMenuItem {
    return {
      label: label,
      action: RowActionMenuAction.IMPORT,
      icon: RowActionMenuIcon.IMPORT
    };
  }

  /**
   * Creates an ActionMenuItem with export action.
   * @param label The label for the menu item.
   * @returns The ActionMenuItem with export action.
   */
  private getExportMenuItem(label: string): ActionMenuItem {
    return {
      label: label,
      action: RowActionMenuAction.EXPORT,
      icon: RowActionMenuIcon.EXPORT
    };
  }

  /**
   * Creates an ActionMenuItem with new action.
   * @param label The label for the menu item.
   * @returns The ActionMenuItem with new action.
   */
  private getNewMenuItem(label: string): ActionMenuItem {
    return {
      label: label,
      action: RowActionMenuAction.NEW,
      icon: RowActionMenuIcon.NEW
    };
  }

  /**
   * Creates an ActionMenuItem with archive action.
   * @param label The label for the menu item.
   * @returns The ActionMenuItem with archive action.
   */
  private getArchiveMenuItem(label: string): ActionMenuItem {
    return {
      label: label,
      action: RowActionMenuAction.ARCHIVE,
      icon: RowActionMenuIcon.ARCHIVE
    };
  }

  /**
   * Creates an ActionMenuItem with archive action.
   * @param label The label for the menu item.
   * @returns The ActionMenuItem with archive action.
   */
  private getUnarchiveMenuItem(label: string): ActionMenuItem {
    return {
      label: label,
      action: RowActionMenuAction.UNARCHIVE,
      icon: RowActionMenuIcon.UNARCHIVE
    };
  }

  /**
   * Creates an ActionMenuItem with activate action.
   * @param label The label for the menu item.
   * @returns The ActionMenuItem with activate action.
   */
  private getActivateMenuItem(label: string): ActionMenuItem {
    return {
      label: label,
      action: RowActionMenuAction.ACTIVATE,
      icon: RowActionMenuIcon.ACTIVATE
    };
  }

  /**
   * Creates an ActionMenuItem with deactivate action.
   * @param label The label for the menu item.
   * @returns The ActionMenuItem with deactivate action.
   */
  private getDeactivateMenuItem(label: string): ActionMenuItem {
    return {
      label: label,
      action: RowActionMenuAction.DEACTIVATE,
      icon: RowActionMenuIcon.DEACTIVATE
    };
  }

  /**
   * Creates an ActionMenuItem with edit action.
   * @param label The label for the menu item.
   * @returns The ActionMenuItem with edit action.
   */
  private getResetMenuItem(label: string): ActionMenuItem {
    return {
      label: label,
      action: RowActionMenuAction.RESET,
      icon: RowActionMenuIcon.RESET
    };
  }
}
