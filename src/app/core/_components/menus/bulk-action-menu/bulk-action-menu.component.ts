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
      this.getHashtypesMenu();
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

  private getHashtypesMenu(): void {
    const deleteMenuAction: ActionMenuItem = {
      label: BulkActionMenuLabel.DELETE_HASHTYPES,
      action: BulkActionMenuAction.DELETE,
      icon: 'delete',
      red: true
    };

    this.actionMenuItems[0] = [deleteMenuAction];
  }

  private getTaskMenu(): void {
    this.actionMenuItems[0] = [
      {
        label: BulkActionMenuLabel.ARCHIVE_TASKS,
        action: BulkActionMenuAction.ARCHIVE,
        icon: 'archive'
      }
    ];

    this.actionMenuItems[1] = [
      {
        label: BulkActionMenuLabel.DELETE_TASKS,
        action: BulkActionMenuAction.DELETE,
        icon: 'delete',
        red: true
      }
    ];
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
