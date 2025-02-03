/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  HTTableColumn,
  HTTableIcon,
  HTTableRouterLink
} from '../ht-table/ht-table.models';
import {
  UsersTableCol,
  UsersTableColumnLabel,
  UsersTableStatus
} from './users-table.constants';
import { catchError, forkJoin } from 'rxjs';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { Cacheable } from 'src/app/core/_decorators/cacheable';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { UserData } from 'src/app/core/_models/user.model';
import { UsersDataSource } from 'src/app/core/_datasources/users.datasource';
import { formatUnixTimestamp } from 'src/app/shared/utils/datetime';

@Component({
  selector: 'users-table',
  templateUrl: './users-table.component.html'
})
export class UsersTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  tableColumns: HTTableColumn[] = [];
  dataSource: UsersDataSource;

  ngOnInit(): void {
    this.setColumnLabels(UsersTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new UsersDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: UserData, filterValue: string): boolean {
    if (
      item.attributes.name.toLowerCase().includes(filterValue) ||
      item.attributes.email.toLowerCase().includes(filterValue)
    ) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: UsersTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        export: async (user: UserData) => user.id + ''
      },
      {
        id: UsersTableCol.NAME,
        dataKey: 'name',
        routerLink: (user: UserData) => this.renderUserLink(user),
        isSortable: true,
        export: async (user: UserData) => user.attributes.name
      },
      {
        id: UsersTableCol.REGISTERED,
        dataKey: 'registeredSince',
        render: (user: UserData) =>
          formatUnixTimestamp(user.attributes.registeredSince, this.dateFormat),
        isSortable: true,
        export: async (user: UserData) =>
          formatUnixTimestamp(user.attributes.registeredSince, this.dateFormat)
      },
      {
        id: UsersTableCol.LAST_LOGIN,
        dataKey: 'lastLoginDate',
        render: (user: UserData) =>
          user.attributes.lastLoginDate
            ? formatUnixTimestamp(user.attributes.lastLoginDate, this.dateFormat)
            : 'Never',
        isSortable: true,
        export: async (user: UserData) =>
          user.attributes.lastLoginDate
            ? formatUnixTimestamp(user.attributes.lastLoginDate, this.dateFormat)
            : 'Never'
      },
      {
        id: UsersTableCol.EMAIL,
        dataKey: 'email',
        isSortable: true,
        render: (user: UserData) => user.attributes.email,
        export: async (user: UserData) => user.attributes.email
      },
      {
        id: UsersTableCol.STATUS,
        dataKey: 'isValid',
        icons: (user: UserData) => this.renderIsValidIcon(user),
        render: (user: UserData) =>
          user.attributes.isValid ? UsersTableStatus.VALID : UsersTableStatus.INVALID,
        isSortable: true,
        export: async (user: UserData) =>
          user.attributes.isValid ? UsersTableStatus.VALID : UsersTableStatus.INVALID
      },
      {
        id: UsersTableCol.SESSION,
        dataKey: 'sessionLifetime',
        isSortable: true,
        render: (user: UserData) => user.attributes.sessionLifetime,
        export: async (user: UserData) => user.attributes.sessionLifetime + ''
      },
      {
        id: UsersTableCol.PERM_GROUP,
        dataKey: 'globalPermissionGroupName',
        isSortable: true,
        render: (user: UserData) => user.attributes.globalPermissionGroupName,
        export: async (user: UserData) => user.attributes.globalPermissionGroupName
      }
    ];

    return tableColumns;
  }

  openDialog(data: DialogData<UserData>) {
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
            case BulkActionMenuAction.ACTIVATE:
              this.bulkActionActivate(result.data, true);
              break;
            case BulkActionMenuAction.DEACTIVATE:
              this.bulkActionActivate(result.data, false);
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

  @Cacheable(['id', 'isValid'])
  async renderIsValidIcon(user: UserData): Promise<HTTableIcon[]> {
    return user.attributes.isValid
      ? [
          {
            name: 'check_circle',
            cls: 'text-ok'
          }
        ]
      : [
          {
            name: 'remove_circle',
            cls: 'text-critical'
          }
        ];
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<UserData[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<UserData>(
          'hashtopolis-users',
          this.tableColumns,
          event.data,
          UsersTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<UserData>(
          'hashtopolis-users',
          this.tableColumns,
          event.data,
          UsersTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<UserData>(
            this.tableColumns,
            event.data,
            UsersTableColumnLabel
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

  rowActionClicked(event: ActionMenuEvent<UserData>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.EDIT:
        this.rowActionEdit(event.data);
        break;
      case RowActionMenuAction.ACTIVATE:
        this.bulkActionActivate([event.data], true);
        break;
      case RowActionMenuAction.DEACTIVATE:
        this.bulkActionActivate([event.data], false);
        break;
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting user ${event.data.attributes.name} ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<UserData[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.ACTIVATE:
        this.openDialog({
          rows: event.data,
          title: `Activating ${event.data.length} users ...`,
          icon: 'info',
          listAttribute: 'name',
          action: event.menuItem.action
        });
        break;
      case BulkActionMenuAction.DEACTIVATE:
        this.openDialog({
          rows: event.data,
          title: `Deactivating ${event.data.length} users ...`,
          icon: 'info',
          listAttribute: 'name',
          action: event.menuItem.action
        });
        break;
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} users ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above users? Note that this action cannot be undone.`,
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
  private bulkActionDelete(users: UserData[]): void {
    const requests = users.map((user: UserData) => {
      return this.gs.delete(SERV.USERS, user.id);
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
            `Successfully deleted ${results.length} users!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionActivate(users: UserData[], isValid: boolean): void {
    const requests = users.map((user: UserData) => {
      return this.gs.update(SERV.USERS, user.id, { isValid: isValid });
    });

    const action = isValid ? 'activated' : 'deactivated';

    this.subscriptions.push(
      forkJoin(requests)
        .pipe(
          catchError((error) => {
            console.error('Error during activation:', error);
            return [];
          })
        )
        .subscribe((results) => {
          this.snackBar.open(
            `Successfully ${action} ${results.length} users!`,
            'Close'
          );
          this.dataSource.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(users: UserData[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.USERS, users[0].id)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open('Successfully deleted user!', 'Close');
          this.reload();
        })
    );
  }

  private rowActionEdit(user: UserData): void {
    this.renderUserLink(user).then((links: HTTableRouterLink[]) => {
      this.router.navigate(['/users', user.id, 'edit']);
    });
  }
}
