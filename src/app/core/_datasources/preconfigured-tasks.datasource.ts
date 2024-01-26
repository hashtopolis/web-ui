import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { Pretask } from '../_models/pretask.model';
import { SERV } from '../_services/main.config';

export class PreTasksDataSource extends BaseDataSource<
  Pretask,
  MatTableDataSourcePaginator
> {
  private _superTaskId = 0;

  setSuperTaskId(superTaskId: number): void {
    this._superTaskId = superTaskId;
  }

  loadAll(): void {
    this.loading = true;

    let pretasks$;

    if (this._superTaskId === 0) {
      const startAt = this.currentPage * this.pageSize;
      const params = {
        maxResults: this.pageSize,
        startAt: startAt,
        expand: 'pretaskFiles'
      };

      pretasks$ = this.service.getAll(SERV.PRETASKS, params);
    } else {
      pretasks$ = this.service.get(SERV.SUPER_TASKS, this._superTaskId, {
        expand: 'pretasks'
      });
    }

    this.subscriptions.push(
      pretasks$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<Pretask>) => {
          let pretasks: Pretask[];
          if (this._superTaskId === 0) {
            pretasks = response.values;

            this.setPaginationConfig(
              this.pageSize,
              this.currentPage,
              response.total
            );
          } else {
            pretasks = response.pretasks || [];
          }

          this.setData(pretasks);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
