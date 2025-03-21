import { catchError, finalize, never, of } from 'rxjs';

import { JAgentBinary } from '../_models/agent-binary.model';
import { BaseDataSource } from './base.datasource';
import { ResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class AgentBinariesDataSource extends BaseDataSource<JAgentBinary> {
  loadAll(): void {
    this.loading = true;


    //ToDo: Reactivate sorting
    this.sortingColumn.isSortable = false;

    const params = new RequestParamBuilder().addInitial(this).create();
    const agentBinaries$ = this.service.getAll(SERV.AGENT_BINARY, params);
    this.subscriptions.push(
      agentBinaries$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {

          (response.data as []).forEach((agentBinary) => {
            agentBinary['attributes']['agentbinaryType'] = agentBinary['attributes']['type'];
            delete agentBinary['attributes']['type'];
          });



          const responseData = { data: response.data, included: response.included };
          const agentBinaries = this.serializer.deserialize<JAgentBinary[]>(responseData);

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            agentBinaries.length
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
