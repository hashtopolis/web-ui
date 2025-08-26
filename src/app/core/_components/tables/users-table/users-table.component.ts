import { catchError } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { JUser } from '@models/user.model';

import { UsersContextMenuService } from '@services/context-menu/users/users-menu.service';
import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { HTTableColumn, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';
import {
  UsersTableCol,
  UsersTableColumnLabel,
  UsersTableStatus
} from '@components/tables/users-table/users-table.constants';

import { UsersDataSource } from '@datasources/users.datasource';

import { FilterType } from '@src/app/core/_models/request-params.model';
import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  standalone: false
})
export class UsersTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  tableColumns: HTTableColumn[] = [];
  dataSource: UsersDataSource;
  selectedFilterColumn: string;

  ngOnInit(): void {
    this.setColumnLabels(UsersTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new UsersDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
    this.contextMenuService = new UsersContextMenuService(this.permissionService).addContextMenu();
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(input: string) {
    const selectedColumn = this.selectedFilterColumn;
    if (input && input.length > 0) {
      this.dataSource.loadAll({ value: input, field: selectedColumn, operator: FilterType.ICONTAINS });
      return;
    } else {
      this.dataSource.loadAll(); // Reload all data if input is empty
    }
  }
  handleBackendSqlFilter(event: string) {
    if (event && event.trim().length > 0) {
      this.filter(event);
    } else {
      // Clear the filter when search box is cleared
      this.dataSource.clearFilter();
    }
  }
  getColumns(): HTTableColumn[] {
    return [
      {
        id: UsersTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        isSearchable: true,
        render: (user: JUser) => user.id,
        export: async (user: JUser) => user.id + ''
      },
      {
        id: UsersTableCol.NAME,
        dataKey: 'name',
        routerLink: (user: JUser) => this.renderUserLink(user),
        isSortable: true,
        isSearchable: true,
        export: async (user: JUser) => user.name
      },
      {
        id: UsersTableCol.REGISTERED,
        dataKey: 'registeredSince',
        render: (user: JUser) => formatUnixTimestamp(user.registeredSince, this.dateFormat),
        isSortable: true,
        export: async (user: JUser) => formatUnixTimestamp(user.registeredSince, this.dateFormat)
      },
      {
        id: UsersTableCol.LAST_LOGIN,
        dataKey: 'lastLoginDate',
        render: (user: JUser) =>
          user.lastLoginDate ? formatUnixTimestamp(user.lastLoginDate, this.dateFormat) : 'Never',
        isSortable: true,
        export: async (user: JUser) =>
          user.lastLoginDate ? formatUnixTimestamp(user.lastLoginDate, this.dateFormat) : 'Never'
      },
      {
        id: UsersTableCol.EMAIL,
        dataKey: 'email',
        isSortable: true,
        isSearchable: true,
        render: (user: JUser) => user.email,
        export: async (user: JUser) => user.email
      },
      {
        id: UsersTableCol.STATUS,
        dataKey: 'isValid',
        icon: (user: JUser) => this.renderIsValidIcon(user),
        render: (user: JUser) => (user.isValid ? UsersTableStatus.VALID : UsersTableStatus.INVALID),
        isSortable: true,
        export: async (user: JUser) => (user.isValid ? UsersTableStatus.VALID : UsersTableStatus.INVALID)
      },
      {
        id: UsersTableCol.SESSION,
        dataKey: 'sessionLifetime',
        isSortable: true,
        render: (user: JUser) => user.sessionLifetime,
        export: async (user: JUser) => user.sessionLifetime + ''
      },
      {
        id: UsersTableCol.PERM_GROUP,
        dataKey: 'globalPermissionGroupName',
        isSortable: false,
        render: (user: JUser) => user.globalPermissionGroup.name,
        export: async (user: JUser) => user.globalPermissionGroup.name
      }
    ];
  }

  openDialog(data: DialogData<JUser>) {
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

  // --- Action functions ---
  exportActionClicked(event: ActionMenuEvent<JUser[]>): void {
    this.exportService.handleExportAction<JUser>(event, this.tableColumns, UsersTableColumnLabel, 'hashtopolis-users');
  }

  rowActionClicked(event: ActionMenuEvent<JUser>): void {
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

  bulkActionClicked(event: ActionMenuEvent<JUser[]>): void {
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
  private bulkActionDelete(users: JUser[]): void {
    this.subscriptions.push(
      this.gs
        .bulkDelete(SERV.USERS, users)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion: ', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage(`Successfully deleted users!`);
          this.dataSource.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionActivate(users: JUser[], isValid: boolean): void {
    const action = isValid ? 'activated' : 'deactivated';

    this.subscriptions.push(
      this.gs.bulkUpdate(SERV.USERS, users, { isValid: isValid }).subscribe(() => {
        this.alertService.showSuccessMessage(`Successfully ${action} users!`);
        this.reload();
      })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(users: JUser[]): void {
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
          this.alertService.showSuccessMessage('Successfully deleted user!');
          this.reload();
        })
    );
  }

  private rowActionEdit(user: JUser): void {
    this.renderUserLink(user).subscribe((links: HTTableRouterLink[]) => {
      this.router.navigate(links[0].routerLink).then(() => {});
    });
  }
}
