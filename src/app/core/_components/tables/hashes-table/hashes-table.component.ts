import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { BaseModel } from '@models/base.model';
import { JHash } from '@models/hash.model';
import { JHashlist } from '@models/hashlist.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { HashesTableCol, HashesTableColColumnLabel } from '@components/tables/hashes-table/hashes-table.constants';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

import { HashesDataSource } from '@datasources/hashes.datasource';

import { FilterType } from '@src/app/core/_models/request-params.model';
import { ShowTruncatedDataDialogComponent } from '@src/app/shared/dialog/show-truncated-data.dialog/show-truncated-data.dialog.component';
import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';

@Component({
  selector: 'hashes-table',
  templateUrl: './hashes-table.component.html',
  standalone: false
})
export class HashesTableComponent extends BaseTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() id: number;
  @Input() dataType: string;
  @Input() filterParam: string;

  tableColumns: HTTableColumn[] = [];
  dataSource: HashesDataSource;
  selectedFilterColumn: HTTableColumn;

  ngOnInit(): void {
    this.setColumnLabels(HashesTableColColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new HashesDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
    if (this.id) {
      this.dataSource.setId(this.id);
      this.dataSource.setDataType(this.dataType);

      if (this.filterParam) {
        this.dataSource.setFilterParam(this.filterParam);
      }
    }
  }

  ngAfterViewInit(): void {
    // Wait until paginator is defined
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
      this.dataSource.loadAll({ value: input, field: selectedColumn.dataKey, operator: FilterType.ICONTAINS, parent: selectedColumn.parent });
      return;
    } else {
      this.dataSource.loadAll(); // Reload all data if input is empty
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
    this.dialog.open(ShowTruncatedDataDialogComponent, {
      data: {
        hashlistName: event.hashlist?.name,
        unTruncatedText: event.hash
      }
    });
  }
}
