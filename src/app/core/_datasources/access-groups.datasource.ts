import { catchError, finalize, of } from 'rxjs';

import { AccessGroup } from '../_models/access-group.model';
import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';

export class AccessGroupsDataSource extends BaseDataSource<AccessGroup> {
  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const params: RequestParams = {
      maxResults: this.pageSize,
      startsAt: startAt
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.ordering = order;
    }

    const accessGroups$ = this.service.getAll(SERV.ACCESS_GROUPS, params);

    this.subscriptions.push(
      accessGroups$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<AccessGroup>) => {
          const accessGroups: AccessGroup[] = response.values;

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            response.total
          );
          this.setData(accessGroups);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
