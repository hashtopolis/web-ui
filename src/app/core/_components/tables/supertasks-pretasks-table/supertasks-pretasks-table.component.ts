/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  HTTableColumn,
  HTTableIcon,
  HTTableRouterLink
} from '../ht-table/ht-table.models';
import {
  SupertasksPretasksTableCol,
  SupertasksPretasksTableColumnLabel
} from './supertasks-pretasks-table.constants';
import { catchError, forkJoin } from 'rxjs';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { Cacheable } from 'src/app/core/_decorators/cacheable';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { Pretask } from 'src/app/core/_models/pretask.model';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { SuperTasksPretasksDataSource } from 'src/app/core/_datasources/supertasks-pretasks.datasource';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'supertasks-pretasks-table',
  templateUrl: './supertasks-pretasks-table.component.html'
})
export class SuperTasksPretasksTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  @Input() supertaskId = 0;

  tableColumns: HTTableColumn[] = [];
  dataSource: SuperTasksPretasksDataSource;

  ngOnInit(): void {
    this.setColumnLabels(SupertasksPretasksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new SuperTasksPretasksDataSource(
      this.cdr,
      this.gs,
      this.uiService
    );
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

  filter(item: Pretask, filterValue: string): boolean {
    return item.taskName.toLowerCase().includes(filterValue);
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: SupertasksPretasksTableCol.ID,
        dataKey: 'pretaskId',
        routerLink: (pretask: Pretask) => this.renderPretaskLink(pretask),
        isSortable: true,
        export: async (pretask: Pretask) => pretask._id + ''
      },
      {
        id: SupertasksPretasksTableCol.NAME,
        dataKey: 'taskName',
        isSortable: true,
        render: (pretask: Pretask) => pretask.taskName,
        export: async (pretask: Pretask) => pretask.taskName + ''
      },
      {
        id: SupertasksPretasksTableCol.PRIORITY,
        dataKey: 'priority',
        isSortable: true,
        // render: (pretask: Pretask) => this.renderPriorityColumn(pretask),
        export: async (pretask: Pretask) => pretask.priority + ''
      }
    ];

    return tableColumns;
  }

  openDialog(data: DialogData<Pretask>) {
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

  exportActionClicked(event: ActionMenuEvent<Pretask[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<Pretask>(
          'hashtopolis-supertasks-pretasks',
          this.tableColumns,
          event.data,
          SupertasksPretasksTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<Pretask>(
          'hashtopolis-supertasks-pretasks',
          this.tableColumns,
          event.data,
          SupertasksPretasksTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<Pretask>(
            this.tableColumns,
            event.data,
            SupertasksPretasksTableColumnLabel
          )
          .then(() => {
            this.snackBar.open(
              'The selected rows are copied to the clipboard',
              'Close'
            );
          });
        break;
    }
  }

  rowActionClicked(event: ActionMenuEvent<Pretask>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.EDIT:
        this.rowActionEdit(event.data);
        break;
      case RowActionMenuAction.COPY_TO_TASK:
        console.log('Copy to Task clicked:', event.data);
        this.rowActionCopyToTask(event.data);
        break;
      case RowActionMenuAction.COPY_TO_PRETASK:
        console.log('Copy to Pretask clicked:', event.data);
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

  bulkActionClicked(event: ActionMenuEvent<Pretask[]>): void {
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
  private bulkActionDelete(pretasks: Pretask[]): void {
    //Get the IDs of pretasks to be deleted
    const pretaskIdsToDelete = pretasks.map((pretask) => pretask._id);
    //Remove the selected pretasks from the list
    const updatedPretasks = this.dataSource
      .getData()
      .filter((pretask) => !pretaskIdsToDelete.includes(pretask._id));
    //Update the supertask with the modified list of pretasks
    const payload = { pretasks: updatedPretasks.map((pretask) => pretask._id) };
    //Update the supertask with the new list of pretasks
    const updateRequest = this.gs.update(
      SERV.SUPER_TASKS,
      this.supertaskId,
      payload
    );
    this.subscriptions.push(
      updateRequest
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open(
            `Successfully deleted ${pretasks.length} pretasks!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  @Cacheable(['pretaskId'])
  async renderPretaskLink(pretask: Pretask): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink: ['/tasks/preconfigured-tasks/', pretask._id, 'edit']
      }
    ];
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(pretasks: Pretask[]): void {
    //Get the IDs of pretasks to be deleted
    const pretaskIdsToDelete = pretasks.map((pretask) => pretask._id);
    //Remove the selected pretasks from the list
    const updatedPretasks = this.dataSource
      .getData()
      .filter((pretask) => !pretaskIdsToDelete.includes(pretask._id));
    //Update the supertask with the modified list of pretasks
    const payload = { pretasks: updatedPretasks.map((pretask) => pretask._id) };
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

  /**
   * @todo Implement error handling.
   */
  private rowSavePriority(pretasks: Pretask[]): void {
    this.subscriptions.push(
      this.gs
        .update(SERV.PRETASKS, pretasks[0]._id, {
          priority: 2
        })
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

  renderPriorityColumn(pretask: Pretask): SafeHtml {
    const inputHtml = `
        <mat-form-field appearance="fill">
          <input matInput type="number" value="${pretask.priority}" (change)="rowSavePriority($event.target.value, ${pretask._id})" />
        </mat-form-field>
        <button mat-icon-button (click)="rowSavePriority(pretask.priority, ${pretask._id})">
          <mat-icon>save</mat-icon>
        </button>
      `;
    return this.sanitizer.bypassSecurityTrustHtml(inputHtml);
  }

  private rowActionCopyToTask(pretask: Pretask): void {
    this.router.navigate(['/tasks/new-tasks', pretask._id, 'copypretask']);
  }

  private rowActionCopyToPretask(pretask: Pretask): void {
    this.router.navigate(['/tasks/preconfigured-tasks', pretask._id, 'copy']);
  }

  private rowActionEdit(pretasks: Pretask): void {
    this.renderPretaskLink(pretasks).then((links: HTTableRouterLink[]) => {
      this.router.navigate(links[0].routerLink);
    });
  }
}
