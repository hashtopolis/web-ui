import { catchError, finalize, of } from 'rxjs';

import { AgentBinaryData } from '../_models/agent-binary.model';
import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class AgentBinariesDataSource extends BaseDataSource<AgentBinaryData> {
  loadAll(): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInitial(this).create();
    const agentBinaries$ = this.service.getAll(SERV.AGENT_BINARY, params);
    this.subscriptions.push(
      agentBinaries$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<AgentBinaryData>) => {
          const agentBinaries: AgentBinaryData[] = response.data;

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
