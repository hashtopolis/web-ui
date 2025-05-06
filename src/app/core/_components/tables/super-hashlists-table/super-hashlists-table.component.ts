import { Observable, catchError, forkJoin, of } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { JHashlist } from '@models/hashlist.model';

import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { ExportMenuAction } from '@components/menus/export-menu/export-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { HTTableColumn, HTTableIcon, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';
import {
  SuperHashlistsTableCol,
  SuperHashlistsTableColumnLabel
} from '@components/tables/super-hashlists-table/super-hashlists-table.constants';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';

import { SuperHashlistsDataSource } from '@datasources/super-hashlists.datasource';

import { formatPercentage } from '@src/app/shared/utils/util';

@Component({
  selector: 'app-super-hashlists-table',
  templateUrl: './super-hashlists-table.component.html',
  standalone: false
})
export class SuperHashlistsTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  tableColumns: HTTableColumn[] = [];
  dataSource: SuperHashlistsDataSource;
  isArchived = false;

  ngOnInit(): void {
    this.setColumnLabels(SuperHashlistsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new SuperHashlistsDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.setIsArchived(this.isArchived);
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: JHashlist, filterValue: string): boolean {
    return (
      item.name.toLowerCase().includes(filterValue) || item.hashTypeDescription.toLowerCase().includes(filterValue)
    );
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: SuperHashlistsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        export: async (superHashlist: JHashlist) => superHashlist.id + ''
      },
      {
        id: SuperHashlistsTableCol.NAME,
        dataKey: 'name',
        iconsNoCache: (superHashlist: JHashlist) => this.renderSecretIcon(superHashlist),
        routerLink: (superHashlist: JHashlist) => this.renderHashlistLink(superHashlist),
        isSortable: true,
        export: async (superHashlist: JHashlist) => superHashlist.name
      },
      {
        id: SuperHashlistsTableCol.CRACKED,
        dataKey: 'cracked',
        iconsNoCache: (superHashlist: JHashlist) => this.renderCrackedStatusIcon(superHashlist),
        render: (superHashlist: JHashlist) => formatPercentage(superHashlist.cracked, superHashlist.hashCount),
        isSortable: true,
        export: async (superHashlist: JHashlist) => formatPercentage(superHashlist.cracked, superHashlist.hashCount)
      },
      {
        id: SuperHashlistsTableCol.HASHTYPE,
        dataKey: 'hashTypeDescription',
        isSortable: true,
        render: (hashlist: JHashlist) => hashlist.hashTypeDescription,
        export: async (superHashlist: JHashlist) => superHashlist.hashTypeDescription
      },
      {
        id: SuperHashlistsTableCol.HASHLISTS,
        dataKey: 'hashlists',
        routerLink: (superHashlist: JHashlist) => this.renderHashlistLinks(superHashlist),
        isSortable: false,
        export: async (superHashlist: JHashlist) => superHashlist.hashTypeDescription
      }
    ];
  }

  openDialog(data: DialogData<JHashlist>) {
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
            case BulkActionMenuAction.DELETE:
              this.bulkActionDelete(result.data);
              break;
          }
        }
      })
    );
  }

  /**
   * Render hashlist links contained in a super hashlist
   * @param superHashlist - superhashlist object to render links for
   * @return observable object containing a router link array
   */
  private renderHashlistLinks(superHashlist: JHashlist): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (superHashlist && superHashlist.hashlists && superHashlist.hashlists.length) {
      superHashlist.hashlists.forEach((entry) => {
        links.push({
          label: entry.name,
          routerLink: ['/hashlists', 'hashlist', entry.id, 'edit']
        });
      });
    }
    return of(links);
  }

  private renderCrackedStatusIcon(superHashlist: JHashlist): HTTableIcon {
    if (superHashlist.hashCount === superHashlist.cracked) {
      return {
        name: 'check_circle',
        tooltip: 'Cracked',
        cls: 'text-ok'
      };
    }

    return { name: '' };
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<JHashlist[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<JHashlist>(
          'hashtopolis-super-hashlists',
          this.tableColumns,
          event.data,
          SuperHashlistsTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<JHashlist>(
          'hashtopolis-super-hashlists',
          this.tableColumns,
          event.data,
          SuperHashlistsTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<JHashlist>(this.tableColumns, event.data, SuperHashlistsTableColumnLabel)
          .then(() => {
            this.snackBar.open('The selected rows are copied to the clipboard', 'Close');
          });
        break;
    }
  }

  rowActionClicked(event: ActionMenuEvent<JHashlist>): void {
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
          title: `Deleting Super-hashlist with id ${event.data.id} (${event.data.hashType.description}) ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note: This action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<JHashlist[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} Super-hashlists ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above Super-hashlist? Note: This action cannot be undone.`,
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
  private bulkActionDelete(superHashlists: JHashlist[]): void {
    const requests = superHashlists.map((superHashlist: JHashlist) => {
      return this.gs.delete(SERV.HASHLISTS, superHashlist.id);
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
          this.snackBar.open(`Successfully deleted ${results.length} Super-hashlists!`, 'Close');
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(superHashlists: JHashlist[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.HASHLISTS, superHashlists[0].id)
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

  private rowActionEdit(superHashlist: JHashlist): void {
    this.router.navigate(['/hashlists', 'hashlist', superHashlist.id, 'edit']);
  }

  /**
   * Executes a row action to export cracked hashes from a superhashlist.
   * @param {Hashlist} hashlist - The Superhaslist containing the cracked hashes to export.
   * @private
   * @returns {void}
   */
  private rowActionExport(superhashlist: JHashlist): void {
    const payload = { hashlistId: superhashlist.id };
    this.subscriptions.push(
      this.gs
        .chelper(SERV.HELPER, 'exportCrackedHashes', payload)
        .pipe(
          catchError((error) => {
            console.error('Error during exporting:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open('Cracked hashes from Super-hashlist exported sucessfully!', 'Close');
          this.reload();
        })
    );
  }

  private rowActionImport(superHashlist: JHashlist): void {
    this.router.navigate(['/hashlists/hashlist/' + superHashlist.id + '/import-cracked-hashes']);
  }
}
