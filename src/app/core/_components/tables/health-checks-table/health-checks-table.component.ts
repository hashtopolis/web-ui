/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  HealthChecksTableCol,
  HealthChecksTableColumnLabel,
  HealthChecksTableStatusLabel
} from './health-checks-table.constants';
import { catchError, forkJoin } from 'rxjs';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { HTTableColumn } from '../ht-table/ht-table.models';
import { HealthCheck } from 'src/app/core/_models/health-check.model';
import { HealthChecksDataSource } from 'src/app/core/_datasources/health-checks.datasource';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { formatUnixTimestamp } from 'src/app/shared/utils/datetime';

@Component({
  selector: 'health-checks-table',
  templateUrl: './health-checks-table.component.html'
})
export class HealthChecksTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  tableColumns: HTTableColumn[] = [];
  dataSource: HealthChecksDataSource;

  ngOnInit(): void {
    this.setColumnLabels(HealthChecksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new HealthChecksDataSource(
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

  filter(item: HealthCheck, filterValue: string): boolean {
    if (item.attackCmd.toLowerCase().includes(filterValue)) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: HealthChecksTableCol.ID,
        dataKey: '_id',
        isSortable: true,
        export: async (healthCheck: HealthCheck) => healthCheck._id + ''
      },
      {
        id: HealthChecksTableCol.CREATED,
        dataKey: 'created',
        isSortable: true,
        render: (healthCheck: HealthCheck) =>
          formatUnixTimestamp(healthCheck.time, this.dateFormat),
        export: async (healthCheck: HealthCheck) =>
          formatUnixTimestamp(healthCheck.time, this.dateFormat)
      },
      {
        id: HealthChecksTableCol.TYPE,
        dataKey: 'hashtypeDescription',
        render: (healthCheck: HealthCheck) =>
          healthCheck.hashtype
            ? `Brute Force (${healthCheck.hashtypeDescription})`
            : '',
        isSortable: true,
        export: async (healthCheck: HealthCheck) =>
          healthCheck.hashtype
            ? `Brute Force (${healthCheck.hashtypeDescription})`
            : ''
      },
      {
        id: HealthChecksTableCol.STATUS,
        dataKey: 'status',
        render: (healthCheck: HealthCheck) =>
          HealthChecksTableStatusLabel[healthCheck.status],
        isSortable: true,
        export: async (healthCheck: HealthCheck) =>
          HealthChecksTableStatusLabel[healthCheck.status]
      }
    ];

    return tableColumns;
  }

  openDialog(data: DialogData<HealthCheck>) {
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

  exportActionClicked(event: ActionMenuEvent<HealthCheck[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<HealthCheck>(
          'hashtopolis-health-checks',
          this.tableColumns,
          event.data,
          HealthChecksTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<HealthCheck>(
          'hashtopolis-health-checks',
          this.tableColumns,
          event.data,
          HealthChecksTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<HealthCheck>(
            this.tableColumns,
            event.data,
            HealthChecksTableColumnLabel
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

  rowActionClicked(event: ActionMenuEvent<HealthCheck>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting health check Brute Force (${event.data.hashtype.description}) ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
      case RowActionMenuAction.EDIT:
        this.rowActionEdit(event.data);
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<HealthCheck[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} health checks ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above health checks? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'hashtypeDescription',
          action: event.menuItem.action
        });
        break;
    }
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(healthChecks: HealthCheck[]): void {
    const requests = healthChecks.map((healthCheck: HealthCheck) => {
      return this.gs.delete(SERV.CRACKERS_TYPES, healthCheck._id);
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
            `Successfully deleted ${results.length} healthChecks!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(healthChecks: HealthCheck[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.CRACKERS_TYPES, healthChecks[0]._id)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open('Successfully deleted health check!', 'Close');
          this.reload();
        })
    );
  }

  private rowActionEdit(healthCheck: HealthCheck): void {
    this.router.navigate(['/config/health-checks', healthCheck._id, 'edit']);
  }
}
