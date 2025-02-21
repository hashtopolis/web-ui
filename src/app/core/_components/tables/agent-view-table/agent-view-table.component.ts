import { Component, OnDestroy, OnInit } from '@angular/core';

import { AgentsStatusDataSource } from 'src/app/core/_datasources/agents-status.datasource';
import { AgentsStatusTableColumnLabel } from '../agents-status-table/agents-status-table.constants';
import { AgentsViewTableCol } from './agents-view-table.constants';
import { BaseDataSource } from 'src/app/core/_datasources/base.datasource';
import { BaseTableComponent } from '../base-table/base-table.component';
import { HTTableColumn } from '../ht-table/ht-table.models';

@Component({
  selector: 'app-agent-view-table',
  templateUrl: './agent-view-table.component.html',
  styleUrls: ['./agent-view-table.component.scss']
})
export class AgentViewTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  tableColumns: HTTableColumn[] = [];
  dataSource: AgentsStatusDataSource;
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit() {
    this.tableColumns = this.getColumns();
    this.setColumnLabels(AgentsStatusTableColumnLabel);
    this.dataSource = new AgentsStatusDataSource(
      this.cdr,
      this.gs,
      this.uiService
    );
  }
  getColumns(): HTTableColumn[] {
    const tableColumns: HTTableColumn[] = [
      {
        id: AgentsViewTableCol.ID,
        dataKey: '_id',
        isSortable: true
        //render: (agent: Agent) => agent._id,
        //export: async (agent: Agent) => agent._id + ''
      },
      {
        id: AgentsViewTableCol.NAME,
        dataKey: 'name',
        isSortable: true
        //async: (agent: Agent) => this.renderActiveAgent(agent),
        //export: async (agent: Agent) => (agent.isActive ? 'Active' : 'Inactive')
      },
      {
        id: AgentsViewTableCol.DEVICE_UTILISATION,
        dataKey: 'agentName',
        // render: (agent: Agent) => this.renderName(agent),
        //routerLink: (agent: Agent) => this.renderAgentLink(agent),
        isSortable: true
        //export: async (agent: Agent) => agent.agentName
      },
      {
        id: AgentsViewTableCol.TEMPERATURE,
        dataKey: 'isActive',
        //icons: (agent: Agent) => this.renderStatusIcon(agent),
        //render: (agent: Agent) => this.renderStatus(agent),
        isSortable: true
      },
      {
        id: AgentsViewTableCol.CPU_UTILISATION,
        dataKey: 'status',
        //async: (agent: Agent) => this.renderWorkingOn(agent),
        isSortable: false
        //export: async (agent: Agent) => (await this.renderWorkingOn(agent)) + ''
      }
    ];

    return tableColumns;
  }
}
