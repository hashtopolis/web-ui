/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  HealthCheckAgentsTableCol,
  HealthCheckAgentsTableColColumnLabel
} from './health-check-agents-table.constants';
import { catchError, forkJoin } from 'rxjs';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { HTTableColumn } from '../ht-table/ht-table.models';
import {
  HealthCheck,
  HealthCheckAgent
} from 'src/app/core/_models/health-check.model';
import { HealthCheckAgentsDataSource } from 'src/app/core/_datasources/health-check-agents.datasource';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { formatUnixTimestamp } from 'src/app/shared/utils/datetime';
import { HealthChecksTableStatusLabel } from '../health-checks-table/health-checks-table.constants';

@Component({
  selector: 'health-check-agents-table',
  templateUrl: './health-check-agents-table.component.html'
})
export class HealthCheckAgentsTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  @Input() healthCheckId = 0;

  tableColumns: HTTableColumn[] = [];
  dataSource: HealthCheckAgentsDataSource;

  ngOnInit(): void {
    this.setColumnLabels(HealthCheckAgentsTableColColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new HealthCheckAgentsDataSource(
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

  filter(item: HealthCheckAgent, filterValue: string): boolean {
    if (
      item.agentName.toLowerCase().includes(filterValue) ||
      item.status.toString().includes(filterValue)
    ) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: HealthCheckAgentsTableCol.AGENT_ID,
        dataKey: 'healthCheckAgentId',
        isSortable: true,
        export: async (HealthCheckAgent: HealthCheckAgent) =>
          HealthCheckAgent.healthCheckAgentId + ''
      },
      {
        id: HealthCheckAgentsTableCol.AGENT_NAME,
        dataKey: 'agentName',
        routerLink: (HealthCheckAgent: HealthCheckAgent) =>
          this.renderAgentLink(HealthCheckAgent),
        isSortable: true,
        export: async (HealthCheckAgent: HealthCheckAgent) =>
          HealthCheckAgent.agentName + ''
      },
      {
        id: HealthCheckAgentsTableCol.STATUS,
        dataKey: 'status',
        render: (HealthCheckAgent: HealthCheckAgent) =>
          HealthChecksTableStatusLabel[HealthCheckAgent.status],
        isSortable: true,
        export: async (HealthCheckAgent: HealthCheckAgent) =>
          HealthChecksTableStatusLabel[HealthCheckAgent.status]
      },
      {
        id: HealthCheckAgentsTableCol.START,
        dataKey: 'start',
        isSortable: true,
        render: (HealthCheckAgent: HealthCheckAgent) =>
          formatUnixTimestamp(HealthCheckAgent.start, this.dateFormat),
        export: async (HealthCheckAgent: HealthCheckAgent) =>
          formatUnixTimestamp(HealthCheckAgent.start, this.dateFormat)
      },
      {
        id: HealthCheckAgentsTableCol.GPUS,
        dataKey: 'numGpus',
        isSortable: true,
        export: async (HealthCheckAgent: HealthCheckAgent) =>
          HealthCheckAgent.numGpus + ''
      },
      {
        id: HealthCheckAgentsTableCol.CRACKED,
        dataKey: 'cracked',
        isSortable: true,
        export: async (HealthCheckAgent: HealthCheckAgent) =>
          HealthCheckAgent.cracked + ''
      },
      {
        id: HealthCheckAgentsTableCol.ERRORS,
        dataKey: 'errors',
        isSortable: true,
        export: async (HealthCheckAgent: HealthCheckAgent) =>
          HealthCheckAgent.errors + ''
      }
    ];

    return tableColumns;
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<HealthCheckAgent[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<HealthCheckAgent>(
          'hashtopolis-health-checks-view',
          this.tableColumns,
          event.data,
          HealthCheckAgentsTableColColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<HealthCheckAgent>(
          'hashtopolis-health-checks-view',
          this.tableColumns,
          event.data,
          HealthCheckAgentsTableColColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<HealthCheckAgent>(
            this.tableColumns,
            event.data,
            HealthCheckAgentsTableColColumnLabel
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
