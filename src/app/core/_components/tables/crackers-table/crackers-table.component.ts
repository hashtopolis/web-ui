/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  CrackerBinary,
  CrackerBinaryType
} from 'src/app/core/_models/cracker-binary.model';
import { HTTableColumn, HTTableRouterLink } from '../ht-table/ht-table.models';
import { catchError, forkJoin } from 'rxjs';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { Cacheable } from 'src/app/core/_decorators/cacheable';
import { CrackersDataSource } from 'src/app/core/_datasources/crackers.datasource';
import { CrackersTableColumnLabel } from './crackers-table.constants';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';

@Component({
  selector: 'crackers-table',
  templateUrl: './crackers-table.component.html'
})
export class CrackersTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  tableColumns: HTTableColumn[] = [];
  dataSource: CrackersDataSource;

  ngOnInit(): void {
    this.tableColumns = this.getColumns();
    this.dataSource = new CrackersDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: CrackerBinaryType, filterValue: string): boolean {
    if (item.typeName.toLowerCase().includes(filterValue)) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        name: CrackersTableColumnLabel.ID,
        dataKey: '_id',
        isSortable: true,
        export: async (cracker: CrackerBinaryType) => cracker._id + ''
      },
      {
        name: CrackersTableColumnLabel.NAME,
        dataKey: 'typeName',
        isSortable: true,
        export: async (cracker: CrackerBinaryType) => cracker.typeName
      },
      {
        name: CrackersTableColumnLabel.VERSIONS,
        dataKey: 'crackerVersions',
        routerLink: (cracker: CrackerBinaryType) =>
          this.renderVersions(cracker),
        isSortable: false,
        export: async (cracker: CrackerBinaryType) =>
          cracker.crackerVersions
            .map((bin: CrackerBinary) => bin.version)
            .join(', ')
      }
    ];

    return tableColumns;
  }

  openDialog(data: DialogData<CrackerBinaryType>) {
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

  exportActionClicked(event: ActionMenuEvent<CrackerBinaryType[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<CrackerBinaryType>(
          'hashtopolis-crackers',
          this.tableColumns,
          event.data
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<CrackerBinaryType>(
          'hashtopolis-crackers',
          this.tableColumns,
          event.data
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<CrackerBinaryType>(this.tableColumns, event.data)
          .then(() => {
            this.snackBar.open(
              'The selected rows are copied to the clipboard',
              'Close'
            );
          });
        break;
    }
  }

  rowActionClicked(event: ActionMenuEvent<CrackerBinaryType>): void {
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

  bulkActionClicked(event: ActionMenuEvent<CrackerBinaryType[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} crackers ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above crackers? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'crackername',
          action: event.menuItem.action
        });
        break;
    }
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(crackers: CrackerBinaryType[]): void {
    const requests = crackers.map((cracker: CrackerBinaryType) => {
      return this.gs.delete(SERV.CRACKERS_TYPES, cracker._id);
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
            `Successfully deleted ${results.length} crackers!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(crackers: CrackerBinaryType[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.CRACKERS_TYPES, crackers[0]._id)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open('Successfully deleted cracker!', 'Close');
          this.reload();
        })
    );
  }

  private rowActionAddVersion(cracker: CrackerBinaryType): void {
    this.router.navigate([
      '/config',
      'engine',
      'crackers',
      cracker.crackerBinaryTypeId,
      'new'
    ]);
  }

  @Cacheable(['_id', 'crackerVersions'])
  async renderVersions(
    cracker: CrackerBinaryType
  ): Promise<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    for (const link of cracker.crackerVersions) {
      links.push({
        label: link.version,
        routerLink: ['/config', 'engine', 'crackers', link._id, 'edit']
      });
    }

    return links;
  }
}
