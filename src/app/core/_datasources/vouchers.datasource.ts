import { zVoucherListResponse } from '@generated/api/zod.gen';
import { catchError, finalize, of } from 'rxjs';

import { Filter } from '@models/request-params.model';

import { BaseDataSource } from '@src/app/core/_datasources/base.datasource';
import { ResponseWrapper } from '@src/app/core/_models/response.model';
import { JVoucher } from '@src/app/core/_models/voucher.model';
import { SERV } from '@src/app/core/_services/main.config';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class VouchersDataSource extends BaseDataSource<JVoucher> {
  loadAll(query?: Filter): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInitial(this);
    if (query) {
      params.addFilter(query);
    }
    const vouchers$ = this.service.getAll(SERV.VOUCHER, params.create());

    this.subscriptions.push(
      vouchers$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const vouchers: JVoucher[] = this.serializer.deserialize(response, zVoucherListResponse);

          const length = response.meta.page.total_elements;
          const nextLink = response.links.next;
          const prevLink = response.links.prev;
          const after = nextLink ? new URL(response.links.next).searchParams.get('page[after]') : null;
          const before = prevLink ? new URL(response.links.prev).searchParams.get('page[before]') : null;

          this.setPaginationConfig(this.pageSize, length, after, before, this.index);
          this.setData(vouchers);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
