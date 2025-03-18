import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ResponseWrapper } from '../_models/response.model';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';
import { JSuperTask } from '../_models/supertask.model';

export class SuperTasksDataSource extends BaseDataSource<
  JSuperTask,
  MatTableDataSourcePaginator
> {
  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const params: RequestParams = {
      page: {
        size: this.pageSize,
        after: startAt
      },
      include: ['pretasks']
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.sort = [order];
    }

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

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            supertasks.length
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
