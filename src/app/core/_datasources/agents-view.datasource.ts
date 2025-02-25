import { Agent, AgentStats } from '../_models/agent.model';
import { Chunk, ChunkData } from '../_models/chunk.model';
import { catchError, finalize, firstValueFrom, forkJoin, of } from 'rxjs';

import { ASC } from '../_constants/agentsc.config';
import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';
import { time } from 'console';

export class AgentsViewDataSource extends BaseDataSource<Chunk> {
  private _agentId = 0;

  setAgentId(agentId: number): void {
    this._agentId = agentId;
  }

  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const params: RequestParams = {
      maxResults: this.pageSize,
      startsAt: startAt,
      expand: 'task'
    };
    const agentParams2: RequestParams = {
      maxResults: this.pageSize,
      startsAt: startAt,
      expand: 'agentstats'
    };

    if (this._agentId) {
      params.filter = `chunkId=${this._agentId}`;
    }

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.ordering = order;
    }

    const agentParams = { maxResults: this.maxResults };
    const chunks$ = this.service.getAll(SERV.CHUNKS, params);
    const agents$ = this.service.getAll(SERV.AGENTS, agentParams2);
    const agentsStat$ = this.service.getAll(SERV.AGENTS_STATS, agentParams);

    forkJoin([chunks$, agents$, agentsStat$])
      .pipe(
        catchError(() => of([])),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        ([c, a, as]: [
          ListResponseWrapper<Chunk>,
          ListResponseWrapper<Agent>,
          ListResponseWrapper<AgentStats>
        ]) => {
          const agentStats: AgentStats[] = as.values;
          const assignedChunks: Chunk[] = c.values;
          const agents: Agent[] = a.values;
          agents.map((agent: Agent) => {
            const temp = agent.agentstats.filter((u) => u.time > 10000000);
            console.log(temp);
          });
          // console.log('HEJ', agentStats);
          const tempDateFilter = agentStats.filter((u) => u.time > 10000000);
          const statTemp = tempDateFilter.filter(
            (u) => u.statType == ASC.GPU_TEMP
          );
          const statDevice = tempDateFilter.filter(
            (u) => u.statType == ASC.GPU_UTIL
          ); // Temp
          const statCpu = tempDateFilter.filter(
            (u) => u.statType == ASC.CPU_UTIL
          ); // Temp

          console.log('HEJ', statTemp, statDevice, statCpu);
          /*           agentStats.map((agentStat: AgentStats) => {
            console.log(agentStat);
            agentStat.value.filter((u) => u > 10000000);
            // console.log(agg);
          }); */
          assignedChunks.map((chunk: Chunk) => {
            chunk.agent = a.values.find((e: Agent) => e._id === chunk.agentId);
            // Flatten row so that we can access agent name and task name by key when rendering the table.
            if (chunk.agent) {
              chunk.agentName = chunk.agent.agentName;
            }
            if (chunk.task) {
              chunk.taskName = chunk.task.taskName;
            }
            // console.log(chunk);
            return chunk;
          });

          this.setData(assignedChunks);
        }
      );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
