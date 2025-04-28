import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';
import { Voucher } from '../_models/voucher.model';

export class VouchersDataSource extends BaseDataSource<Voucher> {
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

    const vouchers$ = this.service.getAll(SERV.VOUCHER, params);

    this.subscriptions.push(
      vouchers$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<Voucher>) => {
          const vouchers: Voucher[] = response.values;

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            response.total
          );
          this.setData(vouchers);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
