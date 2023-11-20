import {
  BulkActionMenuAction,
  BulkActionMenuIcon,
  BulkActionMenuLabel
} from './bulk-action-menu.constants';
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';

import { ActionMenuItem } from '../action-menu/action-menu.model';
import { BaseMenuComponent } from '../base-menu/base-menu.component';
import { DataType } from '../../tables/ht-table/ht-table.models';

/**
 * Component representing the bulk action menu for various data types.
 */
@Component({
  selector: 'bulk-action-menu',
  templateUrl: './bulk-action-menu.component.html'
})
export class BulkActionMenuComponent
  extends BaseMenuComponent
  implements OnInit
{
  /** The type of data for which the bulk action menu is displayed. */
  @Input() dataType: DataType;
  /** Flag indicating whether the data is archived. */
  @Input() isArchived: boolean;

  ngOnInit(): void {
    this.loadMenu();
  }

  /**
   * Loads the appropriate menu based on the data type.
   */
  private loadMenu(): void {
    if (this.dataType === 'agents') {
      this.setActivateDeleteMenu(
        BulkActionMenuLabel.ACTIVATE_AGENTS,
        BulkActionMenuLabel.DEACTIVATE_AGENTS,
        BulkActionMenuLabel.DELETE_AGENTS
      );
    } else if (this.dataType === 'users') {
      this.setActivateDeleteMenu(
        BulkActionMenuLabel.ACTIVATE_USERS,
        BulkActionMenuLabel.DEACTIVATE_USERS,
        BulkActionMenuLabel.DELETE_USERS
      );
    } else if (this.dataType === 'hashlists') {
      this.setHashlistMenu();
    } else if (this.dataType === 'hashtypes') {
      this.setDeleteMenu(BulkActionMenuLabel.DELETE_HASHTYPES);
    } else if (this.dataType === 'agent-binaries') {
      this.setDeleteMenu(BulkActionMenuLabel.DELETE_AGENTBINARIES);
    } else if (this.dataType === 'files') {
      this.setDeleteMenu(BulkActionMenuLabel.DELETE_FILES);
    } else if (this.dataType === 'crackers') {
      this.setDeleteMenu(BulkActionMenuLabel.DELETE_CRACKERS);
    } else if (this.dataType === 'preprocessors') {
      this.setDeleteMenu(BulkActionMenuLabel.DELETE_PREPROCESSORS);
    } else if (this.dataType === 'health-checks') {
      this.setDeleteMenu(BulkActionMenuLabel.DELETE_HEALTHCHECKS);
    }
  }

  /**
   * Sets the context menu items for a hashlist data type.
   */
  private setHashlistMenu(): void {
    if (this.isArchived) {
      this.setActionMenuItems(0, [
        this.getDeleteMenuItem(BulkActionMenuLabel.DELETE_HASHLISTS)
      ]);
    } else {
      this.setActionMenuItems(0, [
        this.getArchiveMenuItem(BulkActionMenuLabel.ARCHIVE_HASHLISTS)
      ]);
      this.setActionMenuItems(1, [
        this.getDeleteMenuItem(BulkActionMenuLabel.DELETE_HASHLISTS)
      ]);
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
  private setActivateDeleteMenu(
    activateLabel: string,
    deactivateLabel: string,
    deleteLabel: string
  ): void {
    this.setActionMenuItems(0, [
      this.getActivateMenuItem(activateLabel),
      this.getDeactivateMenuItem(deactivateLabel)
    ]);
    this.setActionMenuItems(1, [this.getDeleteMenuItem(deleteLabel)]);
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

  reload(): void {
    this.loadMenu();
  }
}
