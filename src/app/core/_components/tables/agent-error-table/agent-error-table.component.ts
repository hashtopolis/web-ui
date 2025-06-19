import { AgentErrorTableCol, AgentErrorTableColumnLabel } from './agent-error-table.constants';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HTTableIcon, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';
import { formatSeconds, formatUnixTimestamp } from '@src/app/shared/utils/datetime';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
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
  ngOnDestroy(): void {}
  ngOnInit(): void {
    this.setColumnLabels(AgentErrorTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AgentErrorDatasource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);

    if (this.agentId) {
      this.dataSource.setAgentId(this.agentId);
    }
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
        id: AgentErrorTableCol.TASK_ID,
        routerLink: (agentError: JAgentErrors) => this.renderTaskLink(agentError, true)
      },
      {
        id: AgentErrorTableCol.TASK,
        routerLink: (agentError: JAgentErrors) => this.renderTaskLink(agentError)
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

  rowActionClicked(event: ActionMenuEvent<JAgentErrors>): void {
    console.log('Row action clicked:', event);
  }
  bulkActionClicked(event: ActionMenuEvent<JAgentErrors[]>): void {
    console.log('Bulk action clicked:', event);
  }
  exportActionClicked(event: ActionMenuEvent<JAgentErrors>): void {
    console.log('Export action clicked:', event);
  }
  renderDispatchTime(chunk: JAgentErrors): SafeHtml {
    const formattedDate = formatUnixTimestamp(chunk.time, this.dateFormat);

    return this.sanitize(formattedDate === '' ? 'N/A' : formattedDate);
  }
}
