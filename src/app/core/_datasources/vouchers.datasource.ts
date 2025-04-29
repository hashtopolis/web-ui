import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from '@src/app/core/_datasources/base.datasource';
import { ResponseWrapper } from '@src/app/core/_models/response.model';
import { JVoucher } from '@src/app/core/_models/voucher.model';
import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';
import { SERV } from '@src/app/core/_services/main.config';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class VouchersDataSource extends BaseDataSource<JVoucher> {
  loadAll(): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInitial(this).create();
    const vouchers$ = this.service.getAll(SERV.VOUCHER, params);

    this.subscriptions.push(
      vouchers$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const vouchers: JVoucher[] = new JsonAPISerializer().deserialize({
            data: response.data,
            included: response.included
          });

          this.setPaginationConfig(this.pageSize, this.currentPage, vouchers.length);
          this.setData(vouchers);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
