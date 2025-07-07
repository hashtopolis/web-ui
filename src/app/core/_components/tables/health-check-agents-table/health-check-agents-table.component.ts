import { Observable, of } from 'rxjs';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { JHealthCheckAgent } from '@models/health-check.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import {
  HealthCheckAgentsTableCol,
  HealthCheckAgentsTableColColumnLabel
} from '@components/tables/health-check-agents-table/health-check-agents-table.constants';
import { HealthChecksTableStatusLabel } from '@components/tables/health-checks-table/health-checks-table.constants';
import { HTTableColumn, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';

import { HealthCheckAgentsDataSource } from '@datasources/health-check-agents.datasource';

import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';

@Component({
  selector: 'app-health-check-agents-table',
  templateUrl: './health-check-agents-table.component.html',
  standalone: false
})
export class HealthCheckAgentsTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  @Input() healthCheckId = 0;

  tableColumns: HTTableColumn[] = [];
  dataSource: HealthCheckAgentsDataSource;

  ngOnInit(): void {
    this.setColumnLabels(HealthCheckAgentsTableColColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new HealthCheckAgentsDataSource(this.injector);
    if (this.healthCheckId) {
      this.dataSource.setHealthCheckId(this.healthCheckId);
    }
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: JHealthCheckAgent, filterValue: string): boolean {
    return item.agentName.toLowerCase().includes(filterValue) || item.status.toString().includes(filterValue);
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: HealthCheckAgentsTableCol.AGENT_ID,
        dataKey: 'healthCheckAgentId',
        isSortable: true,
        export: async (HealthCheckAgent: JHealthCheckAgent) => HealthCheckAgent.healthCheckAgentId + ''
      },
      {
        id: HealthCheckAgentsTableCol.AGENT_NAME,
        dataKey: 'agentName',
        routerLink: (HealthCheckAgent: JHealthCheckAgent) => this.renderAgentLinkFromHealthCheck(HealthCheckAgent),
        isSortable: true,
        export: async (HealthCheckAgent: JHealthCheckAgent) => HealthCheckAgent.agentName + ''
      },
      {
        id: HealthCheckAgentsTableCol.STATUS,
        dataKey: 'status',
        render: (HealthCheckAgent: JHealthCheckAgent) => HealthChecksTableStatusLabel[HealthCheckAgent.status],
        isSortable: true,
        export: async (HealthCheckAgent: JHealthCheckAgent) => HealthChecksTableStatusLabel[HealthCheckAgent.status]
      },
      {
        id: HealthCheckAgentsTableCol.START,
        dataKey: 'start',
        isSortable: true,
        render: (HealthCheckAgent: JHealthCheckAgent) => formatUnixTimestamp(HealthCheckAgent.start, this.dateFormat),
        export: async (HealthCheckAgent: JHealthCheckAgent) =>
          formatUnixTimestamp(HealthCheckAgent.start, this.dateFormat)
      },
      {
        id: HealthCheckAgentsTableCol.GPUS,
        dataKey: 'numGpus',
        isSortable: true,
        export: async (HealthCheckAgent: JHealthCheckAgent) => HealthCheckAgent.numGpus + ''
      },
      {
        id: HealthCheckAgentsTableCol.ERRORS,
        dataKey: 'errors',
        isSortable: true,
        export: async (HealthCheckAgent: JHealthCheckAgent) => HealthCheckAgent.errors + ''
      }
    ];
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<JHealthCheckAgent[]>): void {
    this.exportService.handleExportAction<JHealthCheckAgent>(
      event,
      this.tableColumns,
      HealthCheckAgentsTableColColumnLabel,
      'hashtopolis-health-checks-view'
    );
  }

  /**
   * Render agent edit link to be displayed in HTML code from healthcheck
   * @param healthCheck - HealthCheck model to render agent router link for
   * @return observable object containing a router link array
   */
  private renderAgentLinkFromHealthCheck(healthCheck: JHealthCheckAgent): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (healthCheck) {
      links.push({
        routerLink: ['/agents', 'show-agents', healthCheck.agentId, 'edit'],
        label: healthCheck.agentName
      });
    }
    return of(links);
  }
}
