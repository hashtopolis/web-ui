import { catchError, of } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { JChunk } from '@models/chunk.model';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JTask, JTaskWrapper } from '@models/task.model';

import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class TasksDataSource extends BaseDataSource<JTaskWrapper> {
  private _isArchived = false;
  private _hashlistID = 0;

  setIsArchived(isArchived: boolean): void {
    this._isArchived = isArchived;
  }

  setHashlistID(hashlistID: number): void {
    this._hashlistID = hashlistID;
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

    if (this._hashlistID && this._hashlistID > 0) {
      params.addFilter({
        field: 'hashlistId',
        operator: FilterType.EQUAL,
        value: this._hashlistID
      });
    }

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
          const length = response.meta.page.total_elements;
          const nextLink = response.links.next;
          const prevLink = response.links.prev;
          const after = nextLink ? new URL(response.links.next).searchParams.get("page[after]") : null;
          const before = prevLink ? new URL(response.links.prev).searchParams.get("page[before]") : null;

          this.setPaginationConfig(
            this.pageSize,
            length,
            after,
            before,
            this.index
          );
          if (taskWrappers.length > 0) {
            const chunkParams = new RequestParamBuilder().addFilter({
              field: 'taskId',
              operator: FilterType.IN,
              value: taskWrappers.map((wrapper) => wrapper.tasks[0].id)
            });

            this.subscriptions.push(
              this.service
                .getAll(SERV.CHUNKS, chunkParams.create())
                .pipe(finalize(() => this.setData(taskWrappers)))
                .subscribe((chunkResponse: ResponseWrapper) => {
                  const chunks = this.serializer.deserialize<JChunk[]>({
                    data: chunkResponse.data,
                    included: chunkResponse.included
                  });
                  taskWrappers.forEach((taskWrapper) => {
                    const task: JTask = taskWrapper.tasks[0];
                    taskWrapper.chunkData = this.convertChunks(task.id, chunks, false, task.keyspace);
                  });
                })
            );
          } else {
            this.setData(taskWrappers);
          }
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
