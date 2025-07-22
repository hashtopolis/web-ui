/* eslint-disable @angular-eslint/component-selector */
import { Observable, of } from 'rxjs';

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { SearchHashModel } from '@models/hash.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { HTTableColumn, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';
import {
  SearchHashTableCol,
  SearchHashTableColumnLabel
} from '@components/tables/search-hash-table/search-hash-table.constants';

import { SearchHashDataSource } from '@datasources/search-hash.datasource';

@Component({
  selector: 'search-hash-table',
  templateUrl: './search-hash-table.component.html',
  standalone: false
})
export class SearchHashTableComponent extends BaseTableComponent implements OnInit, OnDestroy, OnChanges {
  @Input() search: string[];
  tableColumns: HTTableColumn[] = [];
  dataSource: SearchHashDataSource;
  selectedFilterColumn: string = 'all';
  private initDone: boolean = false;
  ngOnInit(): void {
    this.setColumnLabels(SearchHashTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new SearchHashDataSource(this.injector);
    if (this.search) {
      this.dataSource.setSearch(this.search);
    }
    this.dataSource.setDateFormat(this.dateFormat);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.loadAll();
    this.initDone = true;
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: SearchHashModel, filterValue: string): boolean {
    filterValue = filterValue.toLowerCase();
    const selectedColumn = this.selectedFilterColumn;
    // Filter based on selected column
    switch (selectedColumn) {
      case 'all': {
        // Search across multiple relevant fields
        return (
          item.hash.toString().includes(filterValue) ||
          item.plaintext.toLowerCase().includes(filterValue) ||
          item.hashInfo.toLowerCase().includes(filterValue)
        );
      }
      case 'hash': {
        return item.hash?.toLowerCase().includes(filterValue);
      }
      case 'plaintext': {
        return item.plaintext?.toLowerCase().includes(filterValue);
      }
      case 'hashinfo': {
        return item.hashInfo.toLowerCase().includes(filterValue);
      }
      default:
        // Default fallback to task name
        return item.hash?.toLowerCase().includes(filterValue);
    }
  }
  getColumns(): HTTableColumn[] {
    return [
      {
        id: SearchHashTableCol.HASH,
        dataKey: 'hash',
        isSortable: true,
        isSearchable: true,
        render: (hash: SearchHashModel) => hash.hash,
        export: async (hash: SearchHashModel) => hash.hash + ''
      },
      {
        id: SearchHashTableCol.PLAINTEXT,
        dataKey: 'plaintext',
        isSortable: true,
        isSearchable: true,
        render: (hash: SearchHashModel) => hash.plaintext,
        export: async (hash: SearchHashModel) => hash.plaintext + ''
      },
      {
        id: SearchHashTableCol.HASHLIST,
        dataKey: 'hashlists',
        routerLink: (hash: SearchHashModel) => this.renderHashlistLinks(hash),
        export: async (hash: SearchHashModel) => this.exportHashLists(hash)
      },
      {
        id: SearchHashTableCol.INFO,
        dataKey: 'hashinfo',
        isSortable: true,
        isSearchable: true,
        render: (hash: SearchHashModel) => hash.hashInfo,
        export: async (hash: SearchHashModel) => hash.hashInfo
      }
    ];
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<SearchHashModel[]>): void {
    this.exportService.handleExportAction<SearchHashModel>(
      event,
      this.tableColumns,
      SearchHashTableColumnLabel,
      'hashtopolis-search-hash'
    );
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

  /**
   * Render links to all hashlists the hash belongs to
   * @param hash - hash model to render edit links for all hashlists
   * @return observable containing all hashlist links as array
   * @private
   */
  private renderHashlistLinks(hash: SearchHashModel): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (hash.hashlists && hash.hashlists.length > 0) {
      hash.hashlists.forEach((element) => {
        links.push({
          routerLink: ['/hashlists', 'hashlist', element.id, 'edit'],
          label: element.name
        });
      });
    }
    return of(links);
  }

  /**
   * Convert hashlist names to a string for export
   * @param hash - hash to get hashlists for
   * @return string containing names of all hashlists
   * @private
   */
  private exportHashLists(hash: SearchHashModel) {
    let retValue: string = '';
    if (hash.hashlists && hash.hashlists.length > 0) {
      retValue = hash.hashlists.map((element) => element.name).join('|');
    }

    return Promise.resolve(retValue);
  }
}
