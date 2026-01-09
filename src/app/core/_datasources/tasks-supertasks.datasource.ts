import { catchError, finalize, of } from 'rxjs';

import { JChunk } from '@models/chunk.model';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JTask } from '@models/task.model';

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
      .addInitial(this)
      .addFilter({ field: 'taskWrapperId', operator: FilterType.EQUAL, value: this._supertTaskId })
      .create();

    const subtasks$ = this.service.getAll(SERV.TASKS, params);

    this.subscriptions.push(
      subtasks$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const subtasks = this.serializer.deserialize<JTask[]>({
            data: response.data,
            included: response.included
          });
          const length = response.meta.page.total_elements;
          const nextLink = response.links.next;
          const prevLink = response.links.prev;
          const after = nextLink ? new URL(response.links.next).searchParams.get('page[after]') : null;
          const before = prevLink ? new URL(response.links.prev).searchParams.get('page[before]') : null;

          this.setPaginationConfig(this.pageSize, length, after, before, this.index);
          if (subtasks.length > 0) {
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
          } else {
            this.setData(subtasks);
          }
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
