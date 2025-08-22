import { catchError, finalize, forkJoin, of } from 'rxjs';

import { JChunk } from '@models/chunk.model';
import { Filter, FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class ChunksDataSource extends BaseDataSource<JChunk> {
  private _agentId = 0;
  private _currentFilter: Filter = null;

  setAgentId(agentId: number): void {
    this._agentId = agentId;
  }

  loadAll(query?: Filter): void {
    this.loading = true;
    // Store the current filter if provided
    if (query) {
      this._currentFilter = query;
    }

    // Use stored filter if no new filter is provided
    const activeFilter = query || this._currentFilter;
    let params = new RequestParamBuilder().addInitial(this).addInclude('task').addInclude('agent');
    if (this._agentId) {
      params.addFilter({ field: 'agentId', operator: FilterType.EQUAL, value: this._agentId });
    }
    /*     if (query) {
      params.addFilter(query);
    } */
    params = this.applyFilterWithPaginationReset(params, activeFilter, query);
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

        const length = response.meta.page.total_elements;
        const nextLink = response.links.next;
        const prevLink = response.links.prev;
        const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
        const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;

        this.setPaginationConfig(this.pageSize, length, after, before, this.index);
        this.setData(assignedChunks);
      });
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
  clearFilter(): void {
    this._currentFilter = null;
    this.setPaginationConfig(this.pageSize, undefined, undefined, undefined, 0);
    this.reload();
  }
}
