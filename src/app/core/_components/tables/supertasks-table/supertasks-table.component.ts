/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HTTableColumn, HTTableRouterLink } from '../ht-table/ht-table.models';
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
import { ModalPretasksComponent } from 'src/app/tasks/supertasks/modal-pretasks/modal-pretasks.component';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { SuperTaskData } from 'src/app/core/_models/supertask.model';
import { SuperTasksDataSource } from 'src/app/core/_datasources/supertasks.datasource';
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

  filter(item: SuperTaskData, filterValue: string): boolean {
    return item.attributes.supertaskName.toLowerCase().includes(filterValue);
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: SupertasksTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        export: async (supertask: SuperTaskData) => supertask.id + ''
      },
      {
        id: SupertasksTableCol.NAME,
        dataKey: 'supertaskName',
        routerLink: (supertask: SuperTaskData) =>
          this.renderSupertaskLink(supertask),
        isSortable: true,
        export: async (supertask: SuperTaskData) => supertask.attributes.supertaskName
      },
      {
        id: SupertasksTableCol.PRETASKS,
        dataKey: 'pretasks',
        isSortable: true,
        render: (supertask: SuperTaskData) => supertask.relationships.pretasks.data.length,
        export: async (supertask: SuperTaskData) =>
          supertask.relationships.pretasks.data.length.toString()
      }
    ];

    return tableColumns;
  }

  openDialog(data: DialogData<SuperTaskData>) {
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

  exportActionClicked(event: ActionMenuEvent<SuperTaskData[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<SuperTaskData>(
          'hashtopolis-supertasks',
          this.tableColumns,
          event.data,
          SupertasksTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<SuperTaskData>(
          'hashtopolis-supertasks',
          this.tableColumns,
          event.data,
          SupertasksTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<SuperTaskData>(
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

  rowActionClicked(event: ActionMenuEvent<SuperTaskData>): void {
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
          title: `Deleting Supertask ${event.data.attributes.supertaskName} ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<SuperTaskData[]>): void {
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
  private bulkActionDelete(supertask: SuperTaskData[]): void {
    const requests = supertask.map((supertask: SuperTaskData) => {
      return this.gs.delete(SERV.SUPER_TASKS, supertask.id);
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

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(supertasks: SuperTaskData[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.SUPER_TASKS, supertasks[0].id)
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

  private rowActionApplyToHashlist(supertask: SuperTaskData): void {
    this.router.navigate(['/tasks/', supertask.id, 'applyhashlist']);
  }

  private rowActionEditSubtasks(supertask: SuperTaskData): void {
    const dialogRef = this.dialog.open(ModalPretasksComponent, {
      width: '100%',
      data: {
        supertaskId: supertask.id,
        supertaskName: supertask.attributes.supertaskName
      }
    });

    dialogRef.afterClosed().subscribe();
  }

  private rowActionEdit(supertask: SuperTaskData): void {
    this.renderSupertaskLink(supertask).then((links: HTTableRouterLink[]) => {
      this.router.navigate(links[0].routerLink);
    });
  }
}
