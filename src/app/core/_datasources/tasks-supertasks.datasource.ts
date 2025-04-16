import { catchError, finalize, of } from 'rxjs';

import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JTaskWrapper } from '@models/task-wrapper.model';
import { JTask } from '@models/task.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class TasksSupertasksDataSource extends BaseDataSource<JTask> {
  private _supertTaskId = 0;

  setSuperTaskId(supertTaskId: number) {
    this._supertTaskId = supertTaskId;
  }

  loadAll(): void {
    this.loading = true;

    const params = new RequestParamBuilder()
      .setPageSize(this.pageSize)
      .addInclude('tasks')
      .addFilter({ field: 'taskWrapperId', operator: FilterType.EQUAL, value: this._supertTaskId })
      .create();

    const subtasks$ = this.service.getAll(SERV.TASKS_WRAPPER, params);

    this.subscriptions.push(
      subtasks$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const taskWrappers = new JsonAPISerializer().deserialize<JTaskWrapper[]>({
            data: response.data,
            included: response.included
          });

          this.setPaginationConfig(this.pageSize, this.currentPage, taskWrappers.length);

          const subtasks = taskWrappers[0].tasks;
          this.setData(subtasks);
        })
    );
  }

  getData(): JTask[] {
    return this.getOriginalData();
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
