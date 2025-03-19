import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { JGlobalPermissionGroup } from '../_models/global-permission-group.model';
import { ResponseWrapper } from '../_models/response.model';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';

export class PermissionsDataSource extends BaseDataSource<JGlobalPermissionGroup> {
  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const params: RequestParams = {
      page: {
        size: this.pageSize,
        after: startAt
      },
      include: ['userMembers']
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.include = [order];
    }

    const permissions$ = this.service.getAll(
      SERV.ACCESS_PERMISSIONS_GROUPS,
      params
    );

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
