import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';
import { SuperTaskData } from '../_models/supertask.model';

export class SuperTasksDataSource extends BaseDataSource<
  SuperTaskData,
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
        .subscribe((response: ListResponseWrapper<SuperTaskData>) => {
          const supertasks: SuperTaskData[] = response.data;

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            response.total
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
