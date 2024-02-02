import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { GlobalPermissionGroup } from '../_models/global-permission-group.model';
import { ListResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';

export class PermissionsDataSource extends BaseDataSource<GlobalPermissionGroup> {
  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const params = {
      maxResults: this.pageSize,
      startsAt: startAt,
      expand: 'user'
    };

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
        .subscribe((response: ListResponseWrapper<GlobalPermissionGroup>) => {
          const permissions: GlobalPermissionGroup[] = response.values;

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
