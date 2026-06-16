import { zGlobalPermissionGroupResponse } from '@generated/api/zod';
import { EMPTY, catchError, finalize } from 'rxjs';

import { Permission } from '@models/global-permission-group.model';
import { ResponseWrapper } from '@models/response.model';
import { JUser } from '@models/user.model';

import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

import { PermissionMatrixRow, buildPermissionMatrix } from '@src/app/shared/utils/permission-matrix';

export class AccessPermissionGroupsExpandDataSource extends BaseDataSource<JUser | PermissionMatrixRow> {
  private _accesspermgroupId = 0;
  private _expand = '';
  private _perm = 0;

  setAccessPermGroupId(accesspermgroupId: number) {
    this._accesspermgroupId = accesspermgroupId;
  }

  setAccessPermGroupExpand(expand: string) {
    this._expand = expand;
  }

  setPermissions(perm: number) {
    this._perm = perm;
  }

  loadAll(): void {
    this.loading = true;

    const params = new RequestParamBuilder().addInclude(this._expand).create();
    const accessPermissions$ = this.service.get(SERV.ACCESS_PERMISSIONS_GROUPS, this._accesspermgroupId, params);

    this.subscriptions.push(
      accessPermissions$
        .pipe(
          catchError(() => EMPTY),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const globalPermissionGroup = this.serializer.deserialize(response, zGlobalPermissionGroupResponse, {
            include: ['userMembers'] as const
          });
          const data: (PermissionMatrixRow | JUser)[] = this._perm
            ? buildPermissionMatrix(globalPermissionGroup.permissions)
            : globalPermissionGroup.userMembers;
          this.setData(data);
        })
    );
  }

  /**
   * Populate the table synchronously from a flat permission map (no API call).
   * Used by form-mode consumers (e.g. the API-key creation form) where the
   * matrix is driven by the current user's `granted` map rather than a
   * persisted permission group.
   */
  loadFromMap(permissions: Permission): void {
    this.loading = false;
    this.setData(buildPermissionMatrix(permissions));
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
