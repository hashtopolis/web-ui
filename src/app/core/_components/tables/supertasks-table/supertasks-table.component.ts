import { catchError, forkJoin } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { JSuperTask } from '@models/supertask.model';

import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { ExportMenuAction } from '@components/menus/export-menu/export-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { HTTableColumn, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';
import {
  SupertasksTableCol,
  SupertasksTableColumnLabel
} from '@components/tables/supertasks-table/supertasks-table.constants';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';

import { SuperTasksDataSource } from '@datasources/supertasks.datasource';

import { ModalPretasksComponent } from '@src/app/tasks/supertasks/modal-pretasks/modal-pretasks.component';

@Component({
  selector: 'app-supertasks-table',
  templateUrl: './supertasks-table.component.html',
  standalone: false
})
export class SuperTasksTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  tableColumns: HTTableColumn[] = [];
  dataSource: SuperTasksDataSource;

  ngOnInit(): void {
    this.setColumnLabels(SupertasksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new SuperTasksDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: JSuperTask, filterValue: string): boolean {
    return item.supertaskName.toLowerCase().includes(filterValue);
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: SupertasksTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        export: async (supertask: JSuperTask) => supertask.id + ''
      },
      {
        id: SupertasksTableCol.NAME,
        dataKey: 'supertaskName',
        routerLink: (supertask: JSuperTask) => this.renderSupertaskLink(supertask),
        isSortable: true,
        export: async (supertask: JSuperTask) => supertask.supertaskName
      },
      {
        id: SupertasksTableCol.PRETASKS,
        dataKey: 'pretasks',
        isSortable: true,
        render: (supertask: JSuperTask) => supertask.pretasks.length,
        export: async (supertask: JSuperTask) => supertask.pretasks.length.toString()
      }
    ];
  }

  openDialog(data: DialogData<JSuperTask>) {
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

  exportActionClicked(event: ActionMenuEvent<JSuperTask[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<JSuperTask>(
          'hashtopolis-supertasks',
          this.tableColumns,
          event.data,
          SupertasksTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<JSuperTask>(
          'hashtopolis-supertasks',
          this.tableColumns,
          event.data,
          SupertasksTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<JSuperTask>(this.tableColumns, event.data, SupertasksTableColumnLabel)
          .then(() => {
            this.snackBar.open('The selected rows are copied to the clipboard', 'Close');
          });
        break;
    }
  }

  rowActionClicked(event: ActionMenuEvent<JSuperTask>): void {
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

  bulkActionClicked(event: ActionMenuEvent<JSuperTask[]>): void {
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
  private bulkActionDelete(supertask: JSuperTask[]): void {
    const requests = supertask.map((supertask: JSuperTask) => {
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
          this.snackBar.open(`Successfully deleted ${results.length} supertasks!`, 'Close');
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(supertasks: JSuperTask[]): void {
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

  private rowActionApplyToHashlist(supertask: JSuperTask): void {
    this.router.navigate(['/tasks/', supertask.id, 'applyhashlist']).then(() => {});
  }

  private rowActionEditSubtasks(supertask: JSuperTask): void {
    const dialogRef = this.dialog.open(ModalPretasksComponent, {
      width: '100%',
      data: {
        supertaskId: supertask.id,
        supertaskName: supertask.supertaskName
      }
    });

    dialogRef.afterClosed().subscribe();
  }

  private rowActionEdit(supertask: JSuperTask): void {
    this.renderSupertaskLink(supertask)
      .subscribe((links: HTTableRouterLink[]) => {
        this.router.navigate(links[0].routerLink).then(() => {});
      })
      .unsubscribe();
  }
}
