import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { FilterType } from '../_models/request-params.model';
import { JHashtype } from '../_models/hashtype.model';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';
import { ResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';

export class HashtypesDataSource extends BaseDataSource<JHashtype> {
  loadAll(): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInitial(this).create();
    const params2 = new RequestParamBuilder().addInitial(this)
      .addFilter({ field: 'description', operator: FilterType.CONTAINS, value: 'RIPE' })
      .create();
    const hashtypes$ = this.service.getAll(SERV.HASHTYPES, params);
    const test = this.service.getAll(SERV.HASHTYPES, params2);
/*     this.subscriptions.push(
      test
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const hashtypes = this.serializer.deserialize<JHashtype[]>(response);
          console.log('Test response:', response);
          this.setData(hashtypes);
        })
    ); */
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
