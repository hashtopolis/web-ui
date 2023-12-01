/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  PermissionsTableCol,
  PermissionsTableColumnLabel
} from './permissions-table.constants';
import { catchError, forkJoin } from 'rxjs';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { GlobalPermissionGroup } from 'src/app/core/_models/global-permission-group.model';
import { HTTableColumn } from '../ht-table/ht-table.models';
import { PermissionsDataSource } from 'src/app/core/_datasources/permissions.datasource';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';

@Component({
  selector: 'permissions-table',
  templateUrl: './permissions-table.component.html'
})
export class PermissionsTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  tableColumns: HTTableColumn[] = [];
  dataSource: PermissionsDataSource;

  ngOnInit(): void {
    this.setColumnLabels(PermissionsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new PermissionsDataSource(
      this.cdr,
      this.gs,
      this.uiService
    );
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: GlobalPermissionGroup, filterValue: string): boolean {
    if (item.name.toLowerCase().includes(filterValue)) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: PermissionsTableCol.ID,
        dataKey: '_id',
        isSortable: true,
        export: async (permission: GlobalPermissionGroup) => permission._id + ''
      },
      {
        id: PermissionsTableCol.NAME,
        dataKey: 'name',
        routerLink: (permission: GlobalPermissionGroup) =>
          this.renderPermissionLink(permission),
        isSortable: true,
        export: async (permission: GlobalPermissionGroup) => permission.name
      },
      {
        id: PermissionsTableCol.MEMBERS,
        dataKey: 'numUsers',
        isSortable: true,
        render: (permission: GlobalPermissionGroup) => permission.user.length,
        export: async (permission: GlobalPermissionGroup) => permission._id + ''
      }
    ];

    return tableColumns;
  }

  openDialog(data: DialogData<GlobalPermissionGroup>) {
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

  exportActionClicked(event: ActionMenuEvent<GlobalPermissionGroup[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<GlobalPermissionGroup>(
          'hashtopolis-permissions',
          this.tableColumns,
          event.data,
          PermissionsTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<GlobalPermissionGroup>(
          'hashtopolis-permissions',
          this.tableColumns,
          event.data,
          PermissionsTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<GlobalPermissionGroup>(
            this.tableColumns,
            event.data,
            PermissionsTableColumnLabel
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

  rowActionClicked(event: ActionMenuEvent<GlobalPermissionGroup>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting permission ${event.data.name} ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
      case RowActionMenuAction.EDIT:
        this.rowActionEdit(event.data);
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<GlobalPermissionGroup[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} permissions ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above permissions? Note that this action cannot be undone.`,
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
  private bulkActionDelete(permissions: GlobalPermissionGroup[]): void {
    const requests = permissions.map((permission: GlobalPermissionGroup) => {
      return this.gs.delete(SERV.ACCESS_PERMISSIONS_GROUPS, permission._id);
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
            `Successfully deleted ${results.length} permissions!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(permissions: GlobalPermissionGroup[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.ACCESS_PERMISSIONS_GROUPS, permissions[0]._id)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open('Successfully deleted permission group!', 'Close');
          this.reload();
        })
    );
  }

  private rowActionEdit(permission: GlobalPermissionGroup): void {
    this.router.navigate([
      '/users',
      'global-permissions-groups',
      permission._id,
      'edit'
    ]);
  }
}
