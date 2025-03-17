import { catchError, finalize, of } from 'rxjs';

import { JAccessGroup } from '../_models/access-group.model';
import { BaseDataSource } from './base.datasource';
import { ResponseWrapper } from '../_models/response.model';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';

export class AccessGroupsDataSource extends BaseDataSource<JAccessGroup> {
  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const params: RequestParams = {
      page: {
        size: this.pageSize,
        after: startAt
      },
      include: ['userMembers','agentMembers']
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.sort = [order];
    }

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

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            accessgroups.length
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
