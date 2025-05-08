import { catchError, firstValueFrom, of } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { JChunk } from '@models/chunk.model';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JTaskWrapper } from '@models/task-wrapper.model';
import { JTask } from '@models/task.model';

import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class TasksDataSource extends BaseDataSource<JTaskWrapper> {
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
        .subscribe(async (response: ResponseWrapper) => {
          const taskWrappers = this.serializer.deserialize<JTaskWrapper[]>({
            data: response.data,
            included: response.included
          });
          this.setPaginationConfig(this.pageSize, this.currentPage, taskWrappers.length);
          const taskIDs: Array<number> = taskWrappers.map((wrapper) => wrapper.tasks[0].id);
          const chunkParams = new RequestParamBuilder().addFilter({
            field: 'taskId',
            operator: FilterType.IN,
            value: taskIDs
          });

          const chunkResponse: ResponseWrapper = await firstValueFrom(
            this.service.getAll(SERV.CHUNKS, chunkParams.create())
          );
          const chunkBody = { data: chunkResponse.data, included: chunkResponse.included };
          const chunks = this.serializer.deserialize<JChunk[]>(chunkBody);

          for (const taskWrapper of taskWrappers) {
            const task: JTask = taskWrapper.tasks[0];
            taskWrapper.chunkData = this.convertChunks(task.id, chunks, false, task.keyspace);
          }
          this.setData(taskWrappers);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
