import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { JPretask } from '@models/pretask.model';
import { JUser } from '@models/user.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import {
  AccessPermissionGroupsUsersTableCol,
  AccessPermissionGroupsUsersTableColumnLabel
} from '@components/tables/access-permission-groups-users-table/access-permission-groups-users-table.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { UsersTableStatus } from '@components/tables/users-table/users-table.constants';

import { AccessPermissionGroupsExpandDataSource } from '@datasources/access-permission-groups-expand.datasource';

import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';

@Component({
  selector: 'access-permission-groups-users-table',
  templateUrl: './access-permission-groups-users-table.component.html',
  standalone: false
})
export class AccessPermissionGroupsUsersTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() accesspermgroupId = 0;

  tableColumns: HTTableColumn[] = [];
  dataSource: AccessPermissionGroupsExpandDataSource;
  expand = 'userMembers';

  ngOnInit(): void {
    this.setColumnLabels(AccessPermissionGroupsUsersTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AccessPermissionGroupsExpandDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
    if (this.accesspermgroupId) {
      this.dataSource.setAccessPermGroupId(this.accesspermgroupId);
      this.dataSource.setAccessPermGroupExpand(this.expand);
    }
  }

  ngAfterViewInit(): void {
    // Wait until paginator is defined
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: JPretask, filterValue: string): boolean {
    return item.taskName.toLowerCase().includes(filterValue);
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: AccessPermissionGroupsUsersTableCol.ID,
        dataKey: 'id',
        routerLink: (user: JUser) => this.renderUserLink(user),
        isSortable: true,
        export: async (user: JUser) => user.id + ''
      },
      {
        id: AccessPermissionGroupsUsersTableCol.NAME,
        dataKey: 'name',
        isSortable: true,
        export: async (user: JUser) => user.name + ''
      },
      {
        id: AccessPermissionGroupsUsersTableCol.STATUS,
        dataKey: 'isValid',
        icon: (user: JUser) => this.renderIsValidIcon(user),
        render: (user: JUser) => (user.isValid ? UsersTableStatus.VALID : UsersTableStatus.INVALID),
        isSortable: true,
        export: async (user: JUser) => (user.isValid ? UsersTableStatus.VALID : UsersTableStatus.INVALID)
      },
      {
        id: AccessPermissionGroupsUsersTableCol.LAST_LOGIN,
        dataKey: 'lastLoginDate',
        render: (user: JUser) =>
          user.lastLoginDate ? formatUnixTimestamp(user.lastLoginDate, this.dateFormat) : 'Never',
        isSortable: true,
        export: async (user: JUser) =>
          user.lastLoginDate ? formatUnixTimestamp(user.lastLoginDate, this.dateFormat) : 'Never'
      }
    ];
  }

  // --- Action functions ---
  exportActionClicked(event: ActionMenuEvent<JUser[]>): void {
    this.exportService.handleExportAction<JUser>(
      event,
      this.tableColumns,
      AccessPermissionGroupsUsersTableColumnLabel,
      'hashtopolis-access-permission-groups-users'
    );
  }
}
