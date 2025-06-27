import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { FilterQuery } from '../_models/filter-query.model';
import { FilterType } from '../_models/request-params.model';
import { JHashtype } from '../_models/hashtype.model';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';
import { ResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';

export class HashtypesDataSource extends BaseDataSource<JHashtype> {
  loadAll(query?: FilterQuery): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInitial(this);
    if (query) {
      params.addFilter({ field: query.field, operator: FilterType.CONTAINS, value: query.query });
      console.log('add search');
    }
    const hashtypes$ = this.service.getAll(SERV.HASHTYPES, params.create());
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

          this.setPaginationConfig(this.pageSize, length, this.pageAfter, this.pageBefore, this.index);
          this.setData(hashtypes);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
