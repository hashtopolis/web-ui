import { catchError, finalize, forkJoin, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { SERV } from '../_services/main.config';
import { JTaskWrapper } from '../_models/task-wrapper.model';
import { JHashtype } from '../_models/hashtype.model';
import { ResponseWrapper } from '../_models/response.model';
import { JHashlist } from '../_models/hashlist.model';
import { FilterType } from '../_models/request-params.model';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class TasksDataSource extends BaseDataSource<
  JTaskWrapper,
  MatTableDataSourcePaginator
> {
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
    const params = new RequestParamBuilder().addInitial(this).addInclude('accessGroup').addInclude('tasks')
    .addInclude("hashlist").addInclude("hashType").addFilter({
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
        .subscribe(
          (taskWrapperResponse: ResponseWrapper) => {

            const taskWrapperResponseBody = { data: taskWrapperResponse.data, included: taskWrapperResponse.included };
            const taskWrappersDeserialized = this.serializer.deserialize<JTaskWrapper[]>(taskWrapperResponseBody);

            let taskWrappers: JTaskWrapper[] = [];

            taskWrappersDeserialized.forEach((value: JTaskWrapper) => {
              const taskWrapper: JTaskWrapper = value;
              taskWrappers.push(taskWrapper);
            });

            this.setPaginationConfig(
              this.pageSize,
              this.currentPage,
              taskWrappers.length
            );
            this.setData(taskWrappers);
        })
      );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
