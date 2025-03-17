import { catchError, finalize, of } from 'rxjs';

import { AccessGroupData } from '../_models/access-group.model';
import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';

export class AccessGroupsDataSource extends BaseDataSource<AccessGroupData> {
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
        .subscribe((response: ListResponseWrapper<AccessGroupData>) => {

          let accessgroups: AccessGroupData[] = [];

          response.data.forEach((value: AccessGroupData) => {
            const accessgroup: AccessGroupData = value;

            accessgroup.attributes.agentMembers = value.relationships.agentMembers.data.length;
            accessgroup.attributes.userMembers = value.relationships.userMembers.data.length;

            accessgroups.push(accessgroup);
          });

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            response.total
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
