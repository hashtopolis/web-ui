/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { BaseModel } from '@models/base.model';
import { JHash } from '@models/hash.model';
import { JHashlist } from '@models/hashlist.model';
import { JVoucher } from '@models/voucher.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { HashesTableCol, HashesTableColColumnLabel } from '@components/tables/hashes-table/hashes-table.constants';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

import { HashesDataSource } from '@datasources/hashes.datasource';

import { ShowTruncatedDataDialogComponent } from '@src/app/shared/dialog/show-truncated-data.dialog/show-truncated-data.dialog.component';
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
  selectedFilterColumn: string = 'all';

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
    filterValue = filterValue.toLowerCase();
    const selectedColumn = this.selectedFilterColumn;
    // Filter based on selected column
    switch (selectedColumn) {
      case 'all': {
        // Search across multiple relevant fields
        return (
          item.hash.toLowerCase().includes(filterValue) ||
          item.plaintext?.toLowerCase().includes(filterValue) ||
          item.isCracked?.toString().includes(filterValue)
        );
      }
      case 'hash': {
        return item.hash.toString().includes(filterValue);
      }
      case 'plaintext': {
        return item.plaintext?.toLowerCase().includes(filterValue);
      }
      case 'isCracked': {
        return item.isCracked?.toString().includes(filterValue);
      }
      default:
        // Default fallback to hash
        return item.hash?.toLowerCase().includes(filterValue);
    }
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: HashesTableCol.HASHES,
        dataKey: 'hash',
        isSortable: true,
        isSearchable: true,
        isCopy: true,
        truncate: (hash: JHash) => hash.hash.length > 40,
        render: (hash: JHash) => hash.hash,
        export: async (hash: JHash) => hash.hash + ''
      },
      {
        id: HashesTableCol.PLAINTEXT,
        dataKey: 'plaintext',
        isSortable: true,
        isSearchable: true,
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
        isSearchable: true,
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
    this.exportService.handleExportAction<JHash>(
      event,
      this.tableColumns,
      HashesTableColColumnLabel,
      'hashtopolis-hashes'
    );
  }

  rowActionClicked(event: ActionMenuEvent<JHashlist>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.EDIT:
        // this.rowActionEdit(event.data);
        break;
    }
  }

  protected receiveCopyData(event: BaseModel) {
    if (this.clipboard.copy((event as JHash).hash)) {
      this.alertService.showSuccessMessage('Hash value successfully copied to clipboard.');
    } else {
      this.alertService.showErrorMessage('Could not copy hash value clipboard.');
    }
  }

  showTruncatedData(event: JHash) {
    const dialogRef = this.dialog.open(ShowTruncatedDataDialogComponent, {
      data: {
        hashlistName: event.hashlist?.name,
        unTruncatedText: event.hash
      }
    });
  }
}
