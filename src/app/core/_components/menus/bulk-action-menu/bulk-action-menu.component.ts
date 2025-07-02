/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';

import { ContextMenuService } from '@services/context-menu/base/context-menu.service';

import { ActionMenuItem } from '@components/menus/action-menu/action-menu.model';
import { BaseMenuComponent } from '@components/menus/base-menu/base-menu.component';
import {
  BulkActionMenuAction,
  BulkActionMenuIcon,
  BulkActionMenuLabel
} from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { DataType } from '@components/tables/ht-table/ht-table.models';

/**
 * Component representing the bulk action menu for various data types.
 */
@Component({
  selector: 'bulk-action-menu',
  templateUrl: './bulk-action-menu.component.html',
  standalone: false
})
export class BulkActionMenuComponent extends BaseMenuComponent implements OnInit {
  @Input() dataType: DataType;
  @Input() isArchived: boolean;
  @Input() contextMenuService: ContextMenuService;

  ngOnInit(): void {
    // TODO: delete, if all menus are added to context menu service
    this.loadMenu();
    this.data = { isArchived: this.isArchived };
    if (this.contextMenuService) {
      this.contextMenuService.getBulkMenuItems().forEach((item) => {
        this.conditionallyAddMenuItem(item, this.data);
      });
    }
  }

  reload(): void {
    this.loadMenu();
  }

  /**
   * Loads the appropriate menu based on the data type.
   */
  private loadMenu(): void {
    if (this.dataType === 'users') {
      this.setActivateDeleteMenu(
        BulkActionMenuLabel.ACTIVATE_USERS,
        BulkActionMenuLabel.DEACTIVATE_USERS,
        BulkActionMenuLabel.DELETE_USERS
      );
    } else if (this.dataType === 'notifications') {
      this.setActivateDeleteMenu(
        BulkActionMenuLabel.ACTIVATE_NOTIFICATION,
        BulkActionMenuLabel.DEACTIVATE_NOTIFICATIONS,
        BulkActionMenuLabel.DELETE_NOTIFICATIONS
      );
    } else if (this.dataType === 'tasks-chunks') {
      this.setArchiveDeleteMenu(BulkActionMenuLabel.DELETE_TASKS, BulkActionMenuLabel.ARCHIVE_TASKS);
    } else if (this.dataType === 'tasks-supertasks') {
      this.setResetMenu(BulkActionMenuLabel.RESET_CHUNKS);
    } else if (this.dataType === 'access-groups') {
      this.setDeleteMenu(BulkActionMenuLabel.DELETE_ACCESSGROUPS);
    } else if (this.dataType === 'access-groups-agents') {
      this.setDeleteMenu(BulkActionMenuLabel.REMOVE_ACCESSGROUP_AGENTS);
    } else if (this.dataType === 'access-groups-users') {
      this.setDeleteMenu(BulkActionMenuLabel.REMOVE_ACCESSGROUP_USERS);
    } else if (this.dataType === 'permissions') {
      this.setDeleteMenu(BulkActionMenuLabel.DELETE_PERMISSIONS);
    } else if (this.dataType === 'hashtypes') {
      this.setDeleteMenu(BulkActionMenuLabel.DELETE_HASHTYPES);
    } else if (this.dataType === 'agent-binaries') {
      this.setDeleteMenu(BulkActionMenuLabel.DELETE_AGENTBINARIES);
    } else if (this.dataType === 'crackers') {
      this.setDeleteMenu(BulkActionMenuLabel.DELETE_CRACKERS);
    } else if (this.dataType === 'preprocessors') {
      this.setDeleteMenu(BulkActionMenuLabel.DELETE_PREPROCESSORS);
    } else if (this.dataType === 'health-checks') {
      this.setDeleteMenu(BulkActionMenuLabel.DELETE_HEALTHCHECKS);
    } else if (this.dataType === 'vouchers') {
      this.setDeleteMenu(BulkActionMenuLabel.DELETE_VOUCHERS);
    } else if (this.dataType === 'agents-errors') {
      this.setDeleteMenu(BulkActionMenuLabel.DELETE_ERRORS);
    }
  }

  private setArchiveDeleteMenu(deleteLabel: string, archiveLabel: string): void {
    if (this.isArchived) {
      this.setActionMenuItems(0, [this.getDeleteMenuItem(deleteLabel)]);
    } else {
      this.setActionMenuItems(0, [this.getArchiveMenuItem(archiveLabel)]);
      this.setActionMenuItems(1, [this.getDeleteMenuItem(deleteLabel)]);
    }
  }

  /**
   * Sets the bulk menu items for a data type with only a delete option.
   * @param label Delete action label.
   */
  private setDeleteMenu(label: string): void {
    this.setActionMenuItems(0, [this.getDeleteMenuItem(label)]);
  }

  /**
   * Sets the bulk menu items for a data type with activate, deactivate and delete options.
   * @param activateLabel Activate action label.
   * @param deactivateLabel Deactiviate action label.
   * @param deleteLabel Delete action label.
   */
  private setActivateDeleteMenu(activateLabel: string, deactivateLabel: string, deleteLabel: string): void {
    this.setActionMenuItems(0, [this.getActivateMenuItem(activateLabel), this.getDeactivateMenuItem(deactivateLabel)]);
    this.setActionMenuItems(1, [this.getDeleteMenuItem(deleteLabel)]);
  }

  /**
   * Sets the bulk menu items for a data type with only a reset option.
   * @param label Reset action label.
   */
  private setResetMenu(label: string): void {
    this.setActionMenuItems(0, [this.getResetMenuItem(label)]);
  }

  /**
   * Creates an ActionMenuItem with bulk delete action.
   * @param label The label for the menu item.
   * @returns The ActionMenuItem with bulk delete action.
   */
  private getDeleteMenuItem(label: string): ActionMenuItem {
    return {
      label: label,
      action: BulkActionMenuAction.DELETE,
      icon: BulkActionMenuIcon.DELETE,
      red: true
    };
  }

  /**
   * Creates an ActionMenuItem with bulk archive action.
   * @param label The label for the menu item.
   * @returns The ActionMenuItem with bulk archive action.
   */
  private getArchiveMenuItem(label: string): ActionMenuItem {
    return {
      label: label,
      action: BulkActionMenuAction.ARCHIVE,
      icon: BulkActionMenuIcon.ARCHIVE
    };
  }

  /**
   * Creates an ActionMenuItem with bulk activate action.
   * @param label The label for the menu item.
   * @returns The ActionMenuItem with bulk activate action.
   */
  private getActivateMenuItem(label: string): ActionMenuItem {
    return {
      label: label,
      action: BulkActionMenuAction.ACTIVATE,
      icon: BulkActionMenuIcon.ACTIVATE
    };
  }

  /**
   * Creates an ActionMenuItem with bulk deactivate action.
   * @param label The label for the menu item.
   * @returns The ActionMenuItem with bulk deactivate action.
   */
  private getDeactivateMenuItem(label: string): ActionMenuItem {
    return {
      label: label,
      action: BulkActionMenuAction.DEACTIVATE,
      icon: BulkActionMenuIcon.DEACTIVATE
    };
  }

  /**
   * Creates an ActionMenuItem with bulk reset action.
   * @param label The label for the menu item.
   * @returns The ActionMenuItem with bulk reset action.
   */
  private getResetMenuItem(label: string): ActionMenuItem {
    return {
      label: label,
      action: BulkActionMenuAction.RESET,
      icon: BulkActionMenuIcon.RESET,
      red: true
    };
  }
}
