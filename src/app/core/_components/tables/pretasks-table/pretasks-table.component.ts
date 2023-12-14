/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  HTTableColumn,
  HTTableIcon,
  HTTableRouterLink
} from '../ht-table/ht-table.models';
import {
  PretasksTableCol,
  PretasksTableColumnLabel
} from './pretasks-table.constants';
import { catchError, forkJoin } from 'rxjs';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { Cacheable } from 'src/app/core/_decorators/cacheable';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { PreTasksDataSource } from 'src/app/core/_datasources/preconfigured-tasks.datasource';
import { Pretask } from 'src/app/core/_models/pretask.model';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { formatFileSize } from 'src/app/shared/utils/util';

@Component({
  selector: 'pretasks-table',
  templateUrl: './pretasks-table.component.html'
})
export class PretasksTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  tableColumns: HTTableColumn[] = [];
  dataSource: PreTasksDataSource;

  ngOnInit(): void {
    this.setColumnLabels(PretasksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new PreTasksDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: Pretask, filterValue: string): boolean {
    return (
      item.taskName.toLowerCase().includes(filterValue) ||
      item.attackCmd.toLowerCase().includes(filterValue)
    );
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: PretasksTableCol.ID,
        dataKey: '_id',
        isSortable: true,
        export: async (pretask: Pretask) => pretask._id + ''
      },
      {
        id: PretasksTableCol.NAME,
        dataKey: 'taskName',
        routerLink: (pretask: Pretask) => this.renderPretaskLink(pretask),
        isSortable: true,
        export: async (pretask: Pretask) => pretask.taskName
      },
      {
        id: PretasksTableCol.ATTACK_COMMAND,
        dataKey: 'attackCmd',
        isSortable: true,
        export: async (pretask: Pretask) => pretask.attackCmd
      },
      {
        id: PretasksTableCol.FILES_TOTAL,
        dataKey: 'pretaskFiles',
        isSortable: true,
        icons: (pretask: Pretask) => this.renderSecretIcon(pretask),
        render: (pretask: Pretask) => pretask.pretaskFiles.length,
        export: async (pretask: Pretask) =>
          pretask.pretaskFiles.length.toString()
      },
      {
        id: PretasksTableCol.FILES_SIZE,
        dataKey: 'pretaskFiles',
        isSortable: true,
        render: (pretask: Pretask) =>
          formatFileSize(
            pretask.pretaskFiles.reduce((sum, file) => sum + file.size, 0),
            'short'
          ),
        export: async (pretask: Pretask) =>
          formatFileSize(
            pretask.pretaskFiles.reduce((sum, file) => sum + file.size, 0),
            'short'
          )
      },
      {
        id: PretasksTableCol.PRIORITY,
        dataKey: 'priority',
        isSortable: true,
        export: async (pretask: Pretask) => pretask.priority.toString()
      },
      {
        id: PretasksTableCol.MAX_AGENTS,
        dataKey: 'maxAgents',
        isSortable: true,
        export: async (pretask: Pretask) => pretask.maxAgents.toString()
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
          'hashtopolis-pretasks',
          this.tableColumns,
          event.data,
          PretasksTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<Pretask>(
          'hashtopolis-pretasks',
          this.tableColumns,
          event.data,
          PretasksTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<Pretask>(
            this.tableColumns,
            event.data,
            PretasksTableColumnLabel
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
          listAttribute: 'taskName',
          action: event.menuItem.action
        });
        break;
    }
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(pretasks: Pretask[]): void {
    const requests = pretasks.map((pretask: Pretask) => {
      return this.gs.delete(SERV.PRETASKS, pretask._id);
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
            `Successfully deleted ${results.length} pretasks!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  @Cacheable(['_id', 'isSecret'])
  async renderSecretIcon(pretask: Pretask): Promise<HTTableIcon[]> {
    const icons: HTTableIcon[] = [];
    const secretFilesCount = pretask.pretaskFiles.reduce(
      (sum, file) => sum + (file.isSecret ? 1 : 0),
      0
    );

    if (secretFilesCount > 0) {
      icons.push({
        name: 'lock',
        tooltip: `Secret: ${secretFilesCount} ${
          secretFilesCount > 1 ? 'files' : 'file'
        }`
      });
    }

    return icons;
  }

  @Cacheable(['_id'])
  async renderPretaskLink(pretask: Pretask): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink: ['/tasks/preconfigured-tasks', pretask._id, 'edit']
      }
    ];
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(pretasks: Pretask[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.PRETASKS, pretasks[0]._id)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open('Successfully deleted pretask!', 'Close');
          this.reload();
        })
    );
  }

  private rowActionCopyToTask(pretask: Pretask): void {
    this.router.navigate(['/tasks/new-tasks', pretask._id, 'copypretask']);
  }

  private rowActionCopyToPretask(pretask: Pretask): void {
    this.router.navigate(['/tasks/preconfigured-tasks', pretask._id, 'copy']);
  }

  private rowActionEdit(pretask: Pretask): void {
    this.renderPretaskLink(pretask).then((links: HTTableRouterLink[]) => {
      this.router.navigate(links[0].routerLink);
    });
  }
}
