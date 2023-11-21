/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  HTTableColumn,
  HTTableIcon,
  HTTableRouterLink
} from '../ht-table/ht-table.models';
import {
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
import { User } from 'src/app/core/_models/user.model';
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

  filter(item: User, filterValue: string): boolean {
    if (
      item.name.toLowerCase().includes(filterValue) ||
      item.email.toLowerCase().includes(filterValue)
    ) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        name: UsersTableColumnLabel.ID,
        dataKey: '_id',
        isSortable: true,
        export: async (user: User) => user._id + ''
      },
      {
        name: UsersTableColumnLabel.NAME,
        dataKey: 'name',
        routerLink: (user: User) => this.renderUserLink(user),
        isSortable: true,
        export: async (user: User) => user.name
      },
      {
        name: UsersTableColumnLabel.REGISTERED,
        dataKey: 'registeredSince',
        render: (user: User) =>
          formatUnixTimestamp(user.registeredSince, this.dateFormat),
        isSortable: true,
        export: async (user: User) =>
          formatUnixTimestamp(user.registeredSince, this.dateFormat)
      },
      {
        name: UsersTableColumnLabel.LAST_LOGIN,
        dataKey: 'lastLoginDate',
        render: (user: User) =>
          user.lastLoginDate
            ? formatUnixTimestamp(user.lastLoginDate, this.dateFormat)
            : 'Never',
        isSortable: true,
        export: async (user: User) =>
          user.lastLoginDate
            ? formatUnixTimestamp(user.lastLoginDate, this.dateFormat)
            : 'Never'
      },
      {
        name: UsersTableColumnLabel.EMAIL,
        dataKey: 'email',
        isSortable: true,
        export: async (user: User) => user.email
      },
      {
        name: UsersTableColumnLabel.STATUS,
        dataKey: 'isValid',
        icons: (user: User) => this.renderStatusIcon(user),
        render: (user: User) =>
          user.isValid ? UsersTableStatus.VALID : UsersTableStatus.INVALID,
        isSortable: true,
        export: async (user: User) =>
          user.isValid ? UsersTableStatus.VALID : UsersTableStatus.INVALID
      },
      {
        name: UsersTableColumnLabel.SESSION,
        dataKey: 'sessionLifetime',
        isSortable: true,
        export: async (user: User) => user.sessionLifetime + ''
      },
      {
        name: UsersTableColumnLabel.PERM_GROUP,
        dataKey: 'globalPermissionGroupName',
        isSortable: true,
        export: async (user: User) => user.globalPermissionGroupName
      }
    ];

    return tableColumns;
  }

  openDialog(data: DialogData<User>) {
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

  @Cacheable(['_id', 'isValid'])
  async renderStatusIcon(user: User): Promise<HTTableIcon[]> {
    return user.isValid
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

  exportActionClicked(event: ActionMenuEvent<User[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<User>(
          'hashtopolis-users',
          this.tableColumns,
          event.data
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<User>(
          'hashtopolis-users',
          this.tableColumns,
          event.data
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<User>(this.tableColumns, event.data)
          .then(() => {
            this.snackBar.open(
              'The selected rows are copied to the clipboard',
              'Close'
            );
          });
        break;
    }
  }

  rowActionClicked(event: ActionMenuEvent<User>): void {
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
          title: `Deleting user ${event.data.name} ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<User[]>): void {
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
  private bulkActionDelete(users: User[]): void {
    const requests = users.map((user: User) => {
      return this.gs.delete(SERV.HASHLISTS, user._id);
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
  private bulkActionActivate(users: User[], isValid: boolean): void {
    const requests = users.map((user: User) => {
      return this.gs.update(SERV.USERS, user._id, { isValid: isValid });
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
  private rowActionDelete(users: User[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.HASHLISTS, users[0]._id)
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

  private rowActionEdit(user: User): void {
    this.renderUserLink(user).then((links: HTTableRouterLink[]) => {
      this.router.navigate(links[0].routerLink);
    });
  }
}
