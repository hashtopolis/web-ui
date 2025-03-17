import { catchError, forkJoin } from 'rxjs';

/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  HTTableColumn,
  HTTableEditable,
  HTTableIcon,
  HTTableRouterLink
} from '../ht-table/ht-table.models';
import {
  AccessGroupsUsersTableCol,
  AccessGroupsUsersTableColumnLabel
} from './access-groups-users-table.constants';


import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { AccessGroupsExpandDataSource } from 'src/app/core/_datasources/access-groups-expand.datasource';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { Cacheable } from 'src/app/core/_decorators/cacheable';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { Pretask } from 'src/app/core/_models/pretask.model';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SafeHtml } from '@angular/platform-browser';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { JUser } from 'src/app/core/_models/user.model';
import { UsersTableStatus } from '../users-table/users-table.constants';

@Component({
  selector: 'access-groups-users-table',
  templateUrl: './access-groups-users-table.component.html'
})
export class AccessGroupsUserTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  @Input() accessgroupId = 0;

  tableColumns: HTTableColumn[] = [];
  dataSource: AccessGroupsExpandDataSource;
  expand = 'userMembers';

  ngOnInit(): void {
    this.setColumnLabels(AccessGroupsUsersTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AccessGroupsExpandDataSource(
      this.cdr,
      this.gs,
      this.uiService
    );
    this.dataSource.setColumns(this.tableColumns);
    if (this.accessgroupId) {
      this.dataSource.setAccessGroupId(this.accessgroupId);
      this.dataSource.setAccessGroupExpand(this.expand);
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
        id: AccessGroupsUsersTableCol.ID,
        dataKey: '_id',
        routerLink: (user: JUser) => this.renderUserLink(user),
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
        render: (user: JUser) =>
          user.isValid ? UsersTableStatus.VALID : UsersTableStatus.INVALID,
        isSortable: true,
        export: async (user: JUser) =>
          user.isValid ? UsersTableStatus.VALID : UsersTableStatus.INVALID
      }
    ];
    return tableColumns;
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

  @Cacheable(['_id', 'isValid'])
  async renderIsValidIcon(user: JUser): Promise<HTTableIcon[]> {
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
          .toClipboard<JUser>(
            this.tableColumns,
            event.data,
            AccessGroupsUsersTableColumnLabel
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

  rowActionClicked(event: ActionMenuEvent<JUser>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.EDIT:
        this.rowActionEdit(event.data);
        break;
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting User Access Group ${event.data.name} ...`,
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
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} access group user ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above pretasks? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'supertaskName',
          action: event.menuItem.action
        });
        break;
    }
  }

  /**
   * Unasssign Users
   */
  private bulkActionUnassign(users: JUser[]): void {
    //Get the IDs of pretasks to be deleted
    const usersIdsToDelete = users.map((users) => users.id);
    //Remove the selected pretasks from the list
    const updatedPretasks = this.dataSource
      .getData()
      .filter((users) => !usersIdsToDelete.includes(users._id));
    //Update the supertask with the modified list of pretasks
    const payload = { userMembers: updatedPretasks.map((users) => users._id) };
    //Update the supertask with the new list of pretasks
    const updateRequest = this.gs.update(
      SERV.ACCESS_GROUPS,
      this.accessgroupId,
      payload
    );
    this.subscriptions.push(
      updateRequest
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open(
            `Successfully unassigned ${users.length} users!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(users: JUser[]): void {
    //Get the IDs of pretasks to be deleted
    const pretaskIdsToDelete = users.map((users) => users.id);
    //Remove the selected pretasks from the list
    const updatedPretasks = this.dataSource
      .getData()
      .filter((users) => !pretaskIdsToDelete.includes(users._id));
    //Update the supertask with the modified list of pretasks
    const payload = { users: updatedPretasks.map((users) => users._id) };
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
          this.snackBar.open('Successfully deleted pretasks!', 'Close');
          this.reload();
        })
    );
  }

  private rowActionEdit(user: JUser): void {
    this.renderUserLink(user).then((links: HTTableRouterLink[]) => {
      this.router.navigate(links[0].routerLink);
    });
  }
}
