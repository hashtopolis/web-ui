/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
import { calculateKeyspace } from 'src/app/shared/utils/estkeyspace_attack';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { PreTasksDataSource } from 'src/app/core/_datasources/preconfigured-tasks.datasource';
import { Pretask } from 'src/app/core/_models/pretask.model';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SafeHtml } from '@angular/platform-browser';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { formatFileSize } from 'src/app/shared/utils/util';

declare let options: any;
declare let defaultOptions: any;
declare let parser: any;

@Component({
  selector: 'pretasks-table',
  templateUrl: './pretasks-table.component.html'
})
export class PretasksTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  // Input property to specify an supertask ID for filtering pretasks.
  @Input() supertTaskId = 0;
  // Estimate runtime attack
  @Input() benchmarkA0 = 0;
  @Input() benchmarkA3 = 0;

  tableColumns: HTTableColumn[] = [];
  dataSource: PreTasksDataSource;

  ngOnInit(): void {
    this.setColumnLabels(PretasksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new PreTasksDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    if (this.supertTaskId) {
      this.dataSource.setSuperTaskId(this.supertTaskId);
    }
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
    const tableColumns: HTTableColumn[] = [
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
        render: (pretask: Pretask) => {
          const totalFileSize = pretask.pretaskFiles.reduce((sum, file) => {
            if (file && typeof file.size === 'number' && !isNaN(file.size)) {
              return sum + file.size;
            } else {
              return sum;
            }
          }, 0);
          return formatFileSize(totalFileSize, 'short');
        },
        export: async (pretask: Pretask) => {
          const totalFileSize = pretask.pretaskFiles.reduce((sum, file) => {
            if (file && typeof file.size === 'number' && !isNaN(file.size)) {
              return sum + file.size;
            } else {
              return sum;
            }
          }, 0);
          return formatFileSize(totalFileSize, 'short');
        }
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

    if (this.supertTaskId !== 0) {
      tableColumns.push({
        id: PretasksTableCol.ESTIMATED_KEYSPACE,
        dataKey: 'keyspaceSize',
        async: (pretask: Pretask) => this.renderEstimatedKeyspace(pretask),
        icons: undefined,
        isSortable: true,
        export: async (pretask: Pretask) =>
          Promise.resolve(this.renderEstimatedKeyspace(pretask).toString())
      });
      tableColumns.push({
        id: PretasksTableCol.ATTACK_RUNTIME,
        dataKey: 'keyspaceTime',
        icons: undefined,
        isSortable: true
        // render: (pretask: Pretask) =>
        //   this.renderKeyspaceTime(this.benchmarkA0, this.benchmarkA3, pretask)
      });
    }

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
    if (this.supertTaskId === 0) {
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
    } else {
      const filter = this.dataSource['originalData'].filter(
        (u) => u.pretaskId !== pretasks[0]._id
      );
      const payload = [];
      for (let i = 0; i < filter.length; i++) {
        payload.push(filter[i].pretaskId);
      }

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

  @Cacheable(['_id'])
  async renderEstimatedKeyspace(pretask: any): Promise<SafeHtml> {
    return calculateKeyspace(
      pretask.pretaskFiles[0].pretaskFiles,
      'lineCount',
      pretask.attackCmd,
      false
    );
  }

  @Cacheable(['_id'])
  async renderKeyspaceTime(
    a0: number,
    a3: number,
    pretask: any
  ): Promise<SafeHtml> {
    const result = await this.calculateKeyspaceTime(a0, a3, pretask);
    return result as unknown as SafeHtml;
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(pretasks: Pretask[]): void {
    if (this.supertTaskId === 0) {
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
    } else {
      const filter = this.dataSource['originalData'].filter(
        (u) => u.pretaskId !== pretasks[0]._id
      );
      const payload = [];
      for (let i = 0; i < filter.length; i++) {
        payload.push(filter[i].pretaskId);
      }
      this.subscriptions.push(
        this.gs
          .update(SERV.SUPER_TASKS, this.supertTaskId, { pretasks: payload })
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

  calculateKeyspaceTime(a0: number, a3: number, pretask: Pretask): void {
    {
      if (a0 !== 0 && a3 !== 0) {
        let totalSecondsSupertask = 0;
        let unknown_runtime_included = 0;
        const benchmarka0 = a0;
        const benchmarka3 = a3;

        // Iterate over each task in the supertask
        $('.taskInSuper').each(function (index) {
          // Extract keyspace size from the table cell
          const keyspace_size = $(this).find('td:nth-child(4)').text();
          let seconds = null;
          let runtime = null;

          // Set default options for the attack
          options = defaultOptions;
          options.ruleFiles = [];
          options.posArgs = [];
          options.unrecognizedFlag = [];

          // Check if keyspace size is available
          if (keyspace_size === null || !keyspace_size) {
            unknown_runtime_included = 1;
            runtime = 'Unknown';
          } else if (options.attackType === 3) {
            // Calculate seconds based on benchmarka3 for attackType 3
            seconds = Math.floor(Number(keyspace_size) / Number(benchmarka3));
          } else if (options.attackType === 0) {
            // Calculate seconds based on benchmarka0 for attackType 0
            seconds = Math.floor(Number(keyspace_size) / Number(benchmarka0));
          }

          // Convert seconds to human-readable runtime format
          if (Number.isInteger(seconds)) {
            totalSecondsSupertask += seconds;
            const days = Math.floor(seconds / (3600 * 24));
            seconds -= days * 3600 * 24;
            const hrs = Math.floor(seconds / 3600);
            seconds -= hrs * 3600;
            const mins = Math.floor(seconds / 60);
            seconds -= mins * 60;

            runtime = days + 'd, ' + hrs + 'h, ' + mins + 'm, ' + seconds + 's';
          } else {
            unknown_runtime_included = 1;
            runtime = 'Unknown';
          }

          // Update the HTML content with the calculated runtime
          $(this).find('td:nth-child(5)').html(runtime);
        });

        // Reduce total runtime to a human-readable format
        let seconds = totalSecondsSupertask;
        const days = Math.floor(seconds / (3600 * 24));
        seconds -= days * 3600 * 24;
        const hrs = Math.floor(seconds / 3600);
        seconds -= hrs * 3600;
        const mins = Math.floor(seconds / 60);
        seconds -= mins * 60;

        let totalRuntimeSupertask =
          days + 'd, ' + hrs + 'h, ' + mins + 'm, ' + seconds + 's';

        // Append additional information if unknown runtime is included
        if (unknown_runtime_included === 1) {
          totalRuntimeSupertask += ', plus additional unknown runtime';
        }

        // Update the HTML content with the total runtime of the supertask
        $('.runtimeOfSupertask').html(totalRuntimeSupertask);
      }
    }
  }
}
