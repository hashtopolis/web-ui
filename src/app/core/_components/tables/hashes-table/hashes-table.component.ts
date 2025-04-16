/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { JHash } from '@models/hash.model';
import { JHashlist } from '@models/hashlist.model';

import { HashesTableCol, HashesTableColColumnLabel } from '@components/tables/hashes-table/hashes-table.constants';
import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { ExportMenuAction } from '@components/menus/export-menu/export-menu.constants';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';

import { HashesDataSource } from '@datasources/hashes.datasource';

import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';

@Component({
    selector: 'hashes-table',
    templateUrl: './hashes-table.component.html',
    standalone: false
})
export class HashesTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
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

  /**
   * Filter Hash
   * @param item
   * @param filterValue
   * @returns true:   Hash contains filterValue
   *          false:  else
   */
  filter(item: JHash, filterValue: string): boolean {
    return item.hash.toLowerCase().includes(filterValue) || item.isCracked.toString().includes(filterValue);
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: HashesTableCol.HASHES,
        dataKey: 'hash',
        isSortable: true,
        export: async (hash: JHash) => hash.hash + ''
      },
      {
        id: HashesTableCol.PLAINTEXT,
        dataKey: 'plaintext',
        isSortable: true,
        export: async (hash: JHash) => hash.plaintext + ''
      },
      {
        id: HashesTableCol.SALT,
        dataKey: 'salt',
        isSortable: true,
        export: async (hash: JHash) => hash.salt + ''
      },
      {
        id: HashesTableCol.CRACK_POSITION,
        dataKey: 'crackPos',
        isSortable: true,
        export: async (hash: JHash) => hash.crackPos + ''
      },
      {
        id: HashesTableCol.ISCRACKED,
        dataKey: 'isCracked',
        isSortable: true,
        export: async (hash: JHash) => hash.isCracked + ''
      },
      {
        id: HashesTableCol.TIMECRACKED,
        dataKey: 'timeCracked',
        isSortable: true,
        render: (hash: JHash) => formatUnixTimestamp(hash.timeCracked, this.dateFormat),
        export: async (hash: JHash) => formatUnixTimestamp(hash.timeCracked, this.dateFormat) + ''
      }
    ];
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<JHash[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<JHash>(
          'hashtopolis-hashlists',
          this.tableColumns,
          event.data,
          HashesTableColColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<JHash>(
          'hashtopolis-hashlists',
          this.tableColumns,
          event.data,
          HashesTableColColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService.toClipboard<JHash>(this.tableColumns, event.data, HashesTableColColumnLabel).then(() => {
          this.snackBar.open('The selected rows are copied to the clipboard', 'Close');
        });
        break;
    }
  }

  rowActionClicked(event: ActionMenuEvent<JHashlist>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.EDIT:
        // this.rowActionEdit(event.data);
        break;
    }
  }
}
