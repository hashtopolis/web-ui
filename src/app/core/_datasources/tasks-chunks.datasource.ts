import { catchError, finalize, of } from 'rxjs';

import { JChunk } from '@models/chunk.model';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class TasksChunksDataSource extends BaseDataSource<JChunk> {
  private _taskId = 0;
  private _isChunksLive = 0;

  setTaskId(taskId: number) {
    this._taskId = taskId;
  }

  setIsChunksLive(number: number) {
    this._isChunksLive = number;
  }

  loadAll(): void {
    const chunktime = this.uiService.getUIsettings('chunktime').value;
    this.loading = true;

    const chunkParams = new RequestParamBuilder()
      .addInitial(this)
      .addInclude('task')
      .addInclude('agent')
      .addFilter({
        field: 'taskId',
        operator: FilterType.EQUAL,
        value: this._taskId
      })
      .create();

    this.service
      .getAll(SERV.CHUNKS, chunkParams)
      .pipe(
        catchError(() => of([])),
        finalize(() => (this.loading = false))
      )
      .subscribe((response: ResponseWrapper) => {
        const responseBody = { data: response.data, included: response.included };
        const chunks = new JsonAPISerializer().deserialize<JChunk[]>({
          data: responseBody.data,
          included: responseBody.included
        });

        const chunksToShow: JChunk[] = [];
        chunks.forEach((chunk: JChunk) => {
          if (chunk.agent) {
            chunk.agentName = chunk.agent.agentName;
          }
          if (chunk.task) {
            chunk.taskName = chunk.task.taskName;
          }
          if (this._isChunksLive) {
            chunksToShow.push(chunk);
          } else if (
            Date.now() / 1000 - Math.max(chunk.solveTime, chunk.dispatchTime) < chunktime &&
            chunk.progress < 10000
          ) {
            chunksToShow.push(chunk);
          }
        });
        this.setData(chunksToShow);
      });
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
