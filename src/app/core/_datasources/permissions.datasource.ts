import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { Filter } from '@models/request-params.model';
import { JGlobalPermissionGroup } from '../_models/global-permission-group.model';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';
import { ResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';

export class PermissionsDataSource extends BaseDataSource<JGlobalPermissionGroup> {
  loadAll(query?: Filter): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInitial(this).addInclude('userMembers');
    if (query) {
      params.addFilter(query);
    }
    const permissions$ = this.service.getAll(SERV.ACCESS_PERMISSIONS_GROUPS, params.create());

    this.subscriptions.push(
      permissions$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const responseBody = { data: response.data, included: response.included };
          const globalPermissionGroups = this.serializer.deserialize<JGlobalPermissionGroup[]>(responseBody);

          const length = response.meta.page.total_elements;
          const nextLink = response.links.next;
          const prevLink = response.links.prev;
          const after = nextLink ? new URL(response.links.next).searchParams.get("page[after]") : null;
          const before = prevLink ? new URL(response.links.prev).searchParams.get("page[before]") : null;

          this.setPaginationConfig(
            this.pageSize,
            length,
            after,
            before,
            this.index
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
