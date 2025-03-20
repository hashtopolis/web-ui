import { catchError, finalize, forkJoin, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { JChunk } from '../_models/chunk.model';
import { ResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';
import { FilterType } from '../_models/request-params.model';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class ChunksDataSource extends BaseDataSource<JChunk> {
  private _agentId = 0;

  setAgentId(agentId: number): void {
    this._agentId = agentId;
  }

  loadAll(): void {
    this.loading = true;

    const params = new RequestParamBuilder().addInitial(this).addInclude('task').addInclude('agent');
    if (this._agentId) {
      params.addFilter({ field: 'chunkId', operator: FilterType.EQUAL, value: this._agentId });
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
