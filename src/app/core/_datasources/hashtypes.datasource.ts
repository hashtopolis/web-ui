import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { JHashtype } from '../_models/hashtype.model';
import { ResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class HashtypesDataSource extends BaseDataSource<JHashtype> {
  loadAll(): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInitial(this).create();
    const hashtypes$ = this.service.getAll(SERV.HASHTYPES, params);
    this.subscriptions.push(
      hashtypes$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {

          const responseBody = { data: response.data, included: response.included };
          const hashtypes = this.serializer.deserialize<JHashtype[]>(responseBody);
          const length = response.meta.page.total_elements;

          this.setPaginationConfig(
            this.pageSize,
            length,
            this.pageAfter,
            this.pageBefore,
            this.index
          );
          this.setData(hashtypes);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
