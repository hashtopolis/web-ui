import { catchError } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';

import { DynamicModel } from '@models/base.model';
import { UserPermissions } from '@models/global-permission-group.model';
import { JUser } from '@models/user.model';

import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
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
export class AccessPermissionGroupsUserTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @Input() accesspermgroupId = 0;

  private http = inject(HttpClient);

  tableColumns: HTTableColumn[] = [];
  dataSource: AccessPermissionGroupsExpandDataSource;
  expand = 'userMembers';
  permissions = 1;

  ngOnInit(): void {
    this.setColumnLabels(AccessPermissionGroupsUserTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AccessPermissionGroupsExpandDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
    if (this.accesspermgroupId) {
      this.dataSource.setAccessPermGroupId(this.accesspermgroupId);
      this.dataSource.setAccessPermGroupExpand(this.expand);
      this.dataSource.setPermissions(this.permissions);
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
  exportActionClicked(event: ActionMenuEvent<(JUser | UserPermissions)[]>): void {
    this.exportService.handleExportAction<UserPermissions>(
      event as ActionMenuEvent<UserPermissions[]>,
      this.tableColumns,
      AccessPermissionGroupsUserTableColumnLabel,
      'hashtopolis-access-permission-groups-user'
    );
  }

  /**
   * Update Permissions on checkbox change event
   * @param editable Editable object containing current permission, action and changed value
   */
  onCheckboxChange(editable: HTTableEditable<JUser | UserPermissions>): void {
    this.changePermision(editable as HTTableEditable<UserPermissions>, editable.value);
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
    const keyPerm = 'perm' + String((editable.data as unknown as DynamicModel)['key']) + capitalizedPerm;
    const boolValue = value === 'true' ? true : value === 'false' ? false : Boolean(value);

    // Build the full permissions object from current datasource state, then apply the change
    const allPermissions: Record<string, boolean> = {};
    (this.dataSource.currentData as UserPermissions[]).forEach((perm) => {
      allPermissions[`perm${perm.key}Create`] = perm.create;
      allPermissions[`perm${perm.key}Read`] = perm.read;
      allPermissions[`perm${perm.key}Update`] = perm.update;
      allPermissions[`perm${perm.key}Delete`] = perm.delete;
    });
    allPermissions[keyPerm] = boolValue;

    this.patchPermissions(
      allPermissions,
      `Changed permission in ${capitalizedPerm} on Permission Group #${this.accesspermgroupId}!`
    );
  }

  /**
   * Grants or revokes all 4 permissions (create/read/update/delete) for a single resource row.
   * Direction is derived from the row's current data: if any permission is already true,
   * revoke all; otherwise grant all. This avoids relying on the selection checkbox state
   * which resets to unchecked after every reload.
   */
  onRowToggled(event: { row: JUser | UserPermissions; checked: boolean }): void {
    const perm = event.row as UserPermissions;
    if (!('key' in perm) || !perm.key) return;

    const allGranted = perm.create && perm.read && perm.update && perm.delete;
    const newValue = !allGranted;

    const allPermissions: Record<string, boolean> = {};
    (this.dataSource.currentData as UserPermissions[]).forEach((p) => {
      allPermissions[`perm${p.key}Create`] = p.create;
      allPermissions[`perm${p.key}Read`] = p.read;
      allPermissions[`perm${p.key}Update`] = p.update;
      allPermissions[`perm${p.key}Delete`] = p.delete;
    });
    allPermissions[`perm${perm.key}Create`] = newValue;
    allPermissions[`perm${perm.key}Read`] = newValue;
    allPermissions[`perm${perm.key}Update`] = newValue;
    allPermissions[`perm${perm.key}Delete`] = newValue;

    const label = newValue
      ? `Granted all permissions for ${perm.name} on Permission Group #${this.accesspermgroupId}`
      : `Revoked all permissions for ${perm.name} on Permission Group #${this.accesspermgroupId}`;
    this.patchPermissions(allPermissions, label);
  }

  /**
   * Grants or revokes all permissions for all resources at once.
   * Direction is determined by the current data: if more than half the individual
   * permission booleans are already true, the next click revokes; otherwise it grants.
   * This correctly handles server-enforced always-false permissions (e.g. AgentError Create/Update)
   * that prevent a strict "all === true" check from ever being satisfied.
   */
  onAllPermissionsToggled(): void {
    const currentPerms = this.dataSource.currentData as UserPermissions[];
    if (currentPerms.length === 0) return;

    const totalPerms = currentPerms.length * 4;
    const grantedCount = currentPerms.reduce(
      (count, p) => count + (p.create ? 1 : 0) + (p.read ? 1 : 0) + (p.update ? 1 : 0) + (p.delete ? 1 : 0),
      0
    );
    const newValue = grantedCount / totalPerms <= 0.5; // grant when ≤50% granted, revoke when >50%

    const allPermissions: Record<string, boolean> = {};
    currentPerms.forEach((perm) => {
      allPermissions[`perm${perm.key}Create`] = newValue;
      allPermissions[`perm${perm.key}Read`] = newValue;
      allPermissions[`perm${perm.key}Update`] = newValue;
      allPermissions[`perm${perm.key}Delete`] = newValue;
    });
    const label = newValue
      ? `Granted all permissions on Permission Group #${this.accesspermgroupId}`
      : `Revoked all permissions on Permission Group #${this.accesspermgroupId}`;
    this.patchPermissions(allPermissions, label);
  }

  /**
   * Sends a PATCH to update the global permission group's permissions object.
   * Uses a direct HTTP call with the exact JSON:API type the server expects.
   */
  private patchPermissions(permissions: Record<string, boolean>, successMessage: string): void {
    const url = `${this.cs.getEndpoint()}${SERV.ACCESS_PERMISSIONS_GROUPS.URL}/${this.accesspermgroupId}`;
    const body = {
      data: {
        type: 'globalPermissionGroup',
        id: this.accesspermgroupId,
        attributes: { permissions }
      }
    };
    this.subscriptions.push(
      this.http
        .patch(url, body)
        .pipe(
          catchError((error) => {
            this.alertService.showErrorMessage(`Failed to update permissions!`);
            console.error('Failed to update permissions:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage(successMessage);
          this.reload();
        })
    );
  }
}
