import { ASC } from '../../core/_constants/agentsc.config';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { CookieService } from 'src/app/core/_services/shared/cookies.service';
import { FilterService } from 'src/app/core/_services/shared/filter.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { environment } from 'src/environments/environment';
import { SERV } from '../../core/_services/main.config';
import { AgentStatusModalComponent } from './agent-status-modal/agent-status-modal.component';

@Component({
  selector: 'app-agent-status',
  templateUrl: './agent-status.component.html'
})
@PageTitle(['Agent Status'])
export class AgentStatusComponent implements OnInit {
  public isCollapsed = true;

  public statusOrderByName = environment.config.agents.statusOrderByName;
  public statusOrderBy = environment.config.agents.statusOrderBy;

  showagents: any[] = [];
  _filteresAgents: any[] = [];
  filterText = '';

  totalRecords = 0;
  pageSize = 20;

  private maxResults = environment.config.prodApiMaxResults;

  constructor(
    private filterService: FilterService,
    private cookieService: CookieService,
    private uiService: UIConfigService,
    private dialog: MatDialog,
    private gs: GlobalService
  ) {}

  // View Menu
  view: any;

  setView(value: string) {
    this.cookieService.setCookie('asview', value, 365);
    this.ngOnInit();
  }

  getView() {
    return this.cookieService.getCookie('asview');
  }

  get filteredAgents() {
    return this._filteresAgents;
  }

  set filteredAgents(value: any[]) {
    this._filteresAgents = value;
  }

  ngOnInit(): void {
    this.view = this.getView() || 0;
    this.getAgentsPage(1);
    this.getAgentStats();
  }

  pageChanged(page: number) {
    this.getAgentsPage(page);
  }

  getAgentsPage(page: number) {
    const params = { maxResults: this.maxResults };
    this.gs.getAll(SERV.AGENTS, params).subscribe((a: any) => {
      this.gs.getAll(SERV.AGENT_ASSIGN, params).subscribe((assign: any) => {
        this.gs.getAll(SERV.TASKS, params).subscribe((t: any) => {
          this.gs.getAll(SERV.CHUNKS, params).subscribe((c: any) => {
            const getAData = a.values.map((mainObject) => {
              const matchObjectTask = assign.values.find(
                (e) => e.agentId === mainObject.agentId
              );
              return { ...mainObject, ...matchObjectTask };
            });
            this.totalRecords = a.total;
            const jointasks = getAData.map((mainObject) => {
              const matchObjectTask = t.values.find(
                (e) => e.taskId === mainObject.taskId
              );
              return { ...mainObject, ...matchObjectTask };
            });

            this.showagents = this.filteredAgents = jointasks.map(
              (mainObject) => {
                const matchObjectAgents = c.values.find(
                  (e) => e.agentId === mainObject.agentId
                );
                return { ...mainObject, ...matchObjectAgents };
              }
            );
          });
        });
      });
    });
  }

  // Agents Stats
  statDevice: any[] = [];
  statTemp: any[] = [];
  statCpu: any[] = [];

  getAgentStats() {
    // const paramsstat = {'maxResults': this.maxResults, 'filter': 'time>'+this.gettime()+''}; //Waiting for API date filters
    const paramsstat = { maxResults: this.maxResults };
    this.gs.getAll(SERV.AGENTS_STATS, paramsstat).subscribe((stats: any) => {
      const tempDateFilter = stats.values.filter((u) => u.time > 10000000); // Temp
      // const tempDateFilter = stats.values.filter(u=> u.time > this.gettime()); // Temp
      this.statTemp = tempDateFilter.filter((u) => u.statType == ASC.GPU_TEMP); // Temp
      this.statDevice = tempDateFilter.filter(
        (u) => u.statType == ASC.GPU_UTIL
      ); // Temp
      this.statCpu = tempDateFilter.filter((u) => u.statType == ASC.CPU_UTIL); // Temp
    });
  }

  gettime() {
    const time =
      Date.now() - this.uiService.getUIsettings('agenttimeout').value;
    return time;
  }

  // On change filter

  filterChanged(data: string) {
    if (data && this.showagents) {
      data = data.toUpperCase();
      const props = ['agentName', 'agentId'];
      this._filteresAgents = this.filterService.filter<any>(
        this.showagents,
        data,
        props
      );
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

  openModal(
    title: string,
    icon: string,
    content: string,
    thresholdType: string,
    result: any,
    form: any
  ): void {
    const dialogRef = this.dialog.open(AgentStatusModalComponent, {
      data: { title, icon, content, thresholdType, result, form }
    });

    dialogRef.afterClosed().subscribe();
  }
}
