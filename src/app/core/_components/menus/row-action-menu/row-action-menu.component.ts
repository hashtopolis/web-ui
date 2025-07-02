/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';

import { ContextMenuService } from '@services/context-menu/base/context-menu.service';

import { ActionMenuItem } from '@components/menus/action-menu/action-menu.model';
import { BaseMenuComponent } from '@components/menus/base-menu/base-menu.component';
import {
  RowActionMenuAction,
  RowActionMenuIcon,
  RowActionMenuLabel
} from '@components/menus/row-action-menu/row-action-menu.constants';

/**
 * Component representing the row action menu for various data types.
 */
@Component({
  selector: 'row-action-menu',
  templateUrl: './row-action-menu.component.html',
  standalone: false
})
export class RowActionMenuComponent extends BaseMenuComponent implements OnInit {
  @Input() contextMenuService: ContextMenuService;

  ngOnInit(): void {
    const actionMap: { condition: () => boolean; action: () => void }[] = [
      {
        condition: this.isAccessGroup,
        action: () =>
          this.setEditDeleteMenuItems(RowActionMenuLabel.EDIT_ACCESSGROUP, RowActionMenuLabel.DELETE_ACCESSGROUP)
      },
      {
        condition: this.isPreprocessor,
        action: () =>
          this.setEditDeleteMenuItems(RowActionMenuLabel.EDIT_PREPROCESSOR, RowActionMenuLabel.DELETE_PREPROCESSOR)
      },
      {
        condition: this.isHealthCheck,
        action: () =>
          this.setViewDeleteMenuItems(RowActionMenuLabel.VIEW_HEALTHCHECK, RowActionMenuLabel.DELETE_HEALTHCHECK)
      },
      { condition: this.isPermission, action: this.setPermissionMenu },
      {
        condition: this.isHashtype,
        action: () => this.setEditDeleteMenuItems(RowActionMenuLabel.EDIT_HASHTYPE, RowActionMenuLabel.DELETE_HASHTYPE)
      },
      {
        condition: this.isVoucher,
        action: () => this.setDeleteMenuItem(RowActionMenuLabel.DELETE_VOUCHER)
      },
      { condition: this.isUser, action: this.setUserMenu },
      { condition: this.isAgentBinary, action: this.setAgentBinaryMenu },
      { condition: this.isNotification, action: this.setNotificationMenu },
      { condition: this.isTaskWrapperModal, action: this.setTaskWrapperModalMenu },
      { condition: this.isAgentError, action: () => this.setDeleteMenuItem(RowActionMenuLabel.DELETE_ERROR) }
    ];

    for (const item of actionMap) {
      if (item.condition.call(this)) {
        item.action.call(this);
        break;
      }
    }

    if (this.contextMenuService) {
      this.contextMenuService.getMenuItems().forEach((item) => {
        this.conditionallyAddMenuItem(item, this.data);
      });
    }
  }

  /**
   * Sets the context menu items for a permission data row.
   */
  private setPermissionMenu(): void {
    this.setActionMenuItems(0, [this.getEditMenuItem(RowActionMenuLabel.EDIT_PERMISSION)]);
    if (!this.data.user || this.data.user.length === 0) {
      this.setActionMenuItems(1, [this.getDeleteMenuItem(RowActionMenuLabel.DELETE_PERMISSION)]);
    }
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
    this.setActionMenuItems(1, [this.getDeleteMenuItem(RowActionMenuLabel.DELETE_AGENTBINARY)]);
  }

  /**
   * Sets the context menu items for a user data row.
   */
  private setUserMenu(): void {
    if (this.data['isValid']) {
      this.setActionMenuItems(0, [this.getDeactivateMenuItem(RowActionMenuLabel.DEACTIVATE_USER)]);
    } else {
      this.setActionMenuItems(0, [this.getActivateMenuItem(RowActionMenuLabel.ACTIVATE_USER)]);
    }

    this.addActionMenuItem(0, this.getEditMenuItem(RowActionMenuLabel.EDIT_USER));
    this.setActionMenuItems(1, [this.getDeleteMenuItem(RowActionMenuLabel.DELETE_USER)]);
  }

  /**
   * Sets the context menu items for a user data row.
   */
  private setNotificationMenu(): void {
    if (this.data['isActive']) {
      this.setActionMenuItems(0, [this.getDeactivateMenuItem(RowActionMenuLabel.DEACTIVATE_NOTIFICATION)]);
    } else {
      this.setActionMenuItems(0, [this.getActivateMenuItem(RowActionMenuLabel.ACTIVATE_NOTIFICATION)]);
    }

    this.addActionMenuItem(0, this.getEditMenuItem(RowActionMenuLabel.EDIT_NOTIFICATION));

    this.setActionMenuItems(1, [this.getDeleteMenuItem(RowActionMenuLabel.DELETE_NOTIFICATION)]);
  }

  /**
   * Sets the context menu items for a task data row.
   */
  private setTaskWrapperModalMenu(): void {
    this.setActionMenuItems(0, [this.getEditMenuItem(RowActionMenuLabel.EDIT_TASK)]);
    this.setActionMenuItems(1, [this.getDeleteMenuItem(RowActionMenuLabel.DELETE_TASK)]);
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
    this.addActionMenuItem(0, this.getArchiveMenuItem(RowActionMenuLabel.ARCHIVE_TASK));
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
}
