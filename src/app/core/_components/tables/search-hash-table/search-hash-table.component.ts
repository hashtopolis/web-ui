/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {
  SearchHashTableCol,
  SearchHashTableColumnLabel
} from '@components/tables/search-hash-table/search-hash-table.constants';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { ExportMenuAction } from '@components/menus/export-menu/export-menu.constants';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { JHash } from '@models/hash.model';
import { SafeHtml } from '@angular/platform-browser';
import { SearchHashDataSource } from '@datasources/search-hash.datasource';
import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';

@Component({
    selector: 'search-hash-table',
    templateUrl: './search-hash-table.component.html',
    standalone: false
})
export class SearchHashTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() search: any[];
  tableColumns: HTTableColumn[] = [];
  dataSource: SearchHashDataSource;
  private initDone: boolean = false;
  ngOnInit(): void {
    this.setColumnLabels(SearchHashTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new SearchHashDataSource(
      this.cdr,
      this.gs,
      this.uiService
    );
    if (this.search) {
      this.dataSource.setSearch(this.search);
    }
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.loadAll();
    this.initDone = true;
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: JHash, filterValue: string): boolean {
    return item.hash.toLowerCase().includes(filterValue);
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: SearchHashTableCol.HASH,
        dataKey: 'hash',
        isSortable: true,
        isSearchable: true,
        render: (hash: JHash) => hash.hash,
        export: async (hash: JHash) => hash.hash + ''
      },
      {
        id: SearchHashTableCol.PLAINTEXT,
        dataKey: 'plaintext',
        isSortable: true,
        isSearchable: true,
        render: (hash: JHash) => hash.plaintext,
        export: async (hash: JHash) => hash.plaintext + ''
      },
      {
        id: SearchHashTableCol.INFO,
        dataKey: 'isCracked',
        isSortable: true,
        render: (hash: JHash) => this.renderHashInfo(hash),
        export: async (hash: JHash) => this.renderHashInfo(hash) + ''
      }
    ];
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<JHash[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<JHash>(
          'hashtopolis-search-hash',
          this.tableColumns,
          event.data,
          SearchHashTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<JHash>(
          'hashtopolis-search-hash',
          this.tableColumns,
          event.data,
          SearchHashTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<JHash>(
            this.tableColumns,
            event.data,
            SearchHashTableColumnLabel
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['search']) {
      this.search = changes['search'].currentValue;
      if (this.initDone) {
        this.dataSource.setSearch(this.search);
        this.dataSource.setColumns(this.tableColumns);
        this.dataSource.loadAll();
      }
    }
  }

  renderHashInfo(hash: JHash): SafeHtml {
    let htmlContent: string;
    if (hash.id !== undefined) {
      htmlContent = `
          ${hash.isCracked ? 'Cracked' : 'Uncracked'} on ${formatUnixTimestamp(
            hash.timeCracked,
            this.dateFormat
          )}
          <br>
          Hashlist:
          <a
            href="#/hashlists/hashlist/${
              hash.hashlistId
            }/edit"
          >${hash.hashlist.name}</a>
        `;
    } else {
      htmlContent = 'Not Found';
    }
    return this.sanitizer.bypassSecurityTrustHtml(htmlContent);
  }
}
