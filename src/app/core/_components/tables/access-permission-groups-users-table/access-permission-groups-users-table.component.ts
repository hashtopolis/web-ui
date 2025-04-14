/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HTTableColumn, HTTableIcon } from '../ht-table/ht-table.models';
import {
  AccessPermissionGroupsUsersTableCol,
  AccessPermissionGroupsUsersTableColumnLabel
} from './access-permission-groups-users-table.constants';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { AccessPermissionGroupsExpandDataSource } from 'src/app/core/_datasources/access-permission-groups-expand.datasource';
import { BaseTableComponent } from '../base-table/base-table.component';
import { Cacheable } from 'src/app/core/_decorators/cacheable';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { Pretask } from 'src/app/core/_models/pretask.model';
import { User } from 'src/app/core/_models/user.model';
import { UsersTableStatus } from '../users-table/users-table.constants';
import { formatUnixTimestamp } from 'src/app/shared/utils/datetime';

@Component({
  selector: 'access-permission-groups-users-table',
  templateUrl: './access-permission-groups-users-table.component.html'
})
export class AccessPermissionGroupsUsersTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  @Input() accesspermgroupId = 0;

  tableColumns: HTTableColumn[] = [];
  dataSource: AccessPermissionGroupsExpandDataSource;
  expand = 'user';

  ngOnInit(): void {
    this.setColumnLabels(AccessPermissionGroupsUsersTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AccessPermissionGroupsExpandDataSource(
      this.cdr,
      this.gs,
      this.uiService
    );
    this.dataSource.setColumns(this.tableColumns);
    if (this.accesspermgroupId) {
      this.dataSource.setAccessPermGroupId(this.accesspermgroupId);
      this.dataSource.setAccessPermGroupExpand(this.expand);
    }
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: Pretask, filterValue: string): boolean {
    return item.taskName.toLowerCase().includes(filterValue);
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: AccessPermissionGroupsUsersTableCol.ID,
        dataKey: '_id',
        routerLink: (user: User) => this.renderUserLink(user),
        isSortable: true,
        export: async (user: User) => user._id + ''
      },
      {
        id: AccessPermissionGroupsUsersTableCol.NAME,
        dataKey: 'name',
        isSortable: true,
        render: (user: User) => user.name,
        export: async (user: User) => user.name + ''
      },
      {
        id: AccessPermissionGroupsUsersTableCol.STATUS,
        dataKey: 'isValid',
        icons: (user: User) => this.renderIsValidIcon(user),
        render: (user: User) =>
          user.isValid ? UsersTableStatus.VALID : UsersTableStatus.INVALID,
        isSortable: true,
        export: async (user: User) =>
          user.isValid ? UsersTableStatus.VALID : UsersTableStatus.INVALID
      },
      {
        id: AccessPermissionGroupsUsersTableCol.LAST_LOGIN,
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
      }
    ];
    return tableColumns;
  }

  // --- Render functions ---

  @Cacheable(['_id', 'isValid'])
  async renderIsValidIcon(user: User): Promise<HTTableIcon[]> {
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
          'hashtopolis-access-permission-groups-users',
          this.tableColumns,
          event.data,
          AccessPermissionGroupsUsersTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<User>(
          'hashtopolis-access-permission-groups-users',
          this.tableColumns,
          event.data,
          AccessPermissionGroupsUsersTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<User>(
            this.tableColumns,
            event.data,
            AccessPermissionGroupsUsersTableColumnLabel
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
}
