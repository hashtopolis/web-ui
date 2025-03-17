import { catchError, finalize, forkJoin, of } from 'rxjs';

import { AgentData } from '../_models/agent.model';
import { BaseDataSource } from './base.datasource';
import { ChunkDataNew } from '../_models/chunk.model';
import { ListResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';
import { Filter, RequestParams } from '../_models/request-params.model';
import { TaskData } from '../_models/task.model';

export class ChunksDataSource extends BaseDataSource<ChunkDataNew> {
  private _agentId = 0;

  setAgentId(agentId: number): void {
    this._agentId = agentId;
  }

  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const params: RequestParams = {
      page: {
        size: this.pageSize,
        after: startAt
      },
      include: ['task','agent']
    };

    if (this._agentId) {
      params.filter = new Array<Filter>({field: "chunkId", operator: "eq", value: this._agentId});
    }

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.sort = [order];
    }

    const agentParams = { maxResults: this.maxResults };
    const chunks$ = this.service.getAll(SERV.CHUNKS, params);
    // const agents$ = this.service.getAll(SERV.AGENTS, agentParams);

    forkJoin([chunks$])
      .pipe(
        catchError(() => of([])),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        ([response]: [ListResponseWrapper<ChunkDataNew>]) => {
                    let assignedChunks: ChunkDataNew[] = [];

          response.data.forEach((value: ChunkDataNew) => {
            const assignedChunk: ChunkDataNew = value;

            let agentId: number = assignedChunk.attributes.agentId;
            let includedAgent: object = response.included.find((inc) => inc.type === "agent" && inc.id === agentId);
            assignedChunk.attributes.agent = includedAgent as AgentData;

            let taskId: number = assignedChunk.attributes.taskId;
            let includedTask: object = response.included.find((inc) => inc.type === "task" && inc.id === taskId);
            assignedChunk.attributes.task = includedTask as TaskData;

            assignedChunks.push(assignedChunk);
          });

          this.setData(assignedChunks);
        }
      );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
