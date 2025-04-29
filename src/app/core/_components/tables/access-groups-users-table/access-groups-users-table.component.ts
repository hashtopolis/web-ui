import { catchError } from 'rxjs';

/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  HTTableColumn,
  HTTableIcon,
  HTTableRouterLink
} from '@src/app/core/_components/tables/ht-table/ht-table.models';

import { JUser } from '@src/app/core/_models/user.model';
import { JPretask } from '@src/app/core/_models/pretask.model';

import {
  AccessGroupsUsersTableCol,
  AccessGroupsUsersTableColumnLabel
} from '@src/app/core/_components/tables/access-groups-users-table/access-groups-users-table.constants';
import { ActionMenuEvent } from '@src/app/core/_components/menus/action-menu/action-menu.model';
import { BaseTableComponent } from '@src/app/core/_components/tables/base-table/base-table.component';
import { BulkActionMenuAction } from '@src/app/core/_components/menus/bulk-action-menu/bulk-action-menu.constants';
import { DialogData } from '@src/app/core/_components/tables/table-dialog/table-dialog.model';
import { ExportMenuAction } from '@src/app/core/_components/menus/export-menu/export-menu.constants';
import { RowActionMenuAction } from '@src/app/core/_components/menus/row-action-menu/row-action-menu.constants';
import { TableDialogComponent } from '@src/app/core/_components/tables/table-dialog/table-dialog.component';
import { UsersTableStatus } from '@src/app/core/_components/tables/users-table/users-table.constants';

import { AccessGroupsExpandDataSource } from '@src/app/core/_datasources/access-groups-expand.datasource';

import { SERV } from '@src/app/core/_services/main.config';

import { Cacheable } from '@src/app/core/_decorators/cacheable';

@Component({
    selector: 'access-groups-users-table',
    templateUrl: './access-groups-users-table.component.html',
    standalone: false
})
export class AccessGroupsUserTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  @Input() accessgroupId = 0;

  tableColumns: HTTableColumn[] = [];
  dataSource: AccessGroupsExpandDataSource;
  include = 'userMembers';

  ngOnInit(): void {
    this.setColumnLabels(AccessGroupsUsersTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AccessGroupsExpandDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    if (this.accessgroupId) {
      this.dataSource.setAccessGroupId(this.accessgroupId);
      this.dataSource.setAccessGroupExpand(this.include);
    }
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
        id: AccessGroupsUsersTableCol.ID,
        dataKey: 'id',
        routerLinkNoCache: (user: JUser) => this.renderUserLink(user),
        isSortable: true,
        export: async (user: JUser) => user.id + ''
      },
      {
        id: AccessGroupsUsersTableCol.NAME,
        dataKey: 'name',
        isSortable: true,
        render: (user: JUser) => user.name,
        export: async (user: JUser) => user.name + ''
      },
      {
        id: AccessGroupsUsersTableCol.STATUS,
        dataKey: 'isValid',
        icons: (user: JUser) => this.renderIsValidIcon(user),
        render: (user: JUser) => (user.isValid ? UsersTableStatus.VALID : UsersTableStatus.INVALID),
        isSortable: true,
        export: async (user: JUser) => (user.isValid ? UsersTableStatus.VALID : UsersTableStatus.INVALID)
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
            case BulkActionMenuAction.DELETE:
              this.bulkActionUnassign(result.data);
              break;
          }
        }
      })
    );
  }

  // --- Render functions ---

  @Cacheable(['id', 'isValid'])
  async renderIsValidIcon(user: JUser): Promise<HTTableIcon[]> {
    return user.isValid
      ? [{ name: 'check_circle', cls: 'text-ok' }]
      : [{ name: 'remove_circle', cls: 'text-critical' }];
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<JUser[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<JUser>(
          'hashtopolis-access-groups-users',
          this.tableColumns,
          event.data,
          AccessGroupsUsersTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<JUser>(
          'hashtopolis-access-groups-users',
          this.tableColumns,
          event.data,
          AccessGroupsUsersTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<JUser>(this.tableColumns, event.data, AccessGroupsUsersTableColumnLabel)
          .then(() => {
            this.snackBar.open('The selected rows are copied to the clipboard', 'Close');
          });
        break;
    }
  }

  /**
   * Unassign user from access group
   */
  private bulkActionUnassign(users: JUser[]): void {
    //Get the IDs of users to be deleted
    const usersIdsToDelete = users.map((users) => users.id);
    //Remove the selected users from the list
    const updatedAccessGroups = this.dataSource
      .getData()
      .filter((accessGroup) => !usersIdsToDelete.includes(accessGroup.id));
    //Update the accessGroup with the modified list of pretasks
    const payload = { userMembers: updatedAccessGroups.map((accessGroup) => accessGroup.id) };
    //Update the accessGroup with the new list of pretasks
    const updateRequest = this.gs.update(SERV.ACCESS_GROUPS, this.accessgroupId, payload);
    this.subscriptions.push(
      updateRequest
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open(`Successfully unassigned ${users.length} users!`, 'Close');
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(users: JUser[]): void {
    //Get the IDs of users to be deleted from the access group
    const userIdsToDelete = users.map((users) => users.id);
    //Remove the selected users from the list
    const updatedAccessGroups = this.dataSource
      .getData()
      .filter((accessGroup) => !userIdsToDelete.includes(accessGroup.id));
    //Update the access group with the modified list of users
    const payload = { users: updatedAccessGroups.map((accessGroup) => accessGroup.id) };
    this.subscriptions.push(
      this.gs
        .update(SERV.ACCESS_GROUPS, this.accessgroupId, payload)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open('Successfully deleted users from access group!', 'Close');
          this.reload();
        })
    );
  }
}
