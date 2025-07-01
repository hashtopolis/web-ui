import { catchError, Observable, of } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { JHashlist } from '@models/hashlist.model';

import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import {
  HashlistsTableCol,
  HashlistsTableColumnLabel
} from '@components/tables/hashlists-table/hashlists-table.constants';
import { HTTableColumn, HTTableIcon, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';

import { HashlistsDataSource } from '@datasources/hashlists.datasource';

import { HashListFormatLabel } from '@src/app/core/_constants/hashlist.config';
import { HashListContextMenuService } from '@services/context-menu/hashlist-menu.service';

@Component({
  selector: 'app-hashlists-table',
  templateUrl: './hashlists-table.component.html',
  standalone: false
})
export class HashlistsTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  tableColumns: HTTableColumn[] = [];
  dataSource: HashlistsDataSource;
  isArchived = false;
  selectedFilterColumn: string = 'all';
  protected contextMenuService: HashListContextMenuService;

  ngOnInit(): void {
    this.setColumnLabels(HashlistsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new HashlistsDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.setIsArchived(this.isArchived);
    this.contextMenuService = new HashListContextMenuService(this.permissionService).addContextMenu();
    if (this.shashlistId) {
      this.dataSource.setSuperHashListID(this.shashlistId);
    }
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: JHashlist, filterValue: string): boolean {
    filterValue = filterValue.toLowerCase();
    const selectedColumn = this.selectedFilterColumn;
    // Filter based on selected column
    switch (selectedColumn) {
      case 'all': {
        // Search across multiple relevant fields
        return (
          item.id.toString().includes(filterValue) ||
          item.name?.toLowerCase().includes(filterValue) ||
          item.hashTypeDescription.toLowerCase().includes(filterValue) ||
          (item.hashTypeId.toString().toLowerCase() + '-' + item.hashTypeDescription.toString().toLowerCase()).includes(
            filterValue
          )
        );
      }
      case 'id': {
        return item.id?.toString().includes(filterValue);
      }
      case 'name': {
        return item.name?.toLowerCase().includes(filterValue);
      }
      case 'hashTypeDescription': {
        return (
          item.hashTypeDescription.toLowerCase().includes(filterValue) ||
          (item.hashTypeId.toString().toLowerCase() + '-' + item.hashTypeDescription.toString().toLowerCase()).includes(
            filterValue
          )
        );
      }
      default:
        // Default fallback to task name
        return item.name?.toLowerCase().includes(filterValue);
    }
  }

  getColumns(): HTTableColumn[] {
    const tableColumns: HTTableColumn[] = [
      {
        id: HashlistsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        isSearchable: true,
        export: async (hashlist: JHashlist) => hashlist.id + ''
      },
      {
        id: HashlistsTableCol.NAME,
        dataKey: 'name',
        routerLink: (hashlist: JHashlist) => this.renderHashlistLink(hashlist),
        isSortable: true,
        isSearchable: true,
        export: async (hashlist: JHashlist) => hashlist.name
      },
      {
        id: HashlistsTableCol.HASH_COUNT,
        dataKey: 'hashCount',
        isSortable: true,
        routerLink: (hashlist: JHashlist) => this.renderHashCountLink(hashlist),
        export: async (hashlist: JHashlist) => hashlist.hashCount + ''
      },
      {
        id: HashlistsTableCol.CRACKED,
        dataKey: 'cracked',
        icon: (hashlist: JHashlist) => this.renderCrackedStatusIcon(hashlist),
        render: (hashlist: JHashlist) => this.renderCrackedHashes(hashlist, false),
        isSortable: true,
        export: async (hashlist: JHashlist) => this.renderCrackedHashes(hashlist, true)
      },
      {
        id: HashlistsTableCol.FORMAT,
        dataKey: 'format',
        isSortable: true,
        render: (hashlist: JHashlist) => this.sanitize(HashListFormatLabel[hashlist.format]),
        export: async (hashlist: JHashlist) => HashListFormatLabel[hashlist.format]
      }
    ];

    if (!this.shashlistId) {
      tableColumns.push({
        id: HashlistsTableCol.HASHTYPE,
        dataKey: 'hashTypeDescription',
        isSearchable: true,
        isSortable: true,
        render: (hashlist: JHashlist) => hashlist.hashTypeId + ' - ' + hashlist.hashTypeDescription,
        export: async (hashlist: JHashlist) => hashlist.hashTypeDescription
      });
    }

    return tableColumns;
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

  exportActionClicked(event: ActionMenuEvent<JHashlist[]>): void {
    this.exportService.handleExportAction<JHashlist>(
      event,
      this.tableColumns,
      HashlistsTableColumnLabel,
      'hashtopolis-hashlists'
    );
  }

  // --- Action functions ---

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
          title: `Deleting hashlist with id ${event.data.id} (${event.data.hashTypeDescription}) ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note that this action cannot be undone. ${
            this.shashlistId ? ' This action is deleting not unassigning.' : ''
          }`,
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<JHashlist[]>): void {
    const hashlistCount = event.data.length;
    const label = hashlistCount > 1 ? 'hashlists' : 'hashlist';

    switch (event.menuItem.action) {
      case BulkActionMenuAction.ARCHIVE:
        this.openDialog({
          rows: event.data,
          title: `Archiving ${event.data.length} ${label} ...`,
          icon: 'info',
          listAttribute: 'name',
          action: event.menuItem.action
        });
        break;
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} ${label} ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above ${label}? Note that this action cannot be undone. ${
            this.shashlistId ? ' This action is deleting not unassigning.' : ''
          }`,
          warn: true,
          listAttribute: 'name',
          action: event.menuItem.action
        });
        break;
    }
  }

  setIsArchived(isArchived: boolean): void {
    this.isArchived = isArchived;
    this.dataSource.setIsArchived(isArchived);
  }

  private renderCrackedStatusIcon(hashlist: JHashlist): HTTableIcon {
    if (hashlist.hashCount === hashlist.cracked) {
      return {
        name: 'check_circle',
        tooltip: 'Cracked',
        cls: 'text-ok'
      };
    }

    return { name: '' };
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionArchive(hashlists: JHashlist[], isArchived: boolean): void {
    const action = isArchived ? 'archived' : 'unarchived';
    this.subscriptions.push(
      this.gs.bulkUpdate(SERV.HASHLISTS, hashlists, { isArchived: isArchived }).subscribe(() => {
        this.alertService.showSuccessMessage(`Successfully ${action} hashlists!`);
        this.reload();
      })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(hashlists: JHashlist[]): void {
    this.subscriptions.push(
      this.gs
        .bulkDelete(SERV.HASHLISTS, hashlists)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion: ', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage(`Successfully deleted hashlists!`);
          this.dataSource.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(hashlists: JHashlist[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.HASHLISTS, hashlists[0].id)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage('Successfully deleted hashlist!');
          this.reload();
        })
    );
  }

  private rowActionEdit(hashlist: JHashlist): void {
    this.renderHashlistLink(hashlist)
      .subscribe((links: HTTableRouterLink[]) => {
        this.router.navigate(links[0].routerLink).then(() => {
        });
      })
      .unsubscribe();
  }

  /**
   * Executes a row action to export cracked hashes from a hashlist.
   * @param {Hashlist} hashlist - The hashlist containing the cracked hashes to export.
   * @private
   * @returns {void}
   */
  private rowActionExport(hashlist: JHashlist): void {
    const payload = { hashlistId: hashlist.id };
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
          this.alertService.showSuccessMessage('Cracked hashes from hashlist exported sucessfully!');
          this.reload();
        })
    );
  }

  private rowActionImport(hashlist: JHashlist): void {
    this.router.navigate(['/hashlists/hashlist/' + hashlist.id + '/import-cracked-hashes']);
  }

  /**
   * Show hashcount and render hashlist link
   * @param hashlist - hashlist object to show count for
   * @return observable array containing the link to render
   * @private
   */
  private renderHashCountLink(hashlist: JHashlist): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (hashlist) {
      links.push({
        routerLink: ['/hashlists', 'hashes', 'hashlists', hashlist.id],
        label: hashlist.hashCount.toLocaleString()
      });
    }
    return of(links);
  }
}
