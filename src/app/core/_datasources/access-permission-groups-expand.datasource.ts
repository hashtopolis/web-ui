import { catchError, finalize, of } from 'rxjs';

import { AccessGroup } from '@models/access-group.model';
import { JGlobalPermissionGroup } from '@models/global-permission-group.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class AccessPermissionGroupsExpandDataSource extends BaseDataSource<AccessGroup> {
  private _accesspermgroupId = 0;
  private _expand = '';
  private _perm = 0;

  setAccessPermGroupId(accesspermgroupId: number) {
    this._accesspermgroupId = accesspermgroupId;
  }

  setAccessPermGroupExpand(_expand: string) {
    this._expand = _expand;
  }

  setPermissions(_perm: number) {
    this._perm = _perm;
  }

  loadAll(): void {
    this.loading = true;

    const params = new RequestParamBuilder().addInclude(this._expand).create();
    const accessPermissions$ = this.service.get(SERV.ACCESS_PERMISSIONS_GROUPS, this._accesspermgroupId, params);

    this.subscriptions.push(
      accessPermissions$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const globalPermissionGroup = new JsonAPISerializer().deserialize<JGlobalPermissionGroup>(response);
          let data: any[];
          if (this._perm) {
            data = this.processPermissions(globalPermissionGroup);
          } else {
            data = response[this._expand];
          }
          this.setData(data);
        })
    );
  }

  getData(): AccessGroup[] {
    return this.getOriginalData();
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }

  private processPermissions(globalPermissionGroup: JGlobalPermissionGroup): any[] {
    return Object.entries(globalPermissionGroup.permissions).reduce((acc, [key, value]) => {
      const operation = key.replace(/^perm/, '').replace(/(Create|Delete|Read|Update)$/, '');
      let operationName = operation.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
      operationName = operationName.charAt(0).toUpperCase() + operationName.slice(1);
      const type = key.match(/(Create|Delete|Read|Update)$/)?.[0];
      const existingPermission = acc.find((item) => item.name === operationName && item.key === operation);
      if (existingPermission) {
        existingPermission[type.toLowerCase()] = value;
      } else {
        const newPermission = {
          name: operationName,
          key: operation,
          originalName: 'perm' + operation,
          [type ? type.toLowerCase() : '']: value
        };
        acc.push(newPermission);
      }
      return acc;
    }, []);
  }
}
