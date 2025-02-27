/* import {
  AgentsViewTableCol,
  AgentsViewTableColumnLabel
} from './agents-view-table.constants'; */
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Agent } from 'src/app/core/_models/agent.model';
import { AgentsViewDataSource } from 'src/app/core/_datasources/agents-view.datasource';
import { BaseTableComponent } from '../base-table/base-table.component';
import { HTTableColumn } from '../ht-table/ht-table.models';

@Component({
  selector: 'app-agent-view-table',
  templateUrl: './agent-view-table.component.html',
  styleUrls: ['./agent-view-table.component.scss']
})
export class AgentViewTableComponent
  extends BaseTableComponent
  implements OnInit
{
  tableColumns: HTTableColumn[] = [];
  dataSource: AgentsViewDataSource;
  // ngOnDestroy(): void {}
  ngOnInit(): void {
    // this.setColumnLabels(AgentsViewTableColumnLabel);
    this.dataSource = new AgentsViewDataSource(
      this.cdr,
      this.gs,
      this.uiService
    );
    this.dataSource.reload();
  }
  getColumns(): HTTableColumn[] {
    const tableColumns: HTTableColumn[] = [
      {
        id: 0,
        dataKey: 'id'
      }
    ];
    return tableColumns;
  }
}
