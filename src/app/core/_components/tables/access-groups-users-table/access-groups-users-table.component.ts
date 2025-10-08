import { catchError } from 'rxjs/operators';

import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { JPretask } from '@models/pretask.model';
import { JUser } from '@models/user.model';

import { AccessGroupsUserContextMenuService } from '@services/context-menu/users/access-groups-user-menu.service';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import {
  AccessGroupsUsersTableCol,
  AccessGroupsUsersTableColumnLabel
} from '@components/tables/access-groups-users-table/access-groups-users-table.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { UsersTableStatus } from '@components/tables/users-table/users-table.constants';

import { AccessGroupsExpandDataSource } from '@datasources/access-groups-expand.datasource';

import { BulkActionMenuAction } from '@src/app/core/_components/menus/bulk-action-menu/bulk-action-menu.constants';
import { TableDialogComponent } from '@src/app/core/_components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@src/app/core/_components/tables/table-dialog/table-dialog.model';
import { RelationshipType, SERV } from '@src/app/core/_services/main.config';

@Component({
  selector: 'access-groups-users-table',
  templateUrl: './access-groups-users-table.component.html',
  standalone: false
})
export class AccessGroupsUserTableComponent extends BaseTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() accessgroupId = 0;
  @Output() usersRemoved = new EventEmitter<void>(); // Event to notify parent about removed user(s)

  tableColumns: HTTableColumn[] = [];
  dataSource: AccessGroupsExpandDataSource;
  include = 'userMembers';

  ngOnInit(): void {
    this.setColumnLabels(AccessGroupsUsersTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AccessGroupsExpandDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
    if (this.accessgroupId) {
      this.dataSource.setAccessGroupId(this.accessgroupId);
      this.dataSource.setAccessGroupExpand(this.include);
    }
    this.contextMenuService = new AccessGroupsUserContextMenuService(this.permissionService).addContextMenu();
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
        id: AccessGroupsUsersTableCol.ID,
        dataKey: 'id',
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
        icon: (user: JUser) => this.renderIsValidIcon(user),
        render: (user: JUser) => (user.isValid ? UsersTableStatus.VALID : UsersTableStatus.INVALID),
        isSortable: true,
        export: async (user: JUser) => (user.isValid ? UsersTableStatus.VALID : UsersTableStatus.INVALID)
      }
    ];
  }

  // --- Add bulk action handler ---
  bulkActionClicked(event: ActionMenuEvent<JUser[]>): void {
    const dialogData: DialogData<JUser> = {
      rows: event.data,
      title: `Remove ${event.data.length} user${event.data.length > 1 ? 's' : ''} ...`,
      icon: 'warning',
      body: `Are you sure you want to remove the above user${event.data.length > 1 ? 's' : ''} from the access group?`,
      warn: true,
      listAttribute: 'name',
      action: BulkActionMenuAction.DELETE
    };

    this.openDialog(dialogData);
  }

  openDialog(data: DialogData<JUser>) {
    const dialogRef = this.dialog.open(TableDialogComponent, {
      data: data,
      width: '450px'
    });

    this.subscriptions.push(
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.action) {
          this.bulkActionUnassign(result.data);
        }
      })
    );
  }

  /**
   * Remove Users from access group
   * @param users Users to remove
   * @private
   */
  private bulkActionUnassign(users: JUser[]): void {
    const userIdsToDelete = users.map((user) => user.id);
    const payload = {
      data: userIdsToDelete.map((id) => {
        return { type: RelationshipType.USERMEMBERS, id: id };
      })
    };

    const removeRequest = this.gs.deleteRelationships(
      SERV.ACCESS_GROUPS,
      this.accessgroupId,
      RelationshipType.USERMEMBERS,
      payload
    );

    this.subscriptions.push(
      removeRequest
        .pipe(
          catchError((error) => {
            const msg = 'Error while removing user from access group';
            console.error(`${msg}: `, error);
            this.alertService.showErrorMessage(error.message);
            return [];
          })
        )
        .subscribe(() => {
          this.usersRemoved.emit();
          this.alertService.showSuccessMessage(
            `Successfully removed ${users.length} user${users.length > 1 ? 's' : ''}`
          );
          this.reload();
        })
    );
  }

  rowActionClicked(event: ActionMenuEvent<JUser>): void {
    if (event.menuItem.action === RowActionMenuAction.DELETE) {
      this.openDialog({
        rows: [event.data],
        title: `Remove user from access group`,
        icon: 'warning',
        body: `Are you sure you want to remove "${event.data.name}" from this access group?`,
        warn: true,
        action: event.menuItem.action
      });
    }
  }

  // --- Existing export action ---
  exportActionClicked(event: ActionMenuEvent<JUser[]>): void {
    this.exportService.handleExportAction<JUser>(
      event,
      this.tableColumns,
      AccessGroupsUsersTableColumnLabel,
      'hashtopolis-access-groups-users'
    );
  }
}
