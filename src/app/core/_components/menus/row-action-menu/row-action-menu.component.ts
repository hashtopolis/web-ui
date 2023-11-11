/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit } from '@angular/core';
import {
  RowActionMenuAction,
  RowActionMenuLabel
} from './row-action-menu.constants';

import { BaseMenuComponent } from '../base-menu/base-menu.component';

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
      this.getAgentMenu();
    } else if (this.isTask()) {
      this.getTaskMenu();
    } else if (this.isHashlist()) {
      this.getHashlistMenu();
    }
  }

  /**
   * Get the context menu items for an agent data row.
   */
  private getAgentMenu(): void {
    this.actionMenuItems[0] = [
      {
        label: RowActionMenuLabel.EDIT_AGENT,
        action: RowActionMenuAction.EDIT,
        icon: 'edit'
      }
    ];
    this.actionMenuItems[1] = [
      {
        label: RowActionMenuLabel.DELETE_AGENT,
        action: RowActionMenuAction.DELETE,
        icon: 'delete',
        red: true
      }
    ];
  }

  /**
   * Get the context menu items for an agent data row.
   */
  private getHashlistMenu(): void {
    this.actionMenuItems[0] = [
      {
        label: RowActionMenuLabel.EDIT_HASHLIST,
        action: RowActionMenuAction.EDIT,
        icon: 'edit'
      },
      {
        label: RowActionMenuLabel.IMPORT_HASHLIST,
        action: RowActionMenuAction.IMPORT,
        icon: 'arrow_upwards'
      },
      {
        label: RowActionMenuLabel.EXPORT_HASHLIST,
        action: RowActionMenuAction.EXPORT,
        icon: 'arrow_downward'
      }
    ];
    this.actionMenuItems[1] = [
      {
        label: RowActionMenuLabel.DELETE_HASHLIST,
        action: RowActionMenuAction.DELETE,
        icon: 'delete',
        red: true
      }
    ];
  }

  /**
   * Get the context menu items for a task data row.
   */
  private getTaskMenu(): void {
    this.actionMenuItems[0] = [
      {
        label: RowActionMenuLabel.EDIT_TASK,
        action: RowActionMenuAction.EDIT,
        icon: 'edit'
      }
    ];

    this.actionMenuItems[1] = [
      {
        label: RowActionMenuLabel.DELETE_TASK,
        action: RowActionMenuAction.DELETE,
        icon: 'delete',
        red: true
      }
    ];

    if (this.data.taskType === 0) {
      this.actionMenuItems[0].push({
        label: RowActionMenuLabel.COPY_TO_TASK,
        action: RowActionMenuAction.COPY_TO_TASK,
        icon: 'content_copy'
      });
      this.actionMenuItems[0].push({
        label: RowActionMenuLabel.COPY_TO_PRETASK,
        action: RowActionMenuAction.COPY_TO_PRETASK,
        icon: 'content_copy'
      });
    } else if (this.data.taskType === 1) {
      this.actionMenuItems[0].push({
        label: RowActionMenuLabel.EDIT_SUBTASKS,
        action: RowActionMenuAction.EDIT_SUBTASKS,
        icon: 'edit'
      });
    }

    this.actionMenuItems[0].push({
      label: RowActionMenuLabel.ARCHIVE_TASK,
      action: RowActionMenuAction.ARCHIVE,
      icon: 'archive'
    });
  }
}
