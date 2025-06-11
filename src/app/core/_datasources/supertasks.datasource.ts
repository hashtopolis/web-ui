import { catchError, finalize, of } from 'rxjs';

import { ResponseWrapper } from '@models/response.model';
import { JSuperTask } from '@models/supertask.model';

import { SERV } from '@services/main.config';

import { BaseDataSource } from '@datasources/base.datasource';

import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class SuperTasksDataSource extends BaseDataSource<JSuperTask> {
  loadAll(): void {
    this.loading = true;

    const params = new RequestParamBuilder().addInitial(this).addInclude('pretasks').create();

    const supertasks$ = this.service.getAll(SERV.SUPER_TASKS, params);

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

          this.setPaginationConfig(
            this.pageSize,
            length,
            this.pageAfter,
            this.pageBefore,
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
