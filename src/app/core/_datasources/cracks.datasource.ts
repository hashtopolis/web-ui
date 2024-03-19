import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { Hash } from '../_models/hash.model';
import { ListResponseWrapper } from '../_models/response.model';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';

export class CracksDataSource extends BaseDataSource<Hash> {
  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const params: RequestParams = {
      maxResults: this.pageSize,
      startsAt: startAt,
      filter: 'isCracked=1',
      expand: 'hashlist,chunk'
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.ordering = order;
    }

    const cracks$ = this.service.getAll(SERV.HASHES, params);

    this.subscriptions.push(
      cracks$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<Hash>) => {
          const cracks: Hash[] = response.values;

          cracks.map((crack: Hash) => {
            if (crack.chunk) {
              crack.agentId = crack.chunk.agentId;
              crack.taskId = crack.chunk.taskId;
            }
          });

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            response.total
          );
          this.setData(cracks);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
