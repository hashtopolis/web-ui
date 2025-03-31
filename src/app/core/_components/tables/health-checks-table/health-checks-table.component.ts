import { catchError, forkJoin } from 'rxjs';
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, OnInit } from '@angular/core';

import { JHealthCheck } from '@models/health-check.model';

import {
  HealthChecksTableCol,
  HealthChecksTableColumnLabel,
  HealthChecksTableStatusLabel
} from '@components/tables/health-checks-table/health-checks-table.constants';
import { HTTableColumn, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { Cacheable } from '@src/app/core/_decorators/cacheable';
import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { ExportMenuAction } from '@components/menus/export-menu/export-menu.constants';

import { HealthChecksDataSource } from '@datasources/health-checks.datasource';

import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';


import { SERV } from '@services/main.config';

@Component({
  selector: 'health-checks-table',
  templateUrl: './health-checks-table.component.html'
})
export class HealthChecksTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  tableColumns: HTTableColumn[] = [];
  dataSource: HealthChecksDataSource;

  ngOnInit(): void {
    this.setColumnLabels(HealthChecksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new HealthChecksDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: JHealthCheck, filterValue: string): boolean {
    if (item.attackCmd.toLowerCase().includes(filterValue)) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: HealthChecksTableCol.ID,
        dataKey: 'id',
        routerLink: (healthCheck: JHealthCheck) => this.renderHealthCheckLink(healthCheck),
        isSortable: true,
        export: async (healthCheck: JHealthCheck) => healthCheck.id + ''
      },
      {
        id: HealthChecksTableCol.CREATED,
        dataKey: 'created',
        isSortable: true,
        render: (healthCheck: JHealthCheck) => formatUnixTimestamp(healthCheck.time, this.dateFormat),
        export: async (healthCheck: JHealthCheck) => formatUnixTimestamp(healthCheck.time, this.dateFormat)
      },
      {
        id: HealthChecksTableCol.TYPE,
        dataKey: 'hashtypeDescription',
        render: (healthCheck: JHealthCheck) =>
          healthCheck.hashType ? `Brute Force (${healthCheck.hashType.description})` : '',
        isSortable: true,
        export: async (healthCheck: JHealthCheck) =>
          healthCheck.hashType ? `Brute Force (${healthCheck.hashType.description})` : ''
      },
      {
        id: HealthChecksTableCol.STATUS,
        dataKey: 'status',
        render: (healthCheck: JHealthCheck) => HealthChecksTableStatusLabel[healthCheck.status],
        isSortable: true,
        export: async (healthCheck: JHealthCheck) => HealthChecksTableStatusLabel[healthCheck.status]
      }
    ];

    return tableColumns;
  }

  openDialog(data: DialogData<JHealthCheck>) {
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

  @Cacheable(['id'])
  async renderHealthCheckLink(hc: JHealthCheck): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink: ['/config/health-checks', hc.id],
        label: hc.id
      }
    ];
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<JHealthCheck[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<JHealthCheck>(
          'hashtopolis-health-checks',
          this.tableColumns,
          event.data,
          HealthChecksTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<JHealthCheck>(
          'hashtopolis-health-checks',
          this.tableColumns,
          event.data,
          HealthChecksTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<JHealthCheck>(this.tableColumns, event.data, HealthChecksTableColumnLabel)
          .then(() => {
            this.snackBar.open('The selected rows are copied to the clipboard', 'Close');
          });
        break;
    }
  }

  rowActionClicked(event: ActionMenuEvent<JHealthCheck>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting health check Brute Force (${event.data.hashType.description}) ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
      case RowActionMenuAction.VIEW:
        this.rowActionView(event.data);
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<JHealthCheck[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} health checks ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above health checks? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'hashTypeDescription',
          action: event.menuItem.action
        });
        break;
    }
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(healthChecks: JHealthCheck[]): void {
    const requests = healthChecks.map((healthCheck: JHealthCheck) => {
      return this.gs.delete(SERV.HEALTH_CHECKS.URL, healthCheck.id);
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
          this.snackBar.open(`Successfully deleted ${results.length} healthChecks!`, 'Close');
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(healthChecks: JHealthCheck[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.HEALTH_CHECKS.URL, healthChecks[0].id)
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

  private rowActionView(healthCheck: JHealthCheck): void {
    this.router.navigate(['/config/health-checks', healthCheck.id]);
  }
}
