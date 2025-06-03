import { Observable, catchError, of } from 'rxjs';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { JPretask } from '@models/pretask.model';

import { RelationshipType, SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { ExportMenuAction } from '@components/menus/export-menu/export-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { HTTableColumn, HTTableEditable, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';
import {
  SupertasksPretasksTableCol,
  SupertasksPretasksTableColumnLabel,
  SupertasksPretasksTableEditableAction
} from '@components/tables/supertasks-pretasks-table/supertasks-pretasks-table.constants';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';

import { SuperTasksPretasksDataSource } from '@datasources/supertasks-pretasks.datasource';

@Component({
  selector: 'app-supertasks-pretasks-table',
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
    return [
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
    // const pretaskIdsToDelete = pretasks.map((pretask) => pretask.id);
    // //Remove the selected pretasks from the list
    // const updatedPretasks = this.dataSource.getData().filter((pretask) => !pretaskIdsToDelete.includes(pretask.id));
    // //Update the supertask with the modified list of pretasks
    // const payload = { pretasks: updatedPretasks.map((pretask) => pretask.id) };
    // //Update the supertask with the new list of pretasks
    let pretaskData = [];

    pretasks.forEach((pretask) => {
      pretaskData.push({ type: RelationshipType.PRETASKS, id: pretask.id });
    });

    const responseBody = { data: pretasks };
    this.gs.deleteRelationships(SERV.SUPER_TASKS, this.supertaskId, RelationshipType.PRETASKS, responseBody).subscribe((results => {
      this.snackBar.open(`Successfully deleted pretasks from supertask!`, 'Close');
      this.dataSource.reload();
    }))

    // const updateRequest = this.gs.update(SERV.SUPER_TASKS, this.supertaskId, payload);
    // this.subscriptions.push(
    //   updateRequest
    //     .pipe(
    //       catchError((error) => {
    //         console.error('Error during deletion:', error);
    //         return [];
    //       })
    //     )
    //     .subscribe(() => {
    //       this.snackBar.open(`Successfully deleted ${pretasks.length} pretasks!`, 'Close');
    //       this.reload();
    //     })
    // );
  }

  private renderPretaskLink(pretask: JPretask): Observable<HTTableRouterLink[]> {
    return of([
      {
        routerLink: ['/tasks/preconfigured-tasks/', pretask.id, 'edit']
      }
    ]);
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(pretasks: JPretask[]): void {
    let pretaskData = [];

    pretasks.forEach((pretask) => {
      pretaskData.push({ type: RelationshipType.PRETASKS, id: pretask.id });
    });

    const responseBody = { data: pretaskData };
    this.subscriptions.push(
      this.gs.deleteRelationships(SERV.SUPER_TASKS, this.supertaskId, RelationshipType.PRETASKS, responseBody).pipe(
        catchError((error) => {
          console.error("Error during deleting: ", error);
          return [];
        })
      ).subscribe(() => {
        this.snackBar.open(`Successfully deleted pretasks from supertask!`, 'Close');
        this.dataSource.reload();
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
    this.renderPretaskLink(pretasks)
      .subscribe((links: HTTableRouterLink[]) => {
        this.router.navigate(links[0].routerLink).then(() => {});
      })
      .unsubscribe();
  }
}
