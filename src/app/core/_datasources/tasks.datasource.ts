import { catchError, of } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { MatTableDataSourcePaginator } from '@angular/material/table';

import { FilterType } from '@models/request-params.model';
import { JTaskWrapper } from '@models/task-wrapper.model';

import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { SERV } from '@services/main.config';

import { ResponseWrapper } from '@models/response.model';

import { BaseDataSource } from '@datasources/base.datasource';

export class TasksDataSource extends BaseDataSource<JTaskWrapper, MatTableDataSourcePaginator> {
  private _isArchived = false;
  private _hashlistId = 0;

  setIsArchived(isArchived: boolean): void {
    this._isArchived = isArchived;
  }

  setHashlistId(hashlistId: number): void {
    this._hashlistId = hashlistId;
  }

  loadAll(): void {
    this.loading = true;
    const params = new RequestParamBuilder()
      .addInitial(this)
      .addInclude('accessGroup')
      .addInclude('tasks')
      .addInclude('hashlist')
      .addInclude('hashType')
      .addFilter({
        field: 'isArchived',
        operator: FilterType.EQUAL,
        value: this._isArchived
      });

    const wrappers$ = this.service.getAll(SERV.TASKS_WRAPPER, params.create());

    this.subscriptions.push(
      wrappers$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const taskWrappers = this.serializer.deserialize<JTaskWrapper[]>({
            data: response.data,
            included: response.included
          });
          this.setPaginationConfig(this.pageSize, this.currentPage, taskWrappers.length);
          this.setData(taskWrappers);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
