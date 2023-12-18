/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  HealthChecksViewTableCol,
  HealthChecksViewTableColumnLabel
} from './health-checks-view-table.constants';
import { catchError, forkJoin } from 'rxjs';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { HTTableColumn } from '../ht-table/ht-table.models';
import {
  HealthCheck,
  HealthCheckView
} from 'src/app/core/_models/health-check.model';
import { HealthChecksViewDataSource } from 'src/app/core/_datasources/health-checks-view.datasource';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { formatUnixTimestamp } from 'src/app/shared/utils/datetime';
import { HealthChecksTableStatusLabel } from '../health-checks-table/health-checks-table.constants';

@Component({
  selector: 'health-checks-view-table',
  templateUrl: './health-checks-view-table.component.html'
})
export class HealthChecksViewTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  @Input() healthCheckId = 0;

  tableColumns: HTTableColumn[] = [];
  dataSource: HealthChecksViewDataSource;

  ngOnInit(): void {
    this.setColumnLabels(HealthChecksViewTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new HealthChecksViewDataSource(
      this.cdr,
      this.gs,
      this.uiService
    );
    if (this.healthCheckId) {
      this.dataSource.setHealthCheckId(this.healthCheckId);
    }
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: HealthCheckView, filterValue: string): boolean {
    if (item.agentName.toLowerCase().includes(filterValue)) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: HealthChecksViewTableCol.AGENT_ID,
        dataKey: 'healthCheckAgentId',
        isSortable: true,
        export: async (healthCheckView: HealthCheckView) =>
          healthCheckView.healthCheckAgentId + ''
      },
      {
        id: HealthChecksViewTableCol.AGENT_NAME,
        dataKey: 'agentName',
        isSortable: true,
        export: async (healthCheckView: HealthCheckView) =>
          healthCheckView.agentName + ''
      },
      {
        id: HealthChecksViewTableCol.STATUS,
        dataKey: 'status',
        render: (healthCheckView: HealthCheckView) =>
          HealthChecksTableStatusLabel[healthCheckView.status],
        isSortable: true,
        export: async (healthCheckView: HealthCheckView) =>
          HealthChecksTableStatusLabel[healthCheckView.status]
      },
      {
        id: HealthChecksViewTableCol.START,
        dataKey: 'start',
        isSortable: true,
        render: (healthCheckView: HealthCheckView) =>
          formatUnixTimestamp(healthCheckView.start, this.dateFormat),
        export: async (healthCheckView: HealthCheckView) =>
          formatUnixTimestamp(healthCheckView.start, this.dateFormat)
      },
      {
        id: HealthChecksViewTableCol.GPUS,
        dataKey: 'numGpus',
        isSortable: true,
        export: async (healthCheckView: HealthCheckView) =>
          healthCheckView.numGpus + ''
      },
      {
        id: HealthChecksViewTableCol.CRACKED,
        dataKey: 'numGpus',
        isSortable: true,
        export: async (healthCheckView: HealthCheckView) =>
          healthCheckView.cracked + ''
      },
      {
        id: HealthChecksViewTableCol.ERRORS,
        dataKey: 'numGpus',
        isSortable: true,
        export: async (healthCheckView: HealthCheckView) =>
          healthCheckView.errors + ''
      }
    ];

    return tableColumns;
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<HealthCheckView[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<HealthCheckView>(
          'hashtopolis-health-checks-view',
          this.tableColumns,
          event.data,
          HealthChecksViewTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<HealthCheckView>(
          'hashtopolis-health-checks-view',
          this.tableColumns,
          event.data,
          HealthChecksViewTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<HealthCheckView>(
            this.tableColumns,
            event.data,
            HealthChecksViewTableColumnLabel
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
}
