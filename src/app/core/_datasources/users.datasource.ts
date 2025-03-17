import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ResponseWrapper } from '../_models/response.model';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';
import { JUser } from '../_models/user.model';

export class UsersDataSource extends BaseDataSource<JUser> {
  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const params: RequestParams = {
      page: {size: this.pageSize, after: startAt},
      include: ['globalPermissionGroup']
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.sort = [order];
    }

    const users$ = this.service.getAll(SERV.USERS, params);

    this.subscriptions.push(
      users$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {

          const responseBody = { data: response.data, included: response.included };

          const users = this.serializer.deserialize<JUser[]>(responseBody);

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            users.length,
          );
          this.setData(users);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}