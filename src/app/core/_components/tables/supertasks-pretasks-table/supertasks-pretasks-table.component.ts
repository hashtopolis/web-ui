/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HTTableColumn, HTTableEditable, HTTableRouterLink } from '../ht-table/ht-table.models';
import {
  SupertasksPretasksTableCol,
  SupertasksPretasksTableColumnLabel,
  SupertasksPretasksTableEditableAction
} from './supertasks-pretasks-table.constants';
import { catchError } from 'rxjs';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { Cacheable } from 'src/app/core/_decorators/cacheable';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { JPretask } from 'src/app/core/_models/pretask.model';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { SuperTasksPretasksDataSource } from 'src/app/core/_datasources/supertasks-pretasks.datasource';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';

@Component({
    selector: 'supertasks-pretasks-table',
    templateUrl: './supertasks-pretasks-table.component.html',
    standalone: false
})
export class SuperTasksPretasksTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  @Input() supertaskId = 0;

  tableColumns: HTTableColumn[] = [];
  dataSource: SuperTasksPretasksDataSource;

  ngOnInit(): void {
    this.setColumnLabels(SupertasksPretasksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new SuperTasksPretasksDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    if (this.supertaskId) {
      this.dataSource.setSuperTaskId(this.supertaskId);
    }
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: JPretask, filterValue: string): boolean {
    return item.taskName.toLowerCase().includes(filterValue);
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: SupertasksPretasksTableCol.ID,
        dataKey: 'id',
        routerLink: (pretask: JPretask) => this.renderPretaskLink(pretask),
        isSortable: true,
        export: async (pretask: JPretask) => pretask.id + ''
      },
      {
        id: SupertasksPretasksTableCol.NAME,
        dataKey: 'taskName',
        isSortable: true,
        render: (pretask: JPretask) => pretask.taskName,
        export: async (pretask: JPretask) => pretask.taskName + ''
      },
      {
        id: SupertasksPretasksTableCol.PRIORITY,
        dataKey: 'priority',
        editable: (pretask: JPretask) => {
          return {
            data: pretask,
            value: pretask.priority + '',
            action: SupertasksPretasksTableEditableAction.CHANGE_PRIORITY
          };
        },
        isSortable: true,
        export: async (pretask: JPretask) => pretask.priority + ''
      },
      {
        id: SupertasksPretasksTableCol.MAX_AGENTS,
        dataKey: 'maxAgents',
        editable: (pretask: JPretask) => {
          return {
            data: pretask,
            value: pretask.maxAgents + '',
            action: SupertasksPretasksTableEditableAction.CHANGE_MAX_AGENTS
          };
        },
        isSortable: true,
        export: async (pretask: JPretask) => pretask.maxAgents + ''
      }
    ];

    return tableColumns;
  }

  openDialog(data: DialogData<JPretask>) {
    const dialogRef = this.dialog.open(TableDialogComponent, {
      data: data,
      width: '450px'
    });

    this.subscriptions.push(
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.action) {
          switch (result.action) {
            case RowActionMenuAction.DELETE:
              this.rowActionDelete(result.data);
              break;
            case BulkActionMenuAction.DELETE:
              this.bulkActionDelete(result.data);
              break;
          }
        }
      })
    );
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<JPretask[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<JPretask>(
          'hashtopolis-supertasks-pretasks',
          this.tableColumns,
          event.data,
          SupertasksPretasksTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<JPretask>(
          'hashtopolis-supertasks-pretasks',
          this.tableColumns,
          event.data,
          SupertasksPretasksTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<JPretask>(this.tableColumns, event.data, SupertasksPretasksTableColumnLabel)
          .then(() => {
            this.snackBar.open('The selected rows are copied to the clipboard', 'Close');
          });
        break;
    }
  }

  rowActionClicked(event: ActionMenuEvent<JPretask>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.EDIT:
        this.rowActionEdit(event.data);
        break;
      case RowActionMenuAction.COPY_TO_TASK:
        this.rowActionCopyToTask(event.data);
        break;
      case RowActionMenuAction.COPY_TO_PRETASK:
        this.rowActionCopyToPretask(event.data);
        break;
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting Pretask ${event.data.taskName} ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<JPretask[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} pretasks ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above pretasks? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'supertaskName',
          action: event.menuItem.action
        });
        break;
    }
  }

  /**
   * @todo Implement delete, currently we need to update to delete
   */
  private bulkActionDelete(pretasks: JPretask[]): void {
    //Get the IDs of pretasks to be deleted
    const pretaskIdsToDelete = pretasks.map((pretask) => pretask.id);
    //Remove the selected pretasks from the list
    const updatedPretasks = this.dataSource.getData().filter((pretask) => !pretaskIdsToDelete.includes(pretask.id));
    //Update the supertask with the modified list of pretasks
    const payload = { pretasks: updatedPretasks.map((pretask) => pretask.id) };
    //Update the supertask with the new list of pretasks
    const updateRequest = this.gs.update(SERV.SUPER_TASKS, this.supertaskId, payload);
    this.subscriptions.push(
      updateRequest
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open(`Successfully deleted ${pretasks.length} pretasks!`, 'Close');
          this.reload();
        })
    );
  }

  @Cacheable(['id'])
  async renderPretaskLink(pretask: JPretask): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink: ['/tasks/preconfigured-tasks/', pretask.id, 'edit']
      }
    ];
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(pretasks: JPretask[]): void {
    //Get the IDs of pretasks to be deleted
    const pretaskIdsToDelete = pretasks.map((pretask) => pretask.id);
    //Remove the selected pretasks from the list
    const updatedPretasks = this.dataSource.getData().filter((pretask) => !pretaskIdsToDelete.includes(pretask.id));
    //Update the supertask with the modified list of pretasks
    const payload = { pretasks: updatedPretasks.map((pretask) => pretask.id) };
    this.subscriptions.push(
      this.gs
        .update(SERV.SUPER_TASKS, this.supertaskId, payload)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open('Successfully deleted pretasks!', 'Close');
          this.reload();
        })
    );
  }

  editableSaved(editable: HTTableEditable<JPretask>): void {
    switch (editable.action) {
      case SupertasksPretasksTableEditableAction.CHANGE_PRIORITY:
        this.changePriority(editable.data, editable.value);
        break;
      case SupertasksPretasksTableEditableAction.CHANGE_MAX_AGENTS:
        this.changeMaxAgents(editable.data, editable.value);
        break;
    }
  }

  private changePriority(pretask: JPretask, priority: string): void {
    let val = 0;
    try {
      val = parseInt(priority);
    } catch (error) {
      // Do nothing
    }

    if (!val || pretask.priority == val) {
      this.snackBar.open('Nothing changed!', 'Close');
      return;
    }

    const request$ = this.gs.update(SERV.PRETASKS, pretask.id, {
      priority: val
    });
    this.subscriptions.push(
      request$
        .pipe(
          catchError((error) => {
            this.snackBar.open(`Failed to update priority!`, 'Close');
            console.error('Failed to update priority:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open(`Changed priority to ${val} on PreTask #${pretask.id}!`, 'Close');
          this.reload();
        })
    );
  }

  private changeMaxAgents(pretask: JPretask, max: string): void {
    let val = 0;
    try {
      val = parseInt(max);
    } catch (error) {
      // Do nothing
    }

    if (!val || pretask.maxAgents == val) {
      this.snackBar.open('Nothing changed!', 'Close');
      return;
    }

    const request$ = this.gs.update(SERV.PRETASKS, pretask.id, {
      maxAgents: val
    });
    this.subscriptions.push(
      request$
        .pipe(
          catchError((error) => {
            this.snackBar.open(`Failed to update max agents!`, 'Close');
            console.error('Failed to update max agents:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open(`Changed number of max agents to ${val} on PreTask #${pretask.id}!`, 'Close');
          this.reload();
        })
    );
  }

  private rowActionCopyToTask(pretask: JPretask): void {
    this.router.navigate(['/tasks/new-tasks', pretask.id, 'copypretask']);
  }

  private rowActionCopyToPretask(pretask: JPretask): void {
    this.router.navigate(['/tasks/preconfigured-tasks', pretask.id, 'copy']);
  }

  private rowActionEdit(pretasks: JPretask): void {
    this.renderPretaskLink(pretasks).then((links: HTTableRouterLink[]) => {
      this.router.navigate(links[0].routerLink);
    });
  }
}
