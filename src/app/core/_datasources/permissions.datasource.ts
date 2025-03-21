import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { JGlobalPermissionGroup } from '../_models/global-permission-group.model';
import { ResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class PermissionsDataSource extends BaseDataSource<JGlobalPermissionGroup> {
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
        .subscribe((response: ResponseWrapper) => {

          const responseBody = { data: response.data, included: response.included };
          const globalPermissionGroups = this.serializer.deserialize<JGlobalPermissionGroup[]>(responseBody);

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            globalPermissionGroups.length
          );
          this.setData(globalPermissionGroups);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
