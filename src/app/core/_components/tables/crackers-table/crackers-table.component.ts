import { Observable, catchError, of } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { JCrackerBinary, JCrackerBinaryType } from '@models/cracker-binary.model';

import { CrackersContextMenuService } from '@services/context-menu/crackers/crackers-menu.service';
import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { CrackersTableCol, CrackersTableColumnLabel } from '@components/tables/crackers-table/crackers-table.constants';
import { HTTableColumn, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';

import { CrackersDataSource } from '@datasources/crackers.datasource';

@Component({
  selector: 'app-crackers-table',
  templateUrl: './crackers-table.component.html',
  standalone: false
})
export class CrackersTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  tableColumns: HTTableColumn[] = [];
  dataSource: CrackersDataSource;
  selectedFilterColumn: string = 'all';

  ngOnInit(): void {
    this.setColumnLabels(CrackersTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new CrackersDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.contextMenuService = new CrackersContextMenuService(this.permissionService).addContextMenu();
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: JCrackerBinaryType, filterValue: string): boolean {
    filterValue = filterValue.toLowerCase();
    const selectedColumn = this.selectedFilterColumn;
    // Filter based on selected column
    switch (selectedColumn) {
      case 'all': {
        // Search across multiple relevant fields
        return (
          item.id.toString().includes(filterValue) ||
          item.typeName.toLowerCase().includes(filterValue) ||
          item.crackerVersions.some((version: JCrackerBinary) => version.version.toLowerCase().includes(filterValue))
        );
      }
      case 'id': {
        return item.id.toString().includes(filterValue);
      }
      case 'typeName': {
        return item.typeName?.toLowerCase().includes(filterValue);
      }
      case 'crackerVersions': {
        return item.crackerVersions.some((version: JCrackerBinary) =>
          version.version.toLowerCase().includes(filterValue)
        );
      }
      default:
        // Default fallback to task name
        return item.typeName?.toLowerCase().includes(filterValue);
    }
  }
  getColumns(): HTTableColumn[] {
    return [
      {
        id: CrackersTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        isSearchable: true,
        export: async (cracker: JCrackerBinaryType) => cracker.id + ''
      },
      {
        id: CrackersTableCol.NAME,
        dataKey: 'typeName',
        isSortable: true,
        isSearchable: true,
        render: (cracker: JCrackerBinaryType) => cracker.typeName,
        export: async (cracker: JCrackerBinaryType) => cracker.typeName
      },
      {
        id: CrackersTableCol.VERSIONS,
        dataKey: 'crackerVersions',
        routerLink: (cracker: JCrackerBinaryType) => this.renderVersions(cracker),
        isSortable: false,
        isSearchable: true,
        export: async (cracker: JCrackerBinaryType) =>
          cracker.crackerVersions.map((bin: JCrackerBinary) => bin.version).join(', ')
      }
    ];
  }

  openDialog(data: DialogData<JCrackerBinaryType>) {
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

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<JCrackerBinaryType[]>): void {
    this.exportService.handleExportAction<JCrackerBinaryType>(
      event,
      this.tableColumns,
      CrackersTableColumnLabel,
      'hashtopolis-crackers'
    );
  }

  rowActionClicked(event: ActionMenuEvent<JCrackerBinaryType>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting cracker ${event.data.typeName} ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
      case RowActionMenuAction.NEW:
        this.rowActionAddVersion(event.data);
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<JCrackerBinaryType[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} crackers ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above crackers? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'typeName',
          action: event.menuItem.action
        });
        break;
    }
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(crackers: JCrackerBinaryType[]): void {
    this.subscriptions.push(
      this.gs
        .bulkDelete(SERV.CRACKERS_TYPES, crackers)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion: ', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage('Successfully deleted crackers');
          this.dataSource.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(crackers: JCrackerBinaryType[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.CRACKERS_TYPES, crackers[0].id)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage('Successfully deleted cracker');
          this.reload();
        })
    );
  }

  private rowActionAddVersion(cracker: JCrackerBinaryType): void {
    this.router.navigate(['/config', 'engine', 'crackers', cracker.id, 'new']);
  }

  /**
   * Render cracker versions link
   * @param cracker - cracker object to render bersion links for
   * @return observable object containing a router link array
   * @private
   */
  private renderVersions(cracker: JCrackerBinaryType): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (cracker) {
      cracker.crackerVersions.forEach((entry) => {
        links.push({
          label: entry.version,
          routerLink: ['/config', 'engine', 'crackers', entry.id, 'edit']
        });
      });
    }
    return of(links);
  }
}
