import { Component, OnDestroy, OnInit } from '@angular/core';
import { HTTableColumn, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';
import {
  SupertasksTableCol,
  SupertasksTableColumnLabel
} from '@components/tables/supertasks-table/supertasks-table.constants';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';
import { FilterType } from '@src/app/core/_models/request-params.model';
import { JSuperTask } from '@models/supertask.model';
import { ModalPretasksComponent } from '@src/app/tasks/supertasks/modal-pretasks/modal-pretasks.component';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { SERV } from '@services/main.config';
import { SuperTaskContextMenuService } from '@services/context-menu/tasks/supertask-menu.service';
import { SuperTasksDataSource } from '@datasources/supertasks.datasource';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-supertasks-table',
  templateUrl: './supertasks-table.component.html',
  standalone: false
})
export class SuperTasksTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  tableColumns: HTTableColumn[] = [];
  dataSource: SuperTasksDataSource;
  selectedFilterColumn: string;

  ngOnInit(): void {
    this.setColumnLabels(SupertasksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new SuperTasksDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
    this.contextMenuService = new SuperTaskContextMenuService(this.permissionService).addContextMenu();
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
  filter(input: string) {
    const selectedColumn = this.selectedFilterColumn;
    if (input && input.length > 0) {
      this.dataSource.loadAll({ value: input, field: selectedColumn, operator: FilterType.ICONTAINS });
      return;
    } else {
      this.dataSource.loadAll(); // Reload all data if input is empty
    }
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: SupertasksTableCol.ID,
        dataKey: 'supertaskId',
        isSortable: true,
        isSearchable: true,
        render: (supertask: JSuperTask) => supertask.id,
        export: async (supertask: JSuperTask) => supertask.id + ''
      },
      {
        id: SupertasksTableCol.NAME,
        dataKey: 'supertaskName',
        routerLink: (supertask: JSuperTask) => this.renderSupertaskLink(supertask),
        isSortable: true,
        isSearchable: true,
        export: async (supertask: JSuperTask) => supertask.supertaskName
      },
      {
        id: SupertasksTableCol.PRETASKS,
        dataKey: 'pretasks',
        isSortable: false,
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
    this.exportService.handleExportAction<JSuperTask>(
      event,
      this.tableColumns,
      SupertasksTableColumnLabel,
      'hashtopolis-supertasks'
    );
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
    this.gs.bulkDelete(SERV.SUPER_TASKS, supertask).subscribe(() => {
      this.alertService.showSuccessMessage(`Successfully deleted supertasks!`);
      this.dataSource.reload();
    });
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
          this.alertService.showSuccessMessage('Successfully deleted supertask!');
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
