/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  HTTableColumn,
  HTTableIcon,
  HTTableRouterLink
} from '../ht-table/ht-table.models';
import {
  HashesTableCol,
  HashesTableColColumnLabel
} from './hashes-table.constants';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { Hashlist } from 'src/app/core/_models/hashlist.model';
import { HashesDataSource } from 'src/app/core/_datasources/hashes.datasource';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { Hash } from 'src/app/core/_models/hash.model';
import { formatUnixTimestamp } from 'src/app/shared/utils/datetime';

@Component({
  selector: 'hashes-table',
  templateUrl: './hashes-table.component.html'
})
export class HashesTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  @Input() id: number;
  @Input() dataType: string;

  tableColumns: HTTableColumn[] = [];
  dataSource: HashesDataSource;

  ngOnInit(): void {
    this.setColumnLabels(HashesTableColColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new HashesDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    if (this.id) {
      this.dataSource.setId(this.id);
      this.dataSource.setDataType(this.dataType);
    }
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: Hash, filterValue: string): boolean {
    if (
      item.hash.toLowerCase().includes(filterValue) ||
      item.isCracked.toString().includes(filterValue)
    ) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: HashesTableCol.HASHES,
        dataKey: 'hash',
        isSortable: true,
        export: async (hash: Hash) => hash.hash + ''
      },
      {
        id: HashesTableCol.PLAINTEXT,
        dataKey: 'plaintext',
        isSortable: true,
        export: async (hash: Hash) => hash.plaintext + ''
      },
      {
        id: HashesTableCol.SALT,
        dataKey: 'salt',
        isSortable: true,
        export: async (hash: Hash) => hash.salt + ''
      },
      {
        id: HashesTableCol.CRACK_POSITION,
        dataKey: 'crackPos',
        isSortable: true,
        export: async (hash: Hash) => hash.crackPos + ''
      },
      {
        id: HashesTableCol.ISCRACKED,
        dataKey: 'isCracked',
        isSortable: true,
        export: async (hash: Hash) => hash.isCracked + ''
      },
      {
        id: HashesTableCol.TIMECRACKED,
        dataKey: 'timeCracked',
        isSortable: true,
        render: (hash: Hash) =>
          formatUnixTimestamp(hash.timeCracked, this.dateFormat),
        export: async (hash: Hash) =>
          formatUnixTimestamp(hash.timeCracked, this.dateFormat) + ''
      }
    ];

    return tableColumns;
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<Hash[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<Hash>(
          'hashtopolis-hashlists',
          this.tableColumns,
          event.data,
          HashesTableColColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<Hash>(
          'hashtopolis-hashlists',
          this.tableColumns,
          event.data,
          HashesTableColColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<Hash>(
            this.tableColumns,
            event.data,
            HashesTableColColumnLabel
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

  rowActionClicked(event: ActionMenuEvent<Hashlist>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.EDIT:
        // this.rowActionEdit(event.data);
        break;
    }
  }
}
