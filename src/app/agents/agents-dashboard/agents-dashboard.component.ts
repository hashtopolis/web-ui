import { ASC } from '@constants/agentsc.config';
import { Subscription, firstValueFrom } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { JAgentStat } from '@models/agent-stats.model';
import { JAgent } from '@models/agent.model';
import { UIConfig, uiConfigDefault } from '@models/config-ui.model';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { CoreComponentsModule } from '@components/core-components.module';
import { STATCALCULATION } from '@components/tables/agents-status-table/agents-status-table.component';

import { AgentsDashboardTileComponent } from '@src/app/agents/agents-dashboard-tile/agents-dashboard-tile.component';
import { PageTitleModule } from '@src/app/shared/page-headers/page-title.module';
import { TableModule } from '@src/app/shared/table/table-actions.module';
import { UISettingsUtilityClass } from '@src/app/shared/utils/config';
import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';

@Component({
  selector: 'app-agents-dashboard',
  standalone: true,
  imports: [CommonModule, AgentsDashboardTileComponent, CoreComponentsModule, PageTitleModule, TableModule],
  templateUrl: './agents-dashboard.component.html',
  styleUrls: ['./agents-dashboard.component.scss']
})
export class AgentsDashboardComponent implements OnInit {
  protected uiSettings: UISettingsUtilityClass;
  protected uiService: UIConfigService;

  agents: JAgent[] = [];

  /**
   * Array to hold subscriptions for cleanup on component destruction.
   * This prevents memory leaks by unsubscribing from observables when the component is destroyed.
   */
  subscriptions: Subscription[] = [];

  // Agent stats intervall to define the max time period agent stats will be retrieved, current preset to 24h
  private AGENTSTATS_INTERVALL: number = 3600000 * 24;

  constructor(
    private gs: GlobalService,
    protected settingsService: LocalStorageService<UIConfig>
  ) {
    this.uiSettings = new UISettingsUtilityClass(settingsService);
  }

  ngOnInit(): void {
    this.loadAgents();
  }

  /**
   * Load all agents and their related statistics for the last 24h
   * @private
   */
  private loadAgents() {
    const params = new RequestParamBuilder().create();
    this.subscriptions.push(
      this.gs.getAll(SERV.AGENTS, params).subscribe(async (response: ResponseWrapper) => {
        const agents = new JsonAPISerializer().deserialize<JAgent[]>({
          data: response.data,
          included: response.included
        });

        //Load Agent Stats
        if (agents && agents.length > 0) {
          const agentIds = agents.map((agent) => agent.id);

          const [agentStats] = await Promise.all([this.loadAgentStats(agentIds)]);

          agents.forEach((agent: JAgent) => {
            agent.agentStats = agentStats.filter((entry) => entry.agentId === agent.id);
          });
        }

        this.agents = agents ?? [];
      })
    );
  }

  /**
   * Load related agent statistics for the last 24h
   * @param agentIds
   * @private
   */
  private async loadAgentStats(agentIds: Array<number>) {
    const agentStatParams = new RequestParamBuilder()
      .addFilter({
        field: 'agentId',
        operator: FilterType.IN,
        value: agentIds
      })
      .addFilter({
        field: 'time',
        operator: FilterType.GREATER,
        value: Math.floor((Date.now() - this.AGENTSTATS_INTERVALL) / 1000)
      });
    const response: ResponseWrapper = await firstValueFrom(this.gs.getAll(SERV.AGENTS_STATS, agentStatParams.create()));
    const responseBody = { data: response.data, included: response.included };
    return new JsonAPISerializer().deserialize<JAgentStat[]>(responseBody);
  }

  /**
   * Formats a Unix timestamp into a date-time string using a custom format.
   * @param timestamp
   */
  getLastActivity(timestamp: number): string {
    return formatUnixTimestamp(timestamp, this.getDateFormat());
  }

  getMaxOrAvgValue(agent: JAgent, statType: ASC, avgOrMax: STATCALCULATION): number {
    const stat = agent.agentStats.filter((u) => u.statType == statType);
    if (stat && stat.length > 0) {
      switch (avgOrMax) {
        case 1:
          return Math.round(stat.map((element) => element.value[0]).reduce((a, b) => a + b) / stat.length);
        case 2:
          return Math.round(stat.map((element) => element.value[0]).reduce((a, b) => Math.max(a, b)));
      }
    }
    return 0;
  }

  /**
   * Determines the status based on the cpuLoad
   * @param cpuLoad
   */
  getCPULoadStatus(cpuLoad: number): string {
    if (cpuLoad === 0) return 'error';
    if (cpuLoad <= 75) return 'critical';
    if (cpuLoad <= 90) return 'warning';
    if (cpuLoad > 90) return 'ok';
    return 'ok';
  }

  /**
   * Determines the status based on the gpuLoad
   * @param gpuLoad
   */
  getGPULoadStatus(gpuLoad: number): string {
    if (gpuLoad === 0) return 'error';
    if (gpuLoad <= 75) return 'critical';
    if (gpuLoad <= 90) return 'warning';
    if (gpuLoad > 90) return 'ok';
    return 'ok';
  }

  /**
   * Determines the status based on the gpuTemp
   * @param gpuTemp
   */
  getGPUTempStatus(gpuTemp: number): string {
    if (gpuTemp === 0) return 'error';
    if (gpuTemp <= 70) return 'warning';
    if (gpuTemp <= 80) return 'critical';
    if (gpuTemp > 80) return 'error';
    return 'ok';
  }

  /**
   * Determines the css-class for the tiles
   * @param agent
   */
  getAgentStatusTileClass(agent: JAgent) {
    const classes: string[] = [];

    if (!agent.isActive) {
      classes.push('disabled');
    } else if (agent.agentSpeed == 0) {
      classes.push('idle');
    } else if (this.getAgentStatus(agent) === 'error') {
      classes.push('fehlerhaft');
    }

    return classes;
  }

  /**
   * Determines the css-class and the content for the single agent statuses
   * @param agent
   */
  getAgentStatus(agent: JAgent) {
    if (!agent.isActive) {
      return 'disabled';
    } else {
      const status: string[] = [];

      status.push(this.getCPULoadStatus(this.getMaxOrAvgValue(agent, ASC.CPU_UTIL, STATCALCULATION.AVG_VALUE)));
      status.push(this.getGPULoadStatus(this.getMaxOrAvgValue(agent, ASC.GPU_UTIL, STATCALCULATION.AVG_VALUE)));
      status.push(this.getGPUTempStatus(this.getMaxOrAvgValue(agent, ASC.GPU_TEMP, STATCALCULATION.MAX_VALUE)));

      if (status.length > 0 && status.includes('error')) {
        return 'error';
      } else if (status.length > 0 && status.includes('critical')) {
        return 'critical';
      } else if (status.length > 0 && status.includes('warning')) {
        return 'warning';
      } else {
        return 'ok';
      }
    }
  }

  /**
   * Define the icons for the individual agents based on the agent status.
   * @param agent
   */
  getAgentIcon(agent: JAgent) {
    if (this.getAgentStatus(agent) === 'error') {
      return 'fa-exclamation-triangle';
    } else {
      return 'fa-server';
    }
  }

  /**
   * Retrieves the date format for rendering timestamps.
   * @returns The date format string.
   */
  private getDateFormat(): string {
    const fmt = this.uiSettings.getSetting<string>('timefmt');

    return fmt ? fmt : uiConfigDefault.timefmt;
  }

  protected readonly ASC = ASC;
  protected readonly STATCALCULATION = STATCALCULATION;
}
