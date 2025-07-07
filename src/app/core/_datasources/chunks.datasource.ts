import { Filter, FilterType } from '@models/request-params.model';
import { catchError, finalize, forkJoin, of } from 'rxjs';

import { BaseDataSource } from '@datasources/base.datasource';
import { JChunk } from '@models/chunk.model';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { ResponseWrapper } from '@models/response.model';
import { SERV } from '@services/main.config';

export class ChunksDataSource extends BaseDataSource<JChunk> {
  private _agentId = 0;

  setAgentId(agentId: number): void {
    this._agentId = agentId;
  }

  loadAll(query?: Filter): void {
    this.loading = true;

    const params = new RequestParamBuilder().addInitial(this).addInclude('task').addInclude('agent');
    if (this._agentId) {
      params.addFilter({ field: 'agentId', operator: FilterType.EQUAL, value: this._agentId });
    }
    if (query) {
      params.addFilter(query);
    }
    const chunks$ = this.service.getAll(SERV.CHUNKS, params.create());

    forkJoin([chunks$])
      .pipe(
        catchError(() => of([])),
        finalize(() => (this.loading = false))
      )
      .subscribe(([response]: [ResponseWrapper]) => {
        const responseBody = { data: response.data, included: response.included };
        const assignedChunks = this.serializer.deserialize<JChunk[]>(responseBody);

        assignedChunks.forEach((chunk: JChunk) => {
          if (chunk.task != undefined) {
            chunk.taskName = chunk.task.taskName;
          }
          if (chunk.agent != undefined) {
            chunk.agentName = chunk.agent.agentName;
          }
        });
        this.setData(assignedChunks);
      });
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
