import { Component, OnInit } from '@angular/core';

import { ASC } from '@src/app/core/_constants/agentsc.config';
import { PageTitle } from '@src/app/core/_decorators/autotitle';
import { JAgentStat } from '@src/app/core/_models/agent-stats.model';
import { JAgent } from '@src/app/core/_models/agent.model';
import { ResponseWrapper } from '@src/app/core/_models/response.model';
import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';
import { SERV } from '@src/app/core/_services/main.config';
import { GlobalService } from '@src/app/core/_services/main.service';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';
import { CookieService } from '@src/app/core/_services/shared/cookies.service';
import { environment } from '@src/environments/environment';

@Component({
  selector: 'app-agent-status',
  templateUrl: './agent-status.component.html',
  standalone: false
})
@PageTitle(['Agent Status'])
export class AgentStatusComponent implements OnInit {
  pageTitle = 'Agents Status';
  showagents: JAgent[] = [];
  _filteresAgents: JAgent[] = [];
  pageSize = 20;

  // view menu
  view: string | number = 0;

  // Agents Stats
  statDevice: JAgentStat[] = [];
  statTemp: JAgentStat[] = [];
  statCpu: JAgentStat[] = [];

  private maxResults = environment.config.prodApiMaxResults;

  constructor(
    private cookieService: CookieService,
    private gs: GlobalService,
    private serializer: JsonAPISerializer
  ) {}

  setView(value: string) {
    this.cookieService.setCookie('asview', value, 365);
    this.ngOnInit();
  }

  getView() {
    return this.cookieService.getCookie('asview');
  }

  ngOnInit(): void {
    this.view = this.getView() || 0;
    this.getAgentsPage();
    this.getAgentStats();
  }

  /**
   * Fetch agents from server
   */
  private getAgentsPage() {
    const agentRequestParams = new RequestParamBuilder().setPageSize(this.pageSize).create();

    this.gs.getAll(SERV.AGENTS, agentRequestParams).subscribe((agentResponse: ResponseWrapper) => {
      this.showagents = this._filteresAgents = this.serializer.deserialize<JAgent[]>(agentResponse);
      // TODO: Not sure how this code works and what it is supposed to achieve as it mixes objects of different types together
      // const getAData = agents.map((mainObject) => {
      //   const matchObjectTask = assignments.find((assignment) => assignment.agentId === mainObject.id);
      //
      //   if (matchObjectTask != undefined) {
      //     const obj: any = { ...mainObject, ...matchObjectTask };
      //     return obj;
      //   } else {
      //     const obj: any = { ...mainObject };
      //     return obj;
      //   }
      // });
      // const jointasks = getAData.map((mainObject) => {
      //   const matchObjectTask = tasks.find((e) => e.id === mainObject.taskId);
      //   if (matchObjectTask != undefined) {
      //     return { ...mainObject, ...matchObjectTask };
      //   } else {
      //     return { ...mainObject };
      //   }
      // });
      //
      // this.showagents = this.filteredAgents = jointasks.map((mainObject) => {
      //   const matchObjectAgents = chunks.find((e) => e.agentId === mainObject.agentId);
      //
      //   if (matchObjectAgents != undefined) {
      //     return { ...mainObject, ...matchObjectAgents };
      //   } else {
      //     return { ...mainObject };
      //   }
      // });
    });
  }

  /**
   * Fetch agent stats from server
   */
  getAgentStats() {
    const params = new RequestParamBuilder().setPageSize(this.maxResults).create();
    this.gs.getAll(SERV.AGENTS_STATS, params).subscribe((agentStatsResponse: ResponseWrapper) => {
      const agentStats = this.serializer.deserialize<JAgentStat[]>(agentStatsResponse);
      const tempDateFilter = agentStats.filter((agentStat) => agentStat.time > 10000000); // Temp
      this.statTemp = tempDateFilter.filter((u) => u.statType == ASC.GPU_TEMP); // Temp
      this.statDevice = tempDateFilter.filter((u) => u.statType == ASC.GPU_UTIL); // Temp
      this.statCpu = tempDateFilter.filter((u) => u.statType == ASC.CPU_UTIL); // Temp
    });
  }
}
