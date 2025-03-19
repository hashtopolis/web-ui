import { catchError, finalize, forkJoin, of } from 'rxjs';

import { Agent } from '../_models/agent.model';
import { BaseDataSource } from './base.datasource';
import { Chunk } from '../_models/chunk.model';
import { ListResponseWrapper } from '../_models/response.model';
import { FilterType } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

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
    const chunkParams = new RequestParamBuilder().addInitial(this).addInclude('task').addFilter({
      field: 'taskId',
      operator: FilterType.EQUAL,
      value: this._taskId
    }).create();

    const agentParams = new RequestParamBuilder().setPageSize(this.maxResults).create();

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
