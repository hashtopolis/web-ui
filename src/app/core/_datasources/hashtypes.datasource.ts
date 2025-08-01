import { Filter, FilterType } from '@src/app/core/_models/request-params.model';
import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { JHashtype } from '../_models/hashtype.model';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';
import { ResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';

export class HashtypesDataSource extends BaseDataSource<JHashtype> {
  loadAll(query?: Filter): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInitial(this);
    if (query) {
      params.addFilter(query);
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
          const nextLink = response.links.next;
          const prevLink = response.links.prev;
          const after = nextLink ? new URL(nextLink).searchParams.get("page[after]") : null;
          const before = prevLink ? new URL(prevLink).searchParams.get("page[before]") : null;

          this.setPaginationConfig(
            this.pageSize,
            length,
            after,
            before,
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
