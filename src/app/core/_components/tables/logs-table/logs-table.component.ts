import { Component, OnDestroy, OnInit } from '@angular/core';
import { LogsTableCol, LogsTableColumnLabel } from '@components/tables/logs-table/logs-table.constants';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { FilterType } from '@src/app/core/_models/request-params.model';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { JLog } from 'src/app/core/_models/log.model';
/* eslint-disable @angular-eslint/component-selector */
import { LogsDataSource } from 'src/app/core/_datasources/logs.datasource';
import { formatUnixTimestamp } from 'src/app/shared/utils/datetime';

@Component({
  selector: 'logs-table',
  templateUrl: './logs-table.component.html',
  standalone: false
})
export class LogsTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  tableColumns: HTTableColumn[] = [];
  dataSource: LogsDataSource;
  selectedFilterColumn: string = 'all';

  ngOnInit(): void {
    this.setColumnLabels(LogsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new LogsDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
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
        id: LogsTableCol.ID,
        dataKey: '_id',
        isSortable: true,
        isSearchable: true,
        render: (log: JLog) => log.id,
        export: async (log: JLog) => log.id + ''
      },
      {
        id: LogsTableCol.TIME,
        dataKey: 'time',
        isSortable: true,
        render: (log: JLog) => formatUnixTimestamp(log.time, this.dateFormat),
        export: async (log: JLog) => formatUnixTimestamp(log.time, this.dateFormat)
      },
      {
        id: LogsTableCol.LEVEL,
        dataKey: 'level',
        isSortable: true,
        isSearchable: true,
        render: (log: JLog) => log.level.charAt(0).toUpperCase() + log.level.slice(1).toLowerCase(),
        export: async (log: JLog) => log.level.charAt(0).toUpperCase() + log.level.slice(1).toLowerCase()
      },
      {
        id: LogsTableCol.ISSUER,
        dataKey: 'issuerId',
        isSortable: true,
        isSearchable: true,
        render: (log: JLog) => `${log.issuer}-ID-${log.issuerId}`,
        export: async (log: JLog) => `${log.issuer}-ID-${log.issuerId}`
      },
      {
        id: LogsTableCol.MESSAGE,
        dataKey: 'message',
        isSortable: true,
        isSearchable: true,
        render: (log: JLog) => log.message,
        export: async (log: JLog) => log.message
      }
    ];
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<JLog[]>): void {
    this.exportService.handleExportAction<JLog>(event, this.tableColumns, LogsTableColumnLabel, 'hashtopolis-logs');
  }
}
