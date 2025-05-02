import { AgentsViewTableCol, AgentsViewTableColumnLabel } from './agents-view-table.constants';
/* import {
  AgentsViewTableCol,
  AgentsViewTableColumnLabel
} from './agents-view-table.constants'; */
import { Component, OnDestroy, OnInit } from '@angular/core';

import { ASC } from '@src/app/core/_constants/agentsc.config';
import { AgentsViewDataSource } from 'src/app/core/_datasources/agents-view.datasource';
import { BaseTableComponent } from '../base-table/base-table.component';
import { HTTableColumn } from '../ht-table/ht-table.models';
import { JAgent } from 'src/app/core/_models/agent.model';
import { NgStyle } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';

export class STATCALCULATION {
  public static AVG_VALUE = 1;
  public static MAX_VALUE = 2;
}
@Component({
  selector: 'app-agent-view-table',
  templateUrl: './agent-view-table.component.html',
  styleUrls: ['./agent-view-table.component.scss'],
  standalone: false
})
export class AgentViewTableComponent extends BaseTableComponent implements OnInit {
  tableColumns: HTTableColumn[] = [];
  dataSource: AgentsViewDataSource;

  ngOnInit(): void {
    this.setColumnLabels(AgentsViewTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AgentsViewDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.reload();
  }
  renderStatus(agent: JAgent): SafeHtml {
    let html: string;
    if (agent.isActive) {
      html = '<span class="pill pill-active">Active</span>';
    } else {
      html = '<span class="pill pill-inactive">Inactive</span>';
    }

    return this.sanitize(html);
  }
  getColumns(): HTTableColumn[] {
    const tableColumns: HTTableColumn[] = [
      {
        id: AgentsViewTableCol.ID,
        dataKey: '_id',
        render: (agent: JAgent) => agent.id
      },
      {
        id: AgentsViewTableCol.NAME,
        dataKey: 'agentName',
        icons: (agent: JAgent) => this.renderStatusIcon(agent),
        routerLink: (agent: JAgent) => this.renderAgentLink(agent),
        render: (agent: JAgent) => agent.agentName
      },
      {
        id: AgentsViewTableCol.DEVICE_UTILISATION,
        dataKey: 'avgDevice',
        render: (agent: JAgent) => this.getMaxOrAvgValue(agent, ASC.GPU_UTIL, STATCALCULATION.AVG_VALUE) + '%',
        customCellColor2: (agent: JAgent) => this.getMaxOrAvgValue(agent, ASC.GPU_UTIL, STATCALCULATION.AVG_VALUE)
      },
      {
        id: AgentsViewTableCol.TEMPERATURE,
        dataKey: 'maxTemp',
        render: (agent: JAgent) => this.getMaxOrAvgValue(agent, ASC.GPU_TEMP, STATCALCULATION.MAX_VALUE) + '°C',
        customCellColor2: (agent: JAgent) => this.getMaxOrAvgValue(agent, ASC.GPU_TEMP, STATCALCULATION.MAX_VALUE)
      },
      {
        id: AgentsViewTableCol.CPU_UTILISATION,
        dataKey: 'avgCpu',
        render: (agent: JAgent) => this.getMaxOrAvgValue(agent, ASC.CPU_UTIL, STATCALCULATION.AVG_VALUE) + '%',
        customCellColor2: (agent: JAgent) => this.getMaxOrAvgValue(agent, ASC.CPU_UTIL, STATCALCULATION.AVG_VALUE)
      },
      {
        id: AgentsViewTableCol.LAST_ACTIVITY,
        dataKey: 'lastTime',
        render: (agent: JAgent) => 'Time: ' + formatUnixTimestamp(agent.lastTime, this.dateFormat)
      }
    ];
    return tableColumns;
  }
  private getMaxOrAvgValue(agent: JAgent, statType: ASC, avgOrMax: STATCALCULATION) {
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
  }
}
