import {
  BulkActionMenuAction,
  BulkActionMenuLabel
} from './bulk-action-menu.constants';
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnInit } from '@angular/core';

import { ActionMenuItem } from '../action-menu/action-menu.model';
import { BaseMenuComponent } from '../base-menu/base-menu.component';
import { DataType } from '../../tables/ht-table/ht-table.models';

@Component({
  selector: 'bulk-action-menu',
  templateUrl: './bulk-action-menu.component.html'
})
export class BulkActionMenuComponent
  extends BaseMenuComponent
  implements OnInit
{
  @Input() dataType: DataType;
  @Input() isArchived: boolean;

  ngOnInit(): void {
    this.loadMenu();
  }

  private loadMenu(): void {
    if (this.dataType === 'agents') {
      this.getAgentMenu();
    } else if (this.dataType === 'hashlists') {
      this.getHashlistMenu();
    } else if (this.dataType === 'hashtypes') {
      this.getDeleteMenu(BulkActionMenuLabel.DELETE_HASHTYPES);
    } else if (this.dataType === 'files') {
      this.getDeleteMenu(BulkActionMenuLabel.DELETE_FILES);
    } else if (this.dataType === 'crackers') {
      this.getDeleteMenu(BulkActionMenuLabel.DELETE_CRACKERS);
    } else if (this.dataType === 'preprocessors') {
      this.getDeleteMenu(BulkActionMenuLabel.DELETE_PREPROCESSORS);
    }
  }

  private getHashlistMenu(): void {
    const deleteMenuAction: ActionMenuItem = {
      label: BulkActionMenuLabel.DELETE_HASHLISTS,
      action: BulkActionMenuAction.DELETE,
      icon: 'delete',
      red: true
    };

    if (this.isArchived) {
      this.actionMenuItems[0] = [deleteMenuAction];
    } else {
      this.actionMenuItems[0] = [
        {
          label: BulkActionMenuLabel.ARCHIVE_HASHLISTS,
          action: BulkActionMenuAction.ARCHIVE,
          icon: 'archive'
        }
      ];
      this.actionMenuItems[1] = [deleteMenuAction];
    }
  }

  /**
   * Generates a bulk menu with only a delete option.
   * @param label Delete action label
   */
  private getDeleteMenu(label: string): void {
    const deleteMenuAction: ActionMenuItem = {
      label: label,
      action: BulkActionMenuAction.DELETE,
      icon: 'delete',
      red: true
    };

    this.actionMenuItems[0] = [deleteMenuAction];
  }

  private getAgentMenu(): void {
    this.actionMenuItems[0] = [
      {
        label: BulkActionMenuLabel.ACTIVATE_AGENTS,
        action: BulkActionMenuAction.ACTIVATE,
        icon: 'radio_button_checked'
      },
      {
        label: BulkActionMenuLabel.DEACTIVATE_AGENTS,
        action: BulkActionMenuAction.DEACTIVATE,
        icon: 'radio_button_unchecked'
      }
    ];

    this.actionMenuItems[1] = [
      {
        label: BulkActionMenuLabel.DELETE_AGENTS,
        action: BulkActionMenuAction.DELETE,
        icon: 'delete',
        red: true
      }
    ];
  }

  reload(): void {
    this.loadMenu();
  }
}
