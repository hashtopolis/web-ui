import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from '@datasources/base.datasource';
import { Filter } from '../_models/request-params.model';
import { JSuperTask } from '@models/supertask.model';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';
import { ResponseWrapper } from '@models/response.model';
import { SERV } from '@services/main.config';

export class SuperTasksDataSource extends BaseDataSource<JSuperTask> {
  loadAll(query?: Filter): void {
    this.loading = true;

    const params = new RequestParamBuilder().addInitial(this).addInclude('pretasks');
    if (query) {
      params.addFilter(query);
    }
    const supertasks$ = this.service.getAll(SERV.SUPER_TASKS, params.create());

    this.subscriptions.push(
      supertasks$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const responseBody = { data: response.data, included: response.included };
          const supertasks = this.serializer.deserialize<JSuperTask[]>(responseBody);
          const length = response.meta.page.total_elements;
          const nextLink = response.links.next;
          const prevLink = response.links.prev;
          const after = nextLink ? new URL(response.links.next).searchParams.get("page[after]") : null;
          const before = prevLink ? new URL(response.links.prev).searchParams.get("page[before]") : null;

          this.setPaginationConfig(
            this.pageSize,
            length,
            after,
            before,
            this.index
          );
          this.setData(supertasks);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
