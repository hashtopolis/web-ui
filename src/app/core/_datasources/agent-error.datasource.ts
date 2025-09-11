/**
 * Contains data source for agents resource
 * @module
 */
import { catchError, finalize, of } from 'rxjs';

import { JAgentErrors } from '@models/agent-errors.model';
import { Filter, FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class AgentErrorDatasource extends BaseDataSource<JAgentErrors> {
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
    let agentParams = new RequestParamBuilder().addInitial(this).addInclude('task');
    if (this._agentId) {
      agentParams.addFilter({ field: 'agentId', operator: FilterType.EQUAL, value: this._agentId });
    }
    agentParams = this.applyFilterWithPaginationReset(agentParams, activeFilter, query);

    this.service
      .getAll(SERV.AGENT_ERRORS, agentParams.create())
      .pipe(
        catchError(() => of([])),
        finalize(() => (this.loading = false))
      )
      .subscribe(async (response: ResponseWrapper) => {
        const serializer = new JsonAPISerializer();
        const responseBody = { data: response.data, included: response.included };
        const agents = serializer.deserialize<JAgentErrors[]>({
          data: responseBody.data,
          included: responseBody.included
        });

        const length = response.meta.page.total_elements;
        const nextLink = response.links.next;
        const prevLink = response.links.prev;
        const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
        const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;

        this.setPaginationConfig(this.pageSize, length, after, before, this.index);
        this.setData(agents);
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
