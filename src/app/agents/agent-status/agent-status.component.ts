import { Component, OnInit } from '@angular/core';

import { ASC } from '@src/app/core/_constants/agentsc.config';
import { AgentStatusModalComponent } from '@src/app/agents/agent-status/agent-status-modal/agent-status-modal.component';
import { CookieService } from '@src/app/core/_services/shared/cookies.service';
import { FilterService } from '@src/app/core/_services/shared/filter.service';
import { GlobalService } from '@src/app/core/_services/main.service';
import { JAgent } from '@src/app/core/_models/agent.model';
import { JAgentStat } from '@src/app/core/_models/agent-stats.model';
import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';
import { MatDialog } from '@angular/material/dialog';
import { PageTitle } from '@src/app/core/_decorators/autotitle';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';
import { ResponseWrapper } from '@src/app/core/_models/response.model';
import { SERV } from '@src/app/core/_services/main.config';
import { UIConfigService } from '@src/app/core/_services/shared/storage.service';
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
  view: any;

  // Agents Stats
  statDevice: JAgentStat[] = [];
  statTemp: JAgentStat[] = [];
  statCpu: JAgentStat[] = [];

  private maxResults = environment.config.prodApiMaxResults;

  constructor(
    private filterService: FilterService,
    private cookieService: CookieService,
    private uiService: UIConfigService,
    private dialog: MatDialog,
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

  /**
   * Filter agents on filter changed
   * @param filterValue Value to filter agents for
   */
  filterChanged(filterValue: string) {
    if (filterValue && this.showagents) {
      filterValue = filterValue.toUpperCase();
      const props = ['agentName', 'id'];
      this._filteresAgents = this.filterService.filter<any>(this.showagents, filterValue, props);
    } else {
      this._filteresAgents = this.showagents;
    }
  }

  // Modal Agent utilisation and OffCanvas menu

  getTemp1() {
    // Temperature Config Setting
    return this.uiService.getUIsettings('agentTempThreshold1').value;
  }

  getTemp2() {
    // Temperature 2 Config Setting
    return this.uiService.getUIsettings('agentTempThreshold2').value;
  }

  getUtil1() {
    // CPU Config Setting
    return this.uiService.getUIsettings('agentUtilThreshold1').value;
  }

  getUtil2() {
    // CPU 2 Config Setting
    return this.uiService.getUIsettings('agentUtilThreshold2').value;
  }

  /**
   * Opens modal containing agent stat legend.
   * @param title Modal title
   * @param icon Modal icon
   * @param content Modal content
   * @param thresholdType
   * @param result
   * @param form
   */
  openModal(title: string, icon: string, content: string, thresholdType: string, result: any, form: any): void {
    const dialogRef = this.dialog.open(AgentStatusModalComponent, {
      data: { title, icon, content, thresholdType, result, form }
    });

    dialogRef.afterClosed().subscribe();
  }
}
