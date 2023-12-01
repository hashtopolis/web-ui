/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HTTableColumn, HTTableIcon } from '../ht-table/ht-table.models';
import {
  SuperHashlistsTableCol,
  SuperHashlistsTableColumnLabel
} from './super-hashlists-table.constants';
import { catchError, forkJoin } from 'rxjs';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { Cacheable } from 'src/app/core/_decorators/cacheable';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { Hashlist } from 'src/app/core/_models/hashlist.model';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { SuperHashlistsDataSource } from 'src/app/core/_datasources/super-hashlists.datasource';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { formatPercentage } from 'src/app/shared/utils/util';

@Component({
  selector: 'super-hashlists-table',
  templateUrl: './super-hashlists-table.component.html'
})
export class SuperHashlistsTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  tableColumns: HTTableColumn[] = [];
  dataSource: SuperHashlistsDataSource;
  isArchived = false;

  ngOnInit(): void {
    this.setColumnLabels(SuperHashlistsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new SuperHashlistsDataSource(
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
        id: SuperHashlistsTableCol.ID,
        dataKey: '_id',
        isSortable: true,
        export: async (superHashlist: Hashlist) => superHashlist._id + ''
      },
      {
        id: SuperHashlistsTableCol.NAME,
        dataKey: 'name',
        icons: (superHashlist: Hashlist) =>
          this.renderSecretIcon(superHashlist),
        routerLink: (superHashlist: Hashlist) =>
          this.renderHashlistLink(superHashlist),
        isSortable: true,
        export: async (superHashlist: Hashlist) => superHashlist.name
      },
      {
        id: SuperHashlistsTableCol.CRACKED,
        dataKey: 'cracked',
        icons: (superHashlist: Hashlist) =>
          this.renderCrackedStatusIcon(superHashlist),
        render: (superHashlist: Hashlist) =>
          formatPercentage(superHashlist.cracked, superHashlist.hashCount),
        isSortable: true,
        export: async (superHashlist: Hashlist) =>
          formatPercentage(superHashlist.cracked, superHashlist.hashCount)
      },
      {
        id: SuperHashlistsTableCol.HASHTYPE,
        dataKey: 'hashTypeDescription',
        isSortable: true,
        export: async (superHashlist: Hashlist) =>
          superHashlist.hashTypeDescription
      },
      {
        id: SuperHashlistsTableCol.HASHLISTS,
        dataKey: 'hashlists',
        routerLink: (superHashlist: Hashlist) =>
          this.renderHashlistLinks(superHashlist),
        isSortable: false,
        export: async (superHashlist: Hashlist) =>
          superHashlist.hashTypeDescription
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
  async renderSecretIcon(superHashlist: Hashlist): Promise<HTTableIcon[]> {
    const icons: HTTableIcon[] = [];
    if (superHashlist.isSecret) {
      icons.push({
        name: 'lock',
        tooltip: 'Secret'
      });
    }

    return icons;
  }

  @Cacheable(['_id', 'hashCount', 'cracked'])
  async renderCrackedStatusIcon(
    superHashlist: Hashlist
  ): Promise<HTTableIcon[]> {
    const icons: HTTableIcon[] = [];
    if (superHashlist.hashCount === superHashlist.cracked) {
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
          'hashtopolis-super-hashlists',
          this.tableColumns,
          event.data,
          SuperHashlistsTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<Hashlist>(
          'hashtopolis-super-hashlists',
          this.tableColumns,
          event.data,
          SuperHashlistsTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<Hashlist>(
            this.tableColumns,
            event.data,
            SuperHashlistsTableColumnLabel
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
          title: `Deleting super hashlist with id ${event.data._id} (${event.data.hashTypeDescription}) ...`,
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
          title: `Archiving ${event.data.length} super hashlists ...`,
          icon: 'info',
          listAttribute: 'name',
          action: event.menuItem.action
        });
        break;
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} super hashlists ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above super hashlists? Note that this action cannot be undone.`,
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
  private bulkActionArchive(
    superHashlists: Hashlist[],
    isArchived: boolean
  ): void {
    const requests = superHashlists.map((superHashlist: Hashlist) => {
      return this.gs.update(SERV.HASHLISTS, superHashlist._id, {
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
            `Successfully ${action} ${results.length} super hashlists!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(superHashlists: Hashlist[]): void {
    const requests = superHashlists.map((superHashlist: Hashlist) => {
      return this.gs.delete(SERV.HASHLISTS, superHashlist._id);
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
            `Successfully deleted ${results.length} super hashlists!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(superHashlists: Hashlist[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.HASHLISTS, superHashlists[0]._id)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open('Successfully deleted superHashlist!', 'Close');
          this.reload();
        })
    );
  }

  private rowActionEdit(superHashlist: Hashlist): void {
    this.router.navigate(['/hashlists', 'hashlist', superHashlist._id, 'edit']);
  }

  /**
   * @todo Implement export action.
   */
  private rowActionExport(superHashlist: Hashlist): void {
    this.router.navigate(['/hashlists', superHashlist._id, 'copy']);
  }

  /**
   * @todo Implement import action.
   */
  private rowActionImport(superHashlist: Hashlist): void {
    this.router.navigate(['/hashlists', superHashlist._id, 'copy']);
  }

  setIsArchived(isArchived: boolean): void {
    this.isArchived = isArchived;
    this.dataSource.setIsArchived(isArchived);
  }
}
