import { catchError, finalize, firstValueFrom, forkJoin, of } from 'rxjs';

import { ASC } from '../_constants/agentsc.config';
import { BaseDataSource } from './base.datasource';
import { JAgent } from '../_models/agent.model';
import { JAgentStat } from '../_models/agent-stats.model';
import { RequestParamBuilder } from '../_services/params/builder-implementation.service';
import { RequestParams } from '../_models/request-params.model';
import { ResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';
import { STATCALCULATION } from '../_components/tables/agent-view-table/agent-view-table.component';

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
        /*         agents.map((agent: JAgent) => {
          agent.maxTemp = this.getMaxOrAvgValue(agent, ASC.GPU_TEMP, STATCALCULATION.MAX_VALUE);
          agent.avgCpu = this.getMaxOrAvgValue(agent, ASC.CPU_UTIL, STATCALCULATION.AVG_VALUE)
          agent.avgDevice = this.getMaxOrAvgValue(agent, ASC.GPU_UTIL, STATCALCULATION.AVG_VALUE)
        }); */
        this.setPaginationConfig(this.pageSize, this.currentPage, agents.length);
        this.setData(agents);
      });
  }
  /*   private getMaxOrAvgValue(agent: JAgent, statType: ASC, avgOrMax: STATCALCULATION) {
    const tempDateFilter = agent.agentStats.filter((u) => u.time > 10000000);
    const stat = tempDateFilter.filter((u) => u.statType == statType);
    switch (avgOrMax) {
      case 1:
        const avgDevice = Math.round(
          stat.reduce((sum, current) => sum + current.value.reduce((a, b) => a + b, 0), 0) / stat.length
        );
        return avgDevice;
      case 2:
        const maxTemp = Math.round(
          stat.reduce((prev, current) => (prev.value > current.value ? prev : current)).value[0]
        );
        return maxTemp;

      default:
        return 0; // Provide a default value for unhandled cases
    }
  } */
  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
