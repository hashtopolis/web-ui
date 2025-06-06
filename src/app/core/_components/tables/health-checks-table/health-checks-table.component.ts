/* eslint-disable @angular-eslint/component-selector */
import { Observable, catchError, of } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { JHealthCheck } from '@models/health-check.model';

import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import {
  HealthChecksTableCol,
  HealthChecksTableColumnLabel,
  HealthChecksTableStatusLabel
} from '@components/tables/health-checks-table/health-checks-table.constants';
import { HTTableColumn, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';

import { HealthChecksDataSource } from '@datasources/health-checks.datasource';

import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';

@Component({
  selector: 'health-checks-table',
  templateUrl: './health-checks-table.component.html',
  standalone: false
})
export class HealthChecksTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  tableColumns: HTTableColumn[] = [];
  dataSource: HealthChecksDataSource;
  selectedFilterColumn: string = 'all';

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
    filterValue = filterValue.toLowerCase();
    const selectedColumn = this.selectedFilterColumn;
    // Filter based on selected column
    switch (selectedColumn) {
      case 'all': {
        // Search across multiple relevant fields
        return (
          item.id.toString().includes(filterValue) || item.hashTypeDescription?.toLowerCase().includes(filterValue)
        );
      }
      case 'id': {
        return item.id.toString().includes(filterValue);
      }
      case 'hashtypeDescription': {
        return item.hashTypeDescription?.toLowerCase().includes(filterValue);
      }
      default:
        // Default fallback to task name
        return item.hashTypeDescription?.toLowerCase().includes(filterValue);
    }
  }
  getColumns(): HTTableColumn[] {
    return [
      {
        id: HealthChecksTableCol.ID,
        dataKey: 'id',
        routerLink: (healthCheck: JHealthCheck) => this.renderHealthCheckLink(healthCheck),
        isSortable: true,
        isSearchable: true,
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
        isSearchable: true,
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

  /**
   * Render healthcheck link
   * @param healthCheck - healthcheck object to render link for
   * @return observable object containing a router link array
   */
  private renderHealthCheckLink(healthCheck: JHealthCheck): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (healthCheck) {
      links.push({
        routerLink: ['/config/health-checks', healthCheck.id],
        label: healthCheck.id
      });
    }
    return of(links);
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<JHealthCheck[]>): void {
    this.exportService.handleExportAction<JHealthCheck>(
      event,
      this.tableColumns,
      HealthChecksTableColumnLabel,
      'hashtopolis-health-checks'
    );
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
    this.subscriptions.push(
      this.gs
        .bulkDelete(SERV.HEALTH_CHECKS, healthChecks)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion: ', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open(`Successfully deleted healthchecks!`, 'Close');
          this.dataSource.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(healthChecks: JHealthCheck[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.HEALTH_CHECKS, healthChecks[0].id)
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
