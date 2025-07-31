import { catchError, finalize, of } from 'rxjs';

import { JAccessGroup } from '../_models/access-group.model';
import { BaseDataSource } from './base.datasource';
import { ResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class AccessGroupsDataSource extends BaseDataSource<JAccessGroup> {
  loadAll(): void {
    this.loading = true;

    const params = new RequestParamBuilder().addInitial(this).addInclude('userMembers').addInclude('agentMembers').create();

    const accessGroups$ = this.service.getAll(SERV.ACCESS_GROUPS, params);

    this.subscriptions.push(
      accessGroups$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {

          const responseBody = { data: response.data, included: response.included };

          const accessgroups = this.serializer.deserialize<JAccessGroup[]>(responseBody);

          const length = response.meta.page.total_elements;
          const nextLink = response.links.next;
          const prevLink = response.links.prev;
          const after = nextLink ? new URL(nextLink).searchParams.get("page[after]") : null;
          const before = prevLink ? new URL(prevLink).searchParams.get("page[before]") : null;

          this.setPaginationConfig(
            this.pageSize,
            length,
            after,
            before,
            this.index
          );
          this.setData(accessgroups);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
