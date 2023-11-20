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
    } else if (this.isSuperHashlist()) {
      this.setEditDeleteMenuItems(
        RowActionMenuLabel.EDIT_SUPERHASHLIST,
        RowActionMenuLabel.DELETE_SUPERHASHLIST
      );
    } else if (this.isAgentBinary()) {
      this.setEditDeleteMenuItems(
        RowActionMenuLabel.EDIT_AGENTBINARY,
        RowActionMenuLabel.DELETE_AGENTBINARY
      );
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
      this.setEditDeleteMenuItems(
        RowActionMenuLabel.EDIT_HEALTHCHECK,
        RowActionMenuLabel.DELETE_HEALTHCHECK
      );
    } else if (this.isUser()) {
      this.setUserMenu();
    } else if (this.isTask()) {
      this.setTaskMenu();
    } else if (this.isHashlist()) {
      this.setHashlistMenu();
    } else if (this.isHashtype()) {
      this.setHashtypeMenu();
    } else if (this.isCrackerBinaryType()) {
      this.setCrackerBinaryTypeMenu();
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
    this.setActionMenuItems(1, [
      this.getDeleteMenuItem(RowActionMenuLabel.DELETE_AGENT)
    ]);
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
   * Sets the context menu items for a task data row.
   */
  private setTaskMenu(): void {
    this.setActionMenuItems(0, [
      this.getEditMenuItem(RowActionMenuLabel.EDIT_TASK)
    ]);

    this.setActionMenuItems(1, [
      this.getDeleteMenuItem(RowActionMenuLabel.DELETE_TASK)
    ]);

    if (this.data.taskType === 0) {
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

    this.addActionMenuItem(
      0,
      this.getArchiveMenuItem(RowActionMenuLabel.ARCHIVE_TASK)
    );
  }

  /**
   * Sets the context menu items for a hashtype data row.
   */
  private setHashtypeMenu(): void {
    this.setActionMenuItems(0, [
      this.getDeleteMenuItem(RowActionMenuLabel.DELETE_HASHTYPE)
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
