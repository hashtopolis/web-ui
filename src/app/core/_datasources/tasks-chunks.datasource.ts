import { catchError, finalize, forkJoin, of } from 'rxjs';

import { FilterType } from '@models/request-params.model';
import { JAgent } from '@models/agent.model';
import { JChunk } from '@models/chunk.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { SERV } from '@services/main.config';

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
    this.loading = true;
    const chunkParams = new RequestParamBuilder()
      .addInitial(this)
      .addInclude('task')
      .addFilter({
        field: 'taskId',
        operator: FilterType.EQUAL,
        value: this._taskId
      })
      .create();

    const agentParams = new RequestParamBuilder().setPageSize(this.maxResults).create();

    const chunks$ = this.service.getAll(SERV.CHUNKS, chunkParams);
    const agents$ = this.service.getAll(SERV.AGENTS, agentParams);

    forkJoin([chunks$, agents$])
      .pipe(
        catchError(() => of([])),
        finalize(() => (this.loading = false))
      )
      .subscribe(([chunkResponse, agentResponse]: [ResponseWrapper, ResponseWrapper]) => {
        const chunks = new JsonAPISerializer().deserialize<JChunk[]>({
          data: chunkResponse.data,
          included: chunkResponse.included
        });
        const agents = new JsonAPISerializer().deserialize<JAgent[]>({
          data: agentResponse.data,
          included: agentResponse.included
        });

        if (this._isChunksLive === 0) {
          const chunktime = this.uiService.getUIsettings('chunktime').value;
          const resultArray = [];
          const cspeed = [];

          for (let i = 0; i < chunks.length; i++) {
            if (
              Date.now() / 1000 - Math.max(chunks[i].solveTime, chunks[i].dispatchTime) < chunktime &&
              chunks[i].progress < 10000
            ) {
              cspeed.push(chunks[i].speed);
              resultArray.push(chunks[i]);
            }
          }

          this.setData(resultArray);
        } else {
          const assignedChunks = chunks.map((chunk) => {
            chunk.agent = agents.find((agent) => agent.id === chunk.agentId);
            // Flatten row so that we can access agent name and task name by key when rendering the table.
            if (chunk.agent) {
              chunk.agentName = chunk.agent.agentName;
            }
            if (chunk.task) {
              chunk.taskName = chunk.task.taskName;
            }

            return chunk;
          });

          this.setData(assignedChunks);
        }
      });
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
