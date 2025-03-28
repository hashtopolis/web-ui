import { Agent, JAgent } from 'src/app/core/_models/agent.model';
import { AgentsViewTableCol, AgentsViewTableColumnLabel } from './agents-view-table.constants';
/* import {
  AgentsViewTableCol,
  AgentsViewTableColumnLabel
} from './agents-view-table.constants'; */
import { Component, OnDestroy, OnInit } from '@angular/core';

import { AgentsViewDataSource } from 'src/app/core/_datasources/agents-view.datasource';
import { BaseTableComponent } from '../base-table/base-table.component';
import { Cacheable } from 'src/app/core/_decorators/cacheable';
import { HTTableColumn } from '../ht-table/ht-table.models';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-agent-view-table',
  templateUrl: './agent-view-table.component.html',
  styleUrls: ['./agent-view-table.component.scss']
})
export class AgentViewTableComponent extends BaseTableComponent implements OnInit {
  tableColumns: HTTableColumn[] = [];
  dataSource: AgentsViewDataSource;
  // ngOnDestroy(): void {}
  ngOnInit(): void {
    this.setColumnLabels(AgentsViewTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AgentsViewDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.reload();
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
        routerLink: (agent: JAgent) => this.renderAgentLink(agent),
        render: (agent: JAgent) => agent.agentName
      },
      {
        id: AgentsViewTableCol.DEVICE_UTILISATION,
        dataKey: 'avgDevice',
        render: (agent: JAgent) => agent.avgDevice + '%'
      },
      {
        id: AgentsViewTableCol.TEMPERATURE,
        dataKey: 'maxTemp',
        render: (agent: JAgent) => agent.maxTemp + '°C'
      },
      {
        id: AgentsViewTableCol.CPU_UTILISATION,
        dataKey: 'avgCpu',
        render: (agent: JAgent) => agent.avgCpu + '%'
      }
    ];
    return tableColumns;
  }
}
