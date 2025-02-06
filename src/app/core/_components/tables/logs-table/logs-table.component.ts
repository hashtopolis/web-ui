/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LogsTableCol, LogsTableColumnLabel } from './logs-table.constants';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { HTTableColumn } from '../ht-table/ht-table.models';
import { LogData } from 'src/app/core/_models/log.model';
import { LogsDataSource } from 'src/app/core/_datasources/logs.datasource';
import { formatUnixTimestamp } from 'src/app/shared/utils/datetime';

@Component({
  selector: 'logs-table',
  templateUrl: './logs-table.component.html'
})
export class LogsTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  tableColumns: HTTableColumn[] = [];
  dataSource: LogsDataSource;

  ngOnInit(): void {
    this.setColumnLabels(LogsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new LogsDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: LogData, filterValue: string): boolean {
    if (
      item.attributes.message.toLowerCase().includes(filterValue) ||
      item.attributes.level.toLowerCase().includes(filterValue) ||
      item.attributes.issuer.toLowerCase().includes(filterValue)
    ) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: LogsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        export: async (log: LogData) => log.id + ''
      },
      {
        id: LogsTableCol.TIME,
        dataKey: 'time',
        isSortable: true,
        render: (log: LogData) => formatUnixTimestamp(log.attributes.time, this.dateFormat),
        export: async (log: LogData) =>
          formatUnixTimestamp(log.attributes.time, this.dateFormat)
      },
      {
        id: LogsTableCol.LEVEL,
        dataKey: 'level',
        isSortable: true,
        render: (log: LogData) =>
          log.attributes.level.charAt(0).toUpperCase() + log.attributes.level.slice(1).toLowerCase(),
        export: async (log: LogData) =>
          log.attributes.level.charAt(0).toUpperCase() + log.attributes.level.slice(1).toLowerCase()
      },
      {
        id: LogsTableCol.ISSUER,
        dataKey: 'issuer',
        isSortable: true,
        render: (log: LogData) => `${log.attributes.issuer}-ID-${log.attributes.issuerId}`,
        export: async (log: LogData) => `${log.attributes.issuer}-ID-${log.attributes.issuerId}`
      },
      {
        id: LogsTableCol.MESSAGE,
        dataKey: 'message',
        isSortable: true,
        render: (log: LogData) => log.attributes.message,
        export: async (log: LogData) => log.attributes.message
      }
    ];

    return tableColumns;
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<LogData[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<LogData>(
          'hashtopolis-logs',
          this.tableColumns,
          event.data,
          LogsTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<LogData>(
          'hashtopolis-logs',
          this.tableColumns,
          event.data,
          LogsTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<LogData>(this.tableColumns, event.data, LogsTableColumnLabel)
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
