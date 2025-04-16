import { catchError, finalize, firstValueFrom, forkJoin, of } from 'rxjs';

import { ASC } from '../_constants/agentsc.config';
import { BaseDataSource } from './base.datasource';
import { JAgent } from '../_models/agent.model';
import { JAgentStat } from '../_models/agent-stats.model';
import { RequestParamBuilder } from '../_services/params/builder-implementation.service';
import { RequestParams } from '../_models/request-params.model';
import { ResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';

export class AgentsViewDataSource extends BaseDataSource<JAgent> {
  private _agentId = 0;

  setAgentId(agentId: number): void {
    this._agentId = agentId;
  }

  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;
    const agentParams = new RequestParamBuilder()
      .addInitial(this)
      .setPageSize(this.pageSize)
      .setPageAfter(startAt)
      .addInclude('agentStats')
      .create();

    const agents$ = this.service.getAll(SERV.AGENTS, agentParams);
    agents$
      .pipe(
        catchError(() => of([])),
        finalize(() => (this.loading = false))
      )
      .subscribe((agentStatsResponse: ResponseWrapper) => {
        const agents = this.serializer.deserialize<JAgent[]>(agentStatsResponse);
        console.log('AFTER ', agents);
        agents.map((agent: JAgent) => {
          const tempDateFilter = agent.agentStats.filter((u) => u.time > 10000000);
          const statTemp = tempDateFilter.filter((u) => u.statType == ASC.GPU_TEMP);
          const statDevice = tempDateFilter.filter((u) => u.statType == ASC.GPU_UTIL);
          const statCpu = tempDateFilter.filter((u) => u.statType == ASC.CPU_UTIL);

          agent.maxTemp = Math.round(
            statTemp.reduce((prev, current) => (prev.value > current.value ? prev : current)).value[0]
          );

          agent.avgCpu = Math.round(
            statCpu.reduce((sum, current) => sum + current.value.reduce((a, b) => a + b, 0), 0) / statCpu.length
          );

          agent.avgDevice = Math.round(
            statDevice.reduce((sum, current) => sum + current.value.reduce((a, b) => a + b, 0), 0) / statDevice.length
          );
        });
        this.setPaginationConfig(this.pageSize, this.currentPage, agents.length);
        this.setData(agents);
      });
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
