import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from '@datasources/base.datasource';
import { Filter } from '../_models/request-params.model';
import { JAgentBinary } from '@models/agent-binary.model';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { ResponseWrapper } from '@models/response.model';
import { SERV } from '@services/main.config';

export class AgentBinariesDataSource extends BaseDataSource<JAgentBinary> {
  loadAll(query?: Filter): void {
    this.loading = true;

    //ToDo: Reactivate sorting
    this.sortingColumn.isSortable = false;

    const params = new RequestParamBuilder().addInitial(this);
    if (query) {
      params.addFilter(query);
    }
    const agentBinaries$ = this.service.getAll(SERV.AGENT_BINARY, params.create());
    this.subscriptions.push(
      agentBinaries$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const responseData = { data: response.data, included: response.included };
          const agentBinaries = this.serializer.deserialize<JAgentBinary[]>(responseData);
          const length = response.meta.page.total_elements;

          const nextLink = response.links.next;
          const prevLink = response.links.prev;
          const after = nextLink ? new URL(response.links.next).searchParams.get("page[after]") : null;
          const before = prevLink ? new URL(response.links.prev).searchParams.get("page[before]") : null;

          this.setPaginationConfig(
            this.pageSize,
            length,
            after,
            before,
            this.index
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
