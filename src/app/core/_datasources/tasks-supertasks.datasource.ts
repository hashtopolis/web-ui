import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { SERV } from '../_services/main.config';
import { TaskWrapper } from '../_models/task-wrapper.model';
import { FilterType } from '../_models/request-params.model';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class TasksSupertasksDataSource extends BaseDataSource<
  TaskWrapper,
  MatTableDataSourcePaginator
> {
  private _supertTaskId = 0;

  setSuperTaskId(supertTaskId: number) {
    this._supertTaskId = supertTaskId;
  }

  loadAll(): void {
    this.loading = true;

    const params = new RequestParamBuilder().setPageSize(this.pageSize).addInclude('tasks').addFilter({
      field: 'taskWrapperId',
      operator: FilterType.EQUAL,
      value: this._supertTaskId
    }).create();

    const subtasks$ = this.service.getAll(SERV.TASKS_WRAPPER, params);

    this.subscriptions.push(
      subtasks$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<TaskWrapper>) => {
          const subtasks: any[] = response.values[0].tasks;
          this.setData(subtasks);
        })
    );
  }

  getData(): TaskWrapper[] {
    return this.getOriginalData();
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
