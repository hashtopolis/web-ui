import { catchError, finalize, of } from 'rxjs';

import { JChunk } from '@models/chunk.model';
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
          const length = response.meta.page.total_elements;

          this.setPaginationConfig(
            this.pageSize,
            length,
            this.pageAfter,
            this.pageBefore,
            this.index
          );
          const subtasks = taskWrappers[0].tasks;

          const chunkParams = new RequestParamBuilder().addFilter({
            field: 'taskId',
            operator: FilterType.IN,
            value: subtasks.map((task) => task.id)
          });

          this.subscriptions.push(
            this.service
              .getAll(SERV.CHUNKS, chunkParams.create())
              .pipe(finalize(() => this.setData(subtasks)))
              .subscribe((chunkResponse: ResponseWrapper) => {
                const chunks = this.serializer.deserialize<JChunk[]>({
                  data: chunkResponse.data,
                  included: chunkResponse.included
                });
                subtasks.forEach((task) => {
                  task.chunkData = this.convertChunks(task.id, chunks, false, task.keyspace);
                });
              })
          );
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
