/* eslint-disable @angular-eslint/component-selector */
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {
  SearchHashTableCol,
  SearchHashTableColumnLabel
} from './search-hash-table.constants';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { HTTableColumn } from '../ht-table/ht-table.models';
import { SearchHashDataSource } from 'src/app/core/_datasources/search-hash.datasource';
import { formatUnixTimestamp } from 'src/app/shared/utils/datetime';
import { SafeHtml } from '@angular/platform-browser';
import { JHash } from '../../../_models/hash.model';

@Component({
  selector: 'search-hash-table',
  templateUrl: './search-hash-table.component.html'
})
export class SearchHashTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() search: any[];
  tableColumns: HTTableColumn[] = [];
  dataSource: SearchHashDataSource;

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
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: JHash, filterValue: string): boolean {
    if (item.hash.toLowerCase().includes(filterValue)) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: SearchHashTableCol.HASH,
        dataKey: 'hash',
        isSortable: true,
        render: (hash: JHash) => hash.hash,
        export: async (hash: JHash) => hash.hash + ''
      },
      {
        id: SearchHashTableCol.INFO,
        dataKey: 'isCracked',
        isSortable: true,
        render: (hash: JHash) => this.renderHashInfo(hash),
        export: async (hash: JHash) => this.renderHashInfo(hash) + ''
      }
    ];

    return tableColumns;
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
      this.dataSource.setSearch(changes['search'].currentValue);
      this.dataSource.setColumns(this.tableColumns);
      this.dataSource.loadAll();
    }
  }

  renderHashInfo(hash: JHash): SafeHtml {
    let htmlContent = '';
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
