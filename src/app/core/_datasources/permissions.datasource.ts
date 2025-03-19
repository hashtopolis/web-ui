import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { GlobalPermissionGroupData } from '../_models/global-permission-group.model';
import { ListResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';
import { UserData } from '../_models/user.model';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class PermissionsDataSource extends BaseDataSource<GlobalPermissionGroupData> {
  loadAll(): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInitial(this).addInclude('userMembers').create();
    const permissions$ = this.service.getAll(SERV.ACCESS_PERMISSIONS_GROUPS, params);

    this.subscriptions.push(
      permissions$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<GlobalPermissionGroupData>) => {
          const permissions: GlobalPermissionGroupData[] = [];

          response.data.forEach((value: GlobalPermissionGroupData) => {
            const permission: GlobalPermissionGroupData = value;

            let globalPermissionGroupId: number = value.id;
            let includedUser: object[] = response.included.filter((inc) => inc.type === 'user');

            permission.attributes.userCount = (includedUser as UserData[]).filter((incUser: UserData) => incUser.attributes.globalPermissionGroupId === globalPermissionGroupId).length;

            permissions.push(permission);
          });

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            response.total
          );
          this.setData(permissions);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
