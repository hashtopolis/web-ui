import { catchError, finalize, of } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';

import { JAgentBinary } from '@models/agent-binary.model';
import { Filter } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class AgentBinariesDataSource extends BaseDataSource<JAgentBinary> {
  private _currentFilter: Filter = null;

  loadAll(query?: Filter): void {
    this.loading = true;
    // Store the current filter if provided
    if (query) {
      this._currentFilter = query;
    }

    // Use stored filter if no new filter is provided
    const activeFilter = query || this._currentFilter;

    let params = new RequestParamBuilder().addInitial(this);
    params = this.applyFilterWithPaginationReset(params, activeFilter, query) as RequestParamBuilder;

    // Create headers to skip error dialog for filter validation errors
    const httpOptions = { headers: new HttpHeaders({ 'X-Skip-Error-Dialog': 'true' }) };
    const binaries$ = this.service.getAll(SERV.AGENT_BINARY, params.create(), httpOptions);

    this.subscriptions.push(
      binaries$
        .pipe(
          catchError((error) => {
            this.handleFilterError(error);
            return of([]);
          }),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const responseData = { data: response.data, included: response.included };
          const agentBinaries = this.serializer.deserialize<JAgentBinary[]>(responseData);
          const length = response.meta.page.total_elements;

          const nextLink = response.links.next;
          const prevLink = response.links.prev;
          const after = nextLink ? new URL(response.links.next).searchParams.get('page[after]') : null;
          const before = prevLink ? new URL(response.links.prev).searchParams.get('page[before]') : null;

          this.setPaginationConfig(this.pageSize, length, after, before, this.index);

          this.setData(agentBinaries);
        })
    );
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
