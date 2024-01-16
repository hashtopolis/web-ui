/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  HTTableColumn,
  HTTableIcon,
  HTTableRouterLink
} from '../ht-table/ht-table.models';
import {
  HashlistsTableCol,
  HashlistsTableColumnLabel
} from './hashlists-table.constants';
import { catchError, forkJoin } from 'rxjs';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { Cacheable } from 'src/app/core/_decorators/cacheable';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { HashListFormatLabel } from 'src/app/core/_constants/hashlist.config';
import { Hashlist } from 'src/app/core/_models/hashlist.model';
import { HashlistsDataSource } from 'src/app/core/_datasources/hashlists.datasource';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { formatPercentage } from 'src/app/shared/utils/util';
import { Hashtype } from 'src/app/core/_models/hashtype.model';

@Component({
  selector: 'hashlists-table',
  templateUrl: './hashlists-table.component.html'
})
export class HashlistsTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  tableColumns: HTTableColumn[] = [];
  dataSource: HashlistsDataSource;
  isArchived = false;

  ngOnInit(): void {
    this.setColumnLabels(HashlistsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new HashlistsDataSource(
      this.cdr,
      this.gs,
      this.uiService
    );
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.setIsArchived(this.isArchived);
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: Hashlist, filterValue: string): boolean {
    if (
      item.name.toLowerCase().includes(filterValue) ||
      item.hashTypeDescription.toLowerCase().includes(filterValue)
    ) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: HashlistsTableCol.ID,
        dataKey: '_id',
        isSortable: true,
        export: async (hashlist: Hashlist) => hashlist._id + ''
      },
      {
        id: HashlistsTableCol.NAME,
        dataKey: 'name',
        icons: (hashlist: Hashlist) => this.renderSecretIcon(hashlist),
        routerLink: (hashlist: Hashlist) => this.renderHashlistLink(hashlist),
        isSortable: true,
        export: async (hashlist: Hashlist) => hashlist.name
      },
      {
        id: HashlistsTableCol.HASH_COUNT,
        dataKey: 'hashCount',
        isSortable: true,
        routerLink: (hashlist: Hashlist) => this.renderHashCountLink(hashlist),
        export: async (hashlist: Hashlist) => hashlist.hashCount + ''
      },
      {
        id: HashlistsTableCol.CRACKED,
        dataKey: 'cracked',
        icons: (hashlist: Hashlist) => this.renderCrackedStatusIcon(hashlist),
        render: (hashlist: Hashlist) =>
          formatPercentage(hashlist.cracked, hashlist.hashCount),
        isSortable: true,
        export: async (hashlist: Hashlist) =>
          formatPercentage(hashlist.cracked, hashlist.hashCount)
      },
      {
        id: HashlistsTableCol.HASHTYPE,
        dataKey: 'hashTypeDescription',
        isSortable: true,
        render: (hashlist: Hashlist) =>
          hashlist.hashTypeId + ' - ' + hashlist.hashTypeDescription,
        export: async (hashlist: Hashlist) => hashlist.hashTypeDescription
      },
      {
        id: HashlistsTableCol.FORMAT,
        dataKey: 'format',
        isSortable: true,
        render: (hashlist: Hashlist) =>
          this.sanitize(HashListFormatLabel[hashlist.format]),
        export: async (hashlist: Hashlist) =>
          HashListFormatLabel[hashlist.format]
      }
    ];

    return tableColumns;
  }

  openDialog(data: DialogData<Hashlist>) {
    const dialogRef = this.dialog.open(TableDialogComponent, {
      data: data,
      width: '450px'
    });

    this.subscriptions.push(
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.action) {
          switch (result.action) {
            case RowActionMenuAction.DELETE:
              this.rowActionDelete(result.data);
              break;
            case BulkActionMenuAction.ARCHIVE:
              this.bulkActionArchive(result.data, true);
              break;
            case BulkActionMenuAction.DELETE:
              this.bulkActionDelete(result.data);
              break;
          }
        }
      })
    );
  }

  // --- Render functions ---

  @Cacheable(['_id', 'isSecret'])
  async renderSecretIcon(hashlist: Hashlist): Promise<HTTableIcon[]> {
    const icons: HTTableIcon[] = [];
    if (hashlist.isSecret) {
      icons.push({
        name: 'lock',
        tooltip: 'Secret'
      });
    }

    return icons;
  }

  @Cacheable(['_id', 'hashCount', 'cracked'])
  async renderCrackedStatusIcon(hashlist: Hashlist): Promise<HTTableIcon[]> {
    const icons: HTTableIcon[] = [];
    if (hashlist.hashCount === hashlist.cracked) {
      icons.push({
        name: 'check_circle',
        tooltip: 'Cracked',
        cls: 'text-ok'
      });
    }

    return icons;
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<Hashlist[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<Hashlist>(
          'hashtopolis-hashlists',
          this.tableColumns,
          event.data,
          HashlistsTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<Hashlist>(
          'hashtopolis-hashlists',
          this.tableColumns,
          event.data,
          HashlistsTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<Hashlist>(
            this.tableColumns,
            event.data,
            HashlistsTableColumnLabel
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
        this.rowActionEdit(event.data);
        break;
      case RowActionMenuAction.EXPORT:
        this.rowActionExport(event.data);
        break;
      case RowActionMenuAction.IMPORT:
        this.rowActionImport(event.data);
        break;
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting hashlist with id ${event.data._id} (${event.data.hashTypeDescription}) ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<Hashlist[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.ARCHIVE:
        this.openDialog({
          rows: event.data,
          title: `Archiving ${event.data.length} hashlists ...`,
          icon: 'info',
          listAttribute: 'name',
          action: event.menuItem.action
        });
        break;
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} hashlists ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above hashlists? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'name',
          action: event.menuItem.action
        });
        break;
    }
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionArchive(hashlists: Hashlist[], isArchived: boolean): void {
    const requests = hashlists.map((hashlist: Hashlist) => {
      return this.gs.update(SERV.HASHLISTS, hashlist._id, {
        isArchived: isArchived
      });
    });

    const action = isArchived ? 'archived' : 'unarchived';

    this.subscriptions.push(
      forkJoin(requests)
        .pipe(
          catchError((error) => {
            console.error('Error during archiving:', error);
            return [];
          })
        )
        .subscribe((results) => {
          this.snackBar.open(
            `Successfully ${action} ${results.length} hashlists!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(hashlists: Hashlist[]): void {
    const requests = hashlists.map((hashlist: Hashlist) => {
      return this.gs.delete(SERV.HASHLISTS, hashlist._id);
    });

    this.subscriptions.push(
      forkJoin(requests)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe((results) => {
          this.snackBar.open(
            `Successfully deleted ${results.length} hashlists!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(hashlists: Hashlist[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.HASHLISTS, hashlists[0]._id)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open('Successfully deleted hashlist!', 'Close');
          this.reload();
        })
    );
  }

  private rowActionEdit(hashlist: Hashlist): void {
    this.renderHashlistLink(hashlist).then((links: HTTableRouterLink[]) => {
      this.router.navigate(links[0].routerLink);
    });
  }

  /**
   * @todo Implement export action.
   */
  private rowActionExport(hashlist: Hashlist): void {
    this.router.navigate(['/hashlists', hashlist._id, 'copy']);
  }

  /**
   * @todo Implement import action.
   */
  private rowActionImport(hashlist: Hashlist): void {
    this.router.navigate(['/hashlists', hashlist._id, 'copy']);
  }

  setIsArchived(isArchived: boolean): void {
    this.isArchived = isArchived;
    this.dataSource.setIsArchived(isArchived);
  }
}
