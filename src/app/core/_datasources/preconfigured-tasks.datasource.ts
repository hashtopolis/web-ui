import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { Pretask } from '../_models/pretask.model';
import { SERV } from '../_services/main.config';

export class PreTasksDataSource extends BaseDataSource<
  Pretask,
  MatTableDataSourcePaginator
> {
  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const params = {
      maxResults: this.pageSize,
      startAt: startAt,
      expand: 'pretaskFiles'
    };

    const pretasks$ = this.service.getAll(SERV.PRETASKS, params);

    this.subscriptions.push(
      pretasks$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<Pretask>) => {
          const pretasks: Pretask[] = response.values;

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            response.total
          );
          this.setData(pretasks);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
