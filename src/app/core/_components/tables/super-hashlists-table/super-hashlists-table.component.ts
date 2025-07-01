import { Observable, catchError, of } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { JHashlist } from '@models/hashlist.model';

import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
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
import { HashListContextMenuService } from '@services/context-menu/hashlist-menu.service';
import { SuperHashListContextMenuService } from '@services/context-menu/super-hashlist-menu.service';

@Component({
  selector: 'app-super-hashlists-table',
  templateUrl: './super-hashlists-table.component.html',
  standalone: false
})
export class SuperHashlistsTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  tableColumns: HTTableColumn[] = [];
  dataSource: SuperHashlistsDataSource;
  isArchived = false;
  selectedFilterColumn: string = 'all';
  protected contextMenuService: SuperHashListContextMenuService;

  ngOnInit(): void {
    this.setColumnLabels(SuperHashlistsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new SuperHashlistsDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.setIsArchived(this.isArchived);
    this.contextMenuService = new SuperHashListContextMenuService(this.permissionService).addContextMenu();
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
          item.id?.toString().includes(filterValue) ||
          item.name?.toLowerCase().includes(filterValue) ||
          item.hashTypeDescription?.toLowerCase().includes(filterValue) ||
          item.hashlists?.some((hl) => hl.name.toLowerCase().includes(filterValue))
        );
      }
      case 'id': {
        return item.id?.toString().includes(filterValue);
      }
      case 'name': {
        return item.name?.toLowerCase().includes(filterValue);
      }
      case 'hashTypeDescription': {
        return item.hashTypeDescription?.toLowerCase().includes(filterValue);
      }
      case 'hashlists': {
        return item.hashlists?.some((hl) => hl.name.toLowerCase().includes(filterValue));
      }
      default:
        // Default fallback to task name
        return item.name?.toLowerCase().includes(filterValue);
    }
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: SuperHashlistsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        isSearchable: true,
        export: async (superHashlist: JHashlist) => superHashlist.id + ''
      },
      {
        id: SuperHashlistsTableCol.NAME,
        dataKey: 'name',
        icon: (superHashlist: JHashlist) => this.renderSecretIcon(superHashlist),
        routerLink: (superHashlist: JHashlist) => this.renderHashlistLink(superHashlist),
        isSortable: true,
        isSearchable: true,
        export: async (superHashlist: JHashlist) => superHashlist.name
      },
      {
        id: SuperHashlistsTableCol.CRACKED,
        dataKey: 'cracked',
        icon: (superHashlist: JHashlist) => this.renderCrackedStatusIcon(superHashlist),
        render: (superHashlist: JHashlist) => this.renderCrackedHashes(superHashlist, false),
        export: async (superHashlist: JHashlist) => this.renderCrackedHashes(superHashlist, true)
      },
      {
        id: SuperHashlistsTableCol.HASHTYPE,
        dataKey: 'hashTypeDescription',
        isSortable: true,
        isSearchable: true,
        render: (hashlist: JHashlist) => hashlist.hashTypeDescription,
        export: async (superHashlist: JHashlist) => superHashlist.hashTypeDescription
      },
      {
        id: SuperHashlistsTableCol.HASHLISTS,
        dataKey: 'hashlists',
        routerLink: (superHashlist: JHashlist) => this.renderHashlistLinks(superHashlist),
        isSortable: false,
        isSearchable: true,
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

  exportActionClicked(event: ActionMenuEvent<JHashlist[]>): void {
    this.exportService.handleExportAction<JHashlist>(
      event,
      this.tableColumns,
      SuperHashlistsTableColumnLabel,
      'hashtopolis-super-hashlists'
    );
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

  // --- Action functions ---

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

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(superHashlists: JHashlist[]): void {
    this.subscriptions.push(
      this.gs
        .bulkDelete(SERV.HASHLISTS, superHashlists)
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
          this.alertService.showSuccessMessage('Successfully deleted superHashlist!');
          this.reload();
        })
    );
  }

  private rowActionEdit(superHashlist: JHashlist): void {
    this.router.navigate(['/hashlists', 'hashlist', superHashlist.id, 'edit']);
  }

  /**
   * Executes a row action to export cracked hashes from a superhashlist.
   * @param {superhashlist} superhashlist - The Superhaslist containing the cracked hashes to export.
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
          this.alertService.showSuccessMessage('Cracked hashes from Super-hashlist exported sucessfully!');
          this.reload();
        })
    );
  }

  private rowActionImport(superHashlist: JHashlist): void {
    this.router.navigate(['/hashlists/hashlist/' + superHashlist.id + '/import-cracked-hashes']);
  }
}
