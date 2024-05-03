import { catchError, finalize, of } from 'rxjs';

import { AccessGroup } from '../_models/access-group.model';
import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { SERV } from '../_services/main.config';

export class AccessPermissionGroupsExpandDataSource extends BaseDataSource<
  AccessGroup,
  MatTableDataSourcePaginator
> {
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

    const params = {
      expand: this._expand
    };

    const accessPermissions$ = this.service.get(
      SERV.ACCESS_PERMISSIONS_GROUPS,
      this._accesspermgroupId,
      params
    );

    this.subscriptions.push(
      accessPermissions$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<AccessGroup>) => {
          let data: any[];
          if (this._perm) {
            data = this.processResponseWithPermissions(response['permissions']);
          } else {
            data = response[this._expand];
          }
          this.setData(data);
        })
    );
  }

  private processResponseWithPermissions(
    response: ListResponseWrapper<any>
  ): any[] {
    const transformedData = Object.entries(response).reduce(
      (acc, [key, value]) => {
        const operation = key
          .replace(/^perm/, '')
          .replace(/(Create|Delete|Read|Update)$/, '');
        let operationName = operation
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .toLowerCase();
        operationName =
          operationName.charAt(0).toUpperCase() + operationName.slice(1);
        const type = key.match(/(Create|Delete|Read|Update)$/)?.[0];
        const existingPermission = acc.find(
          (item) => item.name === operationName && item.key === operation
        );
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
      },
      []
    );
    return transformedData;
  }

  getData(): AccessGroup[] {
    return this.getOriginalData();
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
