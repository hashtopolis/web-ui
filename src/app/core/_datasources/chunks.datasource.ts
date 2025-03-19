import { catchError, finalize, forkJoin, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { JChunk } from '../_models/chunk.model';
import { ResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';
import { Filter, RequestParams } from '../_models/request-params.model';

export class ChunksDataSource extends BaseDataSource<JChunk> {
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

    const chunks$ = this.service.getAll(SERV.CHUNKS, params);

    forkJoin([chunks$])
      .pipe(
        catchError(() => of([])),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        ([response]: [ResponseWrapper]) => {
           const responseBody = { data: response.data, included: response.included };
           const assignedChunks = this.serializer.deserialize<JChunk[]>(responseBody);

          assignedChunks.forEach((chunk: JChunk) => {
            if(chunk.task != undefined) {
              chunk.taskName = chunk.task.taskName;
            }
            if(chunk.agent != undefined) {
              chunk.agentName = chunk.agent.agentName;
            }
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
