import { catchError, finalize, firstValueFrom, of } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';

import { JChunk } from '@models/chunk.model';
import { Filter, FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JTask } from '@models/task.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class TasksChunksDataSource extends BaseDataSource<JChunk> {
  private _taskId = 0;
  private _isChunksLive = 0;
  private _currentFilter: Filter = null;

  setTaskId(taskId: number) {
    this._taskId = taskId;
  }

  setIsChunksLive(number: number) {
    this._isChunksLive = number;
  }

  async loadAll(query?: Filter): Promise<void> {
    let chunkTime = this.uiService.getUIsettings('chunktime').value;
    this.loading = true;

    if (query) {
      this._currentFilter = query;
    }

    const activeFilter = query || this._currentFilter;

    let chunkParams = new RequestParamBuilder().addInitial(this).addInclude('task').addInclude('agent').addFilter({
      field: 'taskId',
      operator: FilterType.EQUAL,
      value: this._taskId
    });

    if (!this._isChunksLive) {
      if (this._taskId) {
        const httpOptions = { headers: new HttpHeaders({ 'X-Skip-Error-Dialog': 'true' }) };
        try {
          const response = await firstValueFrom<ResponseWrapper>(
            this.service.get(SERV.TASKS, this._taskId, undefined, httpOptions).pipe(
              catchError((error) => {
                this.handleFilterError(error);
                throw error;
              })
            )
          );
          const task = new JsonAPISerializer().deserialize<JTask>({
            data: response.data,
            included: response.included
          });
          chunkTime = task.chunkTime;
        } catch {
          // Error already handled via handleFilterError
        }
      }
      chunkParams.addFilter({ field: 'progress', value: 10000, operator: FilterType.LESSER }).addFilter({
        field: 'solveTime',
        value: Math.round(Date.now() / 1000 - chunkTime),
        operator: FilterType.GREATER
      });
    }

    chunkParams = this.applyFilterWithPaginationReset(chunkParams, activeFilter, query);

    // Create headers to skip error dialog for filter validation errors
    const httpOptions = { headers: new HttpHeaders({ 'X-Skip-Error-Dialog': 'true' }) };

    this.service
      .getAll(SERV.CHUNKS, chunkParams.create(), httpOptions)
      .pipe(
        catchError((error) => {
          this.handleFilterError(error);
          return of([]);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe((response: ResponseWrapper) => {
        const responseBody = { data: response.data, included: response.included };
        const chunks = new JsonAPISerializer().deserialize<JChunk[]>({
          data: responseBody.data,
          included: responseBody.included
        });

        const chunksToShow: JChunk[] = chunks.map((chunk: JChunk) => {
          if (chunk.agent) {
            chunk.agentName = chunk.agent.agentName;
          }
          if (chunk.task) {
            chunk.taskName = chunk.task.taskName;
          }
          return chunk;
        });

        const length = response.meta.page.total_elements;
        const nextLink = response.links.next;
        const prevLink = response.links.prev;
        const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
        const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;

        this.setPaginationConfig(this.pageSize, length, after, before, this.index);
        this.setData(chunksToShow);
      });
  }

  reload(): void {
    this.clearSelection();
    this.loadAll().then();
  }

  clearFilter(): void {
    this._currentFilter = null;
    this.setPaginationConfig(this.pageSize, undefined, undefined, undefined, 0);
    this.reload();
  }
}
