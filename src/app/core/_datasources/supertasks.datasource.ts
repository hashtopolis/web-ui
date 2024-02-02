import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { SERV } from '../_services/main.config';
import { SuperTask } from '../_models/supertask.model';

export class SuperTasksDataSource extends BaseDataSource<
  SuperTask,
  MatTableDataSourcePaginator
> {
  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const params = {
      maxResults: this.pageSize,
      startsAt: startAt,
      expand: 'pretasks'
    };

    const supertasks$ = this.service.getAll(SERV.SUPER_TASKS, params);

    this.subscriptions.push(
      supertasks$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<SuperTask>) => {
          const supertasks: SuperTask[] = response.values;

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
