import { Filter, FilterType } from '@models/request-params.model';
import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { JCrackerBinaryType } from '../_models/cracker-binary.model';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';
import { ResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';

export class CrackersDataSource extends BaseDataSource<JCrackerBinaryType> {
  loadAll(query?: Filter): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInitial(this).addInclude('crackerVersions');
    if (query) {
      params.addFilter(query);
    }
    const crackers$ = this.service.getAll(SERV.CRACKERS_TYPES, params.create());
    this.subscriptions.push(
      crackers$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const responseData = { data: response.data, included: response.included };
          const crackers = this.serializer.deserialize<JCrackerBinaryType[]>(responseData);

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
          this.setData(crackers);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
