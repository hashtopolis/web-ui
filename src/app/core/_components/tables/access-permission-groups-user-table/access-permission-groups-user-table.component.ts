import { catchError } from 'rxjs';
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { UserPermissions } from '@src/app/core/_models/user-permissions.model';

import {
  APGUTableEditableAction,
  AccessPermissionGroupsUserTableCol,
  AccessPermissionGroupsUserTableColumnLabel
} from '@src/app/core/_components/tables/access-permission-groups-user-table/access-permission-groups-user-table.constants';

import { ActionMenuEvent } from '@src/app/core/_components/menus/action-menu/action-menu.model';
import { BaseTableComponent } from '@src/app/core/_components/tables/base-table/base-table.component';
import { ExportMenuAction } from '@src/app/core/_components/menus/export-menu/export-menu.constants';
import { HTTableColumn } from '@src/app/core/_components/tables/ht-table/ht-table.models';

import { SERV } from '@src/app/core/_services/main.config';

import { AccessPermissionGroupsExpandDataSource } from '@src/app/core/_datasources/access-permission-groups-expand.datasource';

@Component({
  selector: 'access-permission-groups-user-table',
  templateUrl: './access-permission-groups-user-table.component.html'
})
export class AccessPermissionGroupsUserTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  @Input() accesspermgroupId = 0;

  tableColumns: HTTableColumn[] = [];
  dataSource: AccessPermissionGroupsExpandDataSource;
  expand = 'userMembers';
  permissions = 1;

  ngOnInit(): void {
    this.setColumnLabels(AccessPermissionGroupsUserTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AccessPermissionGroupsExpandDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    if (this.accesspermgroupId) {
      this.dataSource.setAccessPermGroupId(this.accesspermgroupId);
      this.dataSource.setAccessPermGroupExpand(this.expand);
      this.dataSource.setPermissions(this.permissions);
    }
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: UserPermissions, filterValue: string): boolean {
    return item.name.toLowerCase().includes(filterValue);
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: AccessPermissionGroupsUserTableCol.NAME,
        dataKey: 'name',
        isSortable: true,
        export: async (perm: UserPermissions) => perm.name + ''
      },
      {
        id: AccessPermissionGroupsUserTableCol.CREATE,
        dataKey: 'create',
        isSortable: true,
        checkbox: (perm: UserPermissions) => {
          return {
            data: perm,
            value: perm.create + '',
            action: APGUTableEditableAction.CHANGE_CREATE_PERMISSION
          };
        },
        export: async (perm: UserPermissions) => perm.create + ''
      },
      {
        id: AccessPermissionGroupsUserTableCol.READ,
        dataKey: 'read',
        isSortable: true,
        checkbox: (perm: UserPermissions) => {
          return {
            data: perm,
            value: perm.read + '',
            action: APGUTableEditableAction.CHANGE_READ_PERMISSION
          };
        },
        export: async (perm: UserPermissions) => perm.read + ''
      },
      {
        id: AccessPermissionGroupsUserTableCol.UPDATE,
        dataKey: 'update',
        isSortable: true,
        checkbox: (perm: UserPermissions) => {
          return {
            data: perm,
            value: perm.update + '',
            action: APGUTableEditableAction.CHANGE_UPDATE_PERMISSION
          };
        },
        export: async (perm: UserPermissions) => perm.update + ''
      },
      {
        id: AccessPermissionGroupsUserTableCol.DELETE,
        dataKey: 'delete',
        isSortable: true,
        checkbox: (perm: UserPermissions) => {
          return {
            data: perm,
            value: perm.delete + '',
            action: APGUTableEditableAction.CHANGE_DELETE_PERMISSION
          };
        },
        export: async (perm: UserPermissions) => perm.delete + ''
      }
    ];
  }

  // --- Action functions ---
  exportActionClicked(event: ActionMenuEvent<UserPermissions[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<UserPermissions>(
          'hashtopolis-access-permission-groups-user',
          this.tableColumns,
          event.data,
          AccessPermissionGroupsUserTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<UserPermissions>(
          'hashtopolis-access-permission-groups-user',
          this.tableColumns,
          event.data,
          AccessPermissionGroupsUserTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<UserPermissions>(this.tableColumns, event.data, AccessPermissionGroupsUserTableColumnLabel)
          .then(() => {
            this.snackBar.open('The selected rows are copied to the clipboard', 'Close');
          });
        break;
    }
  }

  editableCheckSaved(editable: any): void {
    switch (editable.action) {
      case APGUTableEditableAction.CHANGE_CREATE_PERMISSION:
        this.changePermision(editable, editable.value);
        break;
      case APGUTableEditableAction.CHANGE_READ_PERMISSION:
        this.changePermision(editable, editable.value);
        break;
      case APGUTableEditableAction.CHANGE_UPDATE_PERMISSION:
        this.changePermision(editable, editable.value);
        break;
      case APGUTableEditableAction.CHANGE_DELETE_PERMISSION:
        this.changePermision(editable, editable.value);
        break;
    }
  }

  /**
   * Updates the permission for a specific user permission.
   *
   * @param {UserPermissions} userperm - The user permissions object.
   * @param {string} value - The new value for the permission (as a string).
   */
  private changePermision(userperm: UserPermissions, value: string): void {
    const capitalizedPerm = (userperm['action'].match(/-(.*?)-/)?.[1] || '')
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());
    const keyPerm = userperm['data']['originalName'] + capitalizedPerm;
    const boolValue = value === 'true' ? true : value === 'false' ? false : Boolean(value);
    // Payload
    const payload = {
      permissions: { [keyPerm]: boolValue }
    };

    const request$ = this.gs.update(SERV.ACCESS_PERMISSIONS_GROUPS, this.accesspermgroupId, payload);
    this.subscriptions.push(
      request$
        .pipe(
          catchError((error) => {
            this.snackBar.open(`Failed to update permission!`, 'Close');
            console.error('Failed to update permission:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open(
            `Changed permistion in ${capitalizedPerm} on Permission Group #${this.accesspermgroupId}!`,
            'Close'
          );
          this.reload();
        })
    );
  }
}
