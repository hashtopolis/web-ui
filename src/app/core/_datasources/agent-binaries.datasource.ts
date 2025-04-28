import { catchError, finalize, of } from 'rxjs';

import { AgentBinary } from '../_models/agent-binary.model';
import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';

export class AgentBinariesDataSource extends BaseDataSource<AgentBinary> {
  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const params: RequestParams = {
      maxResults: this.pageSize,
      startsAt: startAt
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.ordering = order;
    }

    const agentBinaries$ = this.service.getAll(SERV.AGENT_BINARY, params);

    this.subscriptions.push(
      agentBinaries$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<AgentBinary>) => {
          const agentBinaries: AgentBinary[] = response.values;

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            response.total
          );
          this.setData(agentBinaries);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
