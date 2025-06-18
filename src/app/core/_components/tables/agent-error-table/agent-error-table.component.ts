import { Component, OnDestroy, OnInit } from '@angular/core';

import { AgentErrorDatasource } from '@src/app/core/_datasources/agent-error.datasource';
import { AgentsDataSource } from '@src/app/core/_datasources/agents.datasource';
import { BaseTableComponent } from '../base-table/base-table.component';

@Component({
  selector: 'app-agent-error-table',
  templateUrl: './agent-error-table.component.html',
  styleUrl: './agent-error-table.component.scss',
  standalone: false
})
export class AgentErrorTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  dataSource: AgentErrorDatasource;
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    this.dataSource = new AgentErrorDatasource(this.cdr, this.gs, this.uiService);
    this.dataSource.reload();
  }
}
