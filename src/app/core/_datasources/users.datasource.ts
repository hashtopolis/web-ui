import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { Filter } from '@models/request-params.model';
import { JUser } from '../_models/user.model';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';
import { ResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';

export class UsersDataSource extends BaseDataSource<JUser> {
  loadAll(query?: Filter): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInitial(this).addInclude('globalPermissionGroup');
    if (query) {
      params.addFilter(query);
    }
    const users$ = this.service.getAll(SERV.USERS, params.create());

    this.subscriptions.push(
      users$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const responseBody = { data: response.data, included: response.included };

          const users = this.serializer.deserialize<JUser[]>(responseBody);

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
          this.setData(users);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
