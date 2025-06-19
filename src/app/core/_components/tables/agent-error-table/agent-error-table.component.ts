import { AgentErrorTableCol, AgentErrorTableColumnLabel } from './agent-error-table.constants';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { formatSeconds, formatUnixTimestamp } from '@src/app/shared/utils/datetime';

import { A } from '@angular/cdk/activedescendant-key-manager.d-Bjic5obv';
import { AgentErrorDatasource } from '@src/app/core/_datasources/agent-error.datasource';
import { AgentsDataSource } from '@src/app/core/_datasources/agents.datasource';
import { BaseTableComponent } from '../base-table/base-table.component';
import { HTTableColumn } from '../ht-table/ht-table.models';
import { JAgentErrors } from '@src/app/core/_models/agent-errors.model';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-agent-error-table',
  templateUrl: './agent-error-table.component.html',
  styleUrl: './agent-error-table.component.scss',
  standalone: false
})
export class AgentErrorTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  @Input() agentId: number;
  tableColumns: HTTableColumn[] = [];
  dataSource: AgentErrorDatasource;
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    this.setColumnLabels(AgentErrorTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AgentErrorDatasource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);

    if (this.agentId) {
      this.dataSource.setAgentId(this.agentId);
    }
    console.log('AgentErrorTableComponent: ngOnInit', this.dataSource);
    this.dataSource.loadAll();
  }
  getColumns(): HTTableColumn[] {
    return [
      {
        id: AgentErrorTableCol.ID,
        render: (agentError: JAgentErrors) => agentError.id.toString()
      },
      {
        id: AgentErrorTableCol.TIME,
        render: (agentError: JAgentErrors) => this.renderDispatchTime(agentError)
      },
      {
        id: AgentErrorTableCol.TASK,
        render: (agentError: JAgentErrors) => agentError.taskId.toString()
      },
      {
        id: AgentErrorTableCol.CHUNK,
        render: (agentError: JAgentErrors) => {
          if (agentError.chunkId) {
            return agentError.chunkId.toString();
          }
          return 'N/A';
        }
      },
      {
        id: AgentErrorTableCol.MESSAGE,
        render: (agentError: JAgentErrors) => {
          if (agentError.error) {
            return this.sanitize(agentError.error);
          }
          return 'N/A';
        }
      }
    ];
  }
  renderDispatchTime(chunk: JAgentErrors): SafeHtml {
    const formattedDate = formatUnixTimestamp(chunk.time, this.dateFormat);

    return this.sanitize(formattedDate === '' ? 'N/A' : formattedDate);
  }
}
