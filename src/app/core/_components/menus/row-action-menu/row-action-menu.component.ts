/* eslint-disable @angular-eslint/component-selector */
import { Component, OnInit } from '@angular/core';
import {
  RowActionMenuAction,
  RowActionMenuLabel
} from './row-action-menu.constants';

import { ActionMenuItem } from '../action-menu/action-menu.model';
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
      this.getEditDeleteMenu(
        RowActionMenuLabel.EDIT_AGENT,
        RowActionMenuLabel.DELETE_AGENT
      );
    } else if (this.isSuperHashlist()) {
      this.getEditDeleteMenu(
        RowActionMenuLabel.EDIT_SUPERHASHLIST,
        RowActionMenuLabel.DELETE_SUPERHASHLIST
      );
    } else if (this.isAgentBinary()) {
      this.getEditDeleteMenu(
        RowActionMenuLabel.EDIT_AGENTBINARY,
        RowActionMenuLabel.DELETE_AGENTBINARY
      );
    } else if (this.isFile()) {
      this.getEditDeleteMenu(
        RowActionMenuLabel.EDIT_FILE,
        RowActionMenuLabel.DELETE_FILE
      );
    } else if (this.isPreprocessor()) {
      this.getEditDeleteMenu(
        RowActionMenuLabel.EDIT_PREPROCESSOR,
        RowActionMenuLabel.DELETE_PREPROCESSOR
      );
    } else if (this.isTask()) {
      this.getTaskMenu();
    } else if (this.isHashlist()) {
      this.getHashlistMenu();
    } else if (this.isHashtype()) {
      this.getHashtypeMenu();
    } else if (this.isCrackerBinaryType()) {
      this.getCrackerBinaryTypeMenu();
    }
  }

  /**
   * Get the context menu items for a cracker data row.
   */
  private getCrackerBinaryTypeMenu(): void {
    this.actionMenuItems[0] = [
      {
        label: RowActionMenuLabel.NEW_VERSION,
        action: RowActionMenuAction.NEW,
        icon: 'add'
      }
    ];
    this.actionMenuItems[1] = [
      {
        label: RowActionMenuLabel.DELETE_CRACKER,
        action: RowActionMenuAction.DELETE,
        icon: 'delete',
        red: true
      }
    ];
  }

  /**
   * Get context menu with edit and delete action.
   */
  private getEditDeleteMenu(editLabel: string, deleteLabel: string): void {
    this.actionMenuItems[0] = [
      {
        label: editLabel,
        action: RowActionMenuAction.EDIT,
        icon: 'edit'
      }
    ];
    this.actionMenuItems[1] = [
      {
        label: deleteLabel,
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
    this.actionMenuItems[0] = [];

    const deleteMenuItem: ActionMenuItem = {
      label: RowActionMenuLabel.DELETE_HASHLIST,
      action: RowActionMenuAction.DELETE,
      icon: 'delete',
      red: true
    };

    if (this.data['isArchived']) {
      this.actionMenuItems[0].push(deleteMenuItem);
    } else {
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
      this.actionMenuItems[1] = [deleteMenuItem];
    }
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

  private getHashtypeMenu(): void {
    this.actionMenuItems[0] = [];

    const deleteMenuItem: ActionMenuItem = {
      label: RowActionMenuLabel.DELETE_HASHTYPE,
      action: RowActionMenuAction.DELETE,
      icon: 'delete',
      red: true
    };

    this.actionMenuItems[0].push(deleteMenuItem);
  }
}
