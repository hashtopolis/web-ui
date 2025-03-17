import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { JHash } from '../_models/hash.model';
import { JsonAPISerializer } from '../_services/api/serializer-service';
import { ResponseWrapper } from '../_models/response.model';
import { HashData } from '../_models/hash.model';
import { Included, ListResponseWrapper } from '../_models/response.model';
import { Filter, RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';

export class CracksDataSource extends BaseDataSource<JHash> {
  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const params: RequestParams = {
      page: {
        size: this.pageSize,
        after: startAt
      },
      filter: new Array<Filter>({field: "isCracked", operator: "eq", value: true}),
      include: ['hashlist','chunk']
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.sort = [order];
    }

    const cracks$ = this.service.getAll(SERV.HASHES, params);

    this.subscriptions.push(
      cracks$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const serializer = new JsonAPISerializer();
          const responseData = { data: response.data, included: response.included };
          const crackedHashes = serializer.deserialize<JHash[]>(responseData);
          const rows: JHash[] = [];
          crackedHashes.forEach((crackedHash) => {
            rows.push(crackedHash);
          });

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            crackedHashes.length
          );
          this.setData(rows);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
