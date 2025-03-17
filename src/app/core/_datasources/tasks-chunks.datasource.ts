import { catchError, finalize, forkJoin, of } from 'rxjs';

import { Agent } from '../_models/agent.model';
import { BaseDataSource } from './base.datasource';
import { Chunk } from '../_models/chunk.model';
import { ListResponseWrapper } from '../_models/response.model';
import { Filter, RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';

export class TasksChunksDataSource extends BaseDataSource<Chunk> {
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

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const chunkParams: RequestParams = {
      page: {
        size: this.pageSize,
        after: startAt
      },
      include: ['task'],
      filter: new Array<Filter>({field: "taskId", operator: "eq", value: this._taskId})
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      chunkParams.sort = [order];
    }

    const agentParams: RequestParams = {
      page: {
        size: this.maxResults
      }
    };

    const chunks$ = this.service.getAll(SERV.CHUNKS, chunkParams);
    const agents$ = this.service.getAll(SERV.AGENTS, agentParams);

    forkJoin([chunks$, agents$])
      .pipe(
        catchError(() => of([])),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        ([c, a]: [ListResponseWrapper<Chunk>, ListResponseWrapper<Agent>]) => {
          const getchunks: Chunk[] = c.values;

          if (this._isChunksLive === 0) {
            const chunktime = this.uiService.getUIsettings('chunktime').value;
            const resultArray = [];
            const cspeed = [];

            for (let i = 0; i < getchunks.length; i++) {
              if (
                Date.now() / 1000 -
                  Math.max(getchunks[i].solveTime, getchunks[i].dispatchTime) <
                  chunktime &&
                getchunks[i].progress < 10000
              ) {
                cspeed.push(getchunks[i].speed);
                resultArray.push(getchunks[i]);
              }
            }

            this.setData(resultArray);
          } else {
            const assignedChunks: Chunk[] = getchunks.map((chunk: Chunk) => {
              chunk.agent = a.values.find(
                (e: Agent) => e._id === chunk.agentId
              );
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
        }
      );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
