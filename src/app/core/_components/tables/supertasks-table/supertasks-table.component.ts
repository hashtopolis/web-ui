/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  HTTableColumn,
  HTTableIcon,
  HTTableRouterLink
} from '../ht-table/ht-table.models';
import {
  SupertasksTableCol,
  SupertasksTableColumnLabel
} from './supertasks-table.constants';
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
import { SuperTask } from 'src/app/core/_models/supertask.model';
import { SuperTasksDataSource } from 'src/app/core/_datasources/super-tasks.datasource';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';

@Component({
  selector: 'supertasks-table',
  templateUrl: './supertasks-table.component.html'
})
export class SuperTasksTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  tableColumns: HTTableColumn[] = [];
  dataSource: SuperTasksDataSource;

  ngOnInit(): void {
    this.setColumnLabels(SupertasksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new SuperTasksDataSource(
      this.cdr,
      this.gs,
      this.uiService
    );
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: SuperTask, filterValue: string): boolean {
    return item.supertaskName.toLowerCase().includes(filterValue);
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: SupertasksTableCol.ID,
        dataKey: '_id',
        isSortable: true,
        export: async (supertask: SuperTask) => supertask._id + ''
      },
      {
        id: SupertasksTableCol.NAME,
        dataKey: 'supertaskName',
        routerLink: (supertask: SuperTask) =>
          this.renderSupertaskLink(supertask),
        isSortable: true,
        export: async (supertask: SuperTask) => supertask.supertaskName
      },
      {
        id: SupertasksTableCol.PRETASKS,
        dataKey: 'pretasks',
        isSortable: true,
        render: (supertask: SuperTask) => supertask.pretasks.length,
        export: async (supertask: SuperTask) =>
          supertask.pretasks.length.toString()
      }
    ];

    return tableColumns;
  }

  openDialog(data: DialogData<SuperTask>) {
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

  exportActionClicked(event: ActionMenuEvent<SuperTask[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<SuperTask>(
          'hashtopolis-supertasks',
          this.tableColumns,
          event.data,
          SupertasksTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<SuperTask>(
          'hashtopolis-supertasks',
          this.tableColumns,
          event.data,
          SupertasksTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<SuperTask>(
            this.tableColumns,
            event.data,
            SupertasksTableColumnLabel
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

  rowActionClicked(event: ActionMenuEvent<SuperTask>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.EDIT:
        this.rowActionEdit(event.data);
        break;
      case RowActionMenuAction.APPLY_TO_HASHLIST:
        this.rowActionApplyToHashlist(event.data);
        break;
      case RowActionMenuAction.EDIT_SUBTASKS:
        this.rowActionEditSubtasks(event.data);
        break;
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting Supertask ${event.data.supertaskName} ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<SuperTask[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} supertasks ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above supertasks? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'supertaskName',
          action: event.menuItem.action
        });
        break;
    }
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(supertask: SuperTask[]): void {
    const requests = supertask.map((supertask: SuperTask) => {
      return this.gs.delete(SERV.SUPER_TASKS, supertask._id);
    });

    this.subscriptions.push(
      forkJoin(requests)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe((results) => {
          this.snackBar.open(
            `Successfully deleted ${results.length} supertasks!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  @Cacheable(['_id'])
  async renderSupertaskLink(
    supertask: SuperTask
  ): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink: ['/tasks/', supertask._id, 'edit']
      }
    ];
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(supertasks: SuperTask[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.SUPER_TASKS, supertasks[0]._id)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open('Successfully deleted supertask!', 'Close');
          this.reload();
        })
    );
  }

  private rowActionApplyToHashlist(supertask: SuperTask): void {
    this.router.navigate(['/tasks/', supertask._id, 'applyhashlist']);
  }

  private rowActionEditSubtasks(supertask: SuperTask): void {
    console.log('here');
  }

  private rowActionEdit(supertask: SuperTask): void {
    this.renderSupertaskLink(supertask).then((links: HTTableRouterLink[]) => {
      this.router.navigate(links[0].routerLink);
    });
  }
}
