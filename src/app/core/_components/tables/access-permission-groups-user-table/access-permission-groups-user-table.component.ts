import { catchError } from 'rxjs';

/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { UserPermissions } from '@models/global-permission-group.model';

import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { ExportMenuAction } from '@components/menus/export-menu/export-menu.constants';
import {
  APGUTableEditableAction,
  AccessPermissionGroupsUserTableCol,
  AccessPermissionGroupsUserTableColumnLabel
} from '@components/tables/access-permission-groups-user-table/access-permission-groups-user-table.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { HTTableColumn, HTTableEditable } from '@components/tables/ht-table/ht-table.models';

import { AccessPermissionGroupsExpandDataSource } from '@datasources/access-permission-groups-expand.datasource';

@Component({
  selector: 'access-permission-groups-user-table',
  templateUrl: './access-permission-groups-user-table.component.html',
  standalone: false
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
        void this.exportService.toExcel<UserPermissions>(
          'hashtopolis-access-permission-groups-user',
          this.tableColumns,
          event.data,
          AccessPermissionGroupsUserTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        void this.exportService.toCsv<UserPermissions>(
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

  /**
   * Update Permissions on checkbox change event
   * @param editable Editable object containing current permission, action and changed value
   */
  onCheckboxChange(editable: HTTableEditable<UserPermissions>): void {
    this.changePermision(editable, editable.value);
  }

  /**
   * Updates the permission for a specific user permission.
   * @param editable Editable object containing current permission, action and changed value.
   * @param value The new value for the permission (as a string).
   */
  private changePermision(editable: HTTableEditable<UserPermissions>, value: string): void {
    const capitalizedPerm = (editable['action'].match(/-(.*?)-/)?.[1] || '')
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());
    const keyPerm = editable['data']['originalName'] + capitalizedPerm;
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
