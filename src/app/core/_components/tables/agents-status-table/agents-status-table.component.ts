import { catchError, forkJoin } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { ActionMenuEvent } from '@src/app/core/_components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@src/app/core/_components/menus/bulk-action-menu/bulk-action-menu.constants';
import { ExportMenuAction } from '@src/app/core/_components/menus/export-menu/export-menu.constants';
import { RowActionMenuAction } from '@src/app/core/_components/menus/row-action-menu/row-action-menu.constants';
import {
  AgentsStatusTableCol,
  AgentsStatusTableColumnLabel
} from '@src/app/core/_components/tables/agents-status-table/agents-status-table.constants';
import { BaseTableComponent } from '@src/app/core/_components/tables/base-table/base-table.component';
import { HTTableColumn, HTTableRouterLink } from '@src/app/core/_components/tables/ht-table/ht-table.models';
import { TableDialogComponent } from '@src/app/core/_components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@src/app/core/_components/tables/table-dialog/table-dialog.model';
import { AgentsStatusDataSource } from '@src/app/core/_datasources/agents-status.datasource';
import { JAgent } from '@src/app/core/_models/agent.model';
import { SERV } from '@src/app/core/_services/main.config';
import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';

@Component({
  selector: 'app-agents-status-table',
  templateUrl: './agents-status-table.component.html',
  standalone: false
})
export class AgentsStatusTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  tableColumns: HTTableColumn[] = [];
  dataSource: AgentsStatusDataSource;

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.setColumnLabels(AgentsStatusTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AgentsStatusDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.reload();
  }

  filter(item: JAgent, filterValue: string): boolean {
    return (
      item.agentName.toLowerCase().includes(filterValue) ||
      item.clientSignature.toLowerCase().includes(filterValue) ||
      item.devices.toLowerCase().includes(filterValue)
    );
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: AgentsStatusTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        render: (agent: JAgent) => agent.id,
        export: async (agent: JAgent) => agent.id + ''
      },
      {
        id: AgentsStatusTableCol.STATUS,
        dataKey: 'status',
        isSortable: true,
        render: (agent: JAgent) => this.renderActiveAgent(agent),
        export: async (agent: JAgent) => this.renderActiveAgent(agent)
      },
      {
        id: AgentsStatusTableCol.NAME,
        dataKey: 'agentName',
        routerLinkNoCache: (agent: JAgent) => this.renderAgentLink(agent),
        isSortable: true,
        export: async (agent: JAgent) => agent.agentName
      },
      {
        id: AgentsStatusTableCol.AGENT_STATUS,
        dataKey: 'isActive',
        iconsNoCache: (agent: JAgent) => this.renderStatusIcon(agent),
        render: (agent: JAgent) => this.renderStatus(agent),
        export: async (agent: JAgent) => (agent.isActive ? 'Active' : 'Inactive'),
        isSortable: true
      },
      {
        id: AgentsStatusTableCol.WORKING_ON,
        dataKey: 'workingOn',
        render: (agent: JAgent) => this.renderWorkingOn(agent),
        isSortable: false,
        export: async (agent: JAgent) => this.exportWorkingOn(agent) + ''
      },
      {
        id: AgentsStatusTableCol.ASSIGNED,
        dataKey: 'taskName',
        isSortable: true,
        render: (agent: JAgent) => agent.taskName,
        routerLinkNoCache: (agent: JAgent) => this.renderTaskLink(agent),
        export: async (agent: JAgent) => agent.taskName
      },
      {
        id: AgentsStatusTableCol.LAST_ACTIVITY,
        dataKey: 'lastTime',
        render: (agent: JAgent) => this.renderLastActivity(agent),
        isSortable: true,
        export: async (agent: JAgent) => formatUnixTimestamp(agent.lastTime, this.dateFormat)
      }
    ];
  }

  openDialog(data: DialogData<JAgent>) {
    const dialogRef = this.dialog.open(TableDialogComponent, {
      data: data,
      width: '450px'
    });

    this.subscriptions.push(
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.action) {
          switch (result.action) {
            case RowActionMenuAction.DELETE:
              this.rowActionDelete(result.data);
              break;
            case BulkActionMenuAction.ACTIVATE:
              this.bulkActionActivate(result.data, true);
              break;
            case BulkActionMenuAction.DEACTIVATE:
              this.bulkActionActivate(result.data, false);
              break;
            case BulkActionMenuAction.DELETE:
              this.bulkActionDelete(result.data);
              break;
          }
        }
      })
    );
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<JAgent[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<JAgent>(
          'hashtopolis-agents',
          this.tableColumns,
          event.data,
          AgentsStatusTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<JAgent>(
          'hashtopolis-agents',
          this.tableColumns,
          event.data,
          AgentsStatusTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService.toClipboard<JAgent>(this.tableColumns, event.data, AgentsStatusTableColumnLabel).then(() => {
          this.snackBar.open('The selected rows are copied to the clipboard', 'Close');
        });
        break;
    }
  }
  rowActionClicked(event: ActionMenuEvent<JAgent>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.EDIT:
        this.rowActionEdit(event.data);
        break;
      case RowActionMenuAction.ACTIVATE:
        this.bulkActionActivate([event.data], true);
        break;
      case RowActionMenuAction.DEACTIVATE:
        this.bulkActionActivate([event.data], false);
        break;

      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting '${event.data.agentName}' ...`,
          icon: 'warning',
          body: `Are you sure you want to delete '${event.data.agentName}'? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<JAgent[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.ACTIVATE:
        this.openDialog({
          rows: event.data,
          title: `Activating ${event.data.length} agents ...`,
          icon: 'info',
          listAttribute: 'agentName',
          action: event.menuItem.action
        });
        break;
      case BulkActionMenuAction.DEACTIVATE:
        this.openDialog({
          rows: event.data,
          title: `Deactivating ${event.data.length} agents ...`,
          icon: 'info',
          listAttribute: 'agentName',
          action: event.menuItem.action
        });
        break;
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} agents ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above agents? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'agentName',
          action: event.menuItem.action
        });
        break;
    }
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionActivate(agents: JAgent[], isActive: boolean): void {
    const requests = agents.map((agent: JAgent) => {
      return this.gs.update(SERV.AGENTS, agent.id, { isActive: isActive });
    });

    const action = isActive ? 'activated' : 'deactivated';

    this.subscriptions.push(
      forkJoin(requests)
        .pipe(
          catchError((error) => {
            console.error('Error during activation:', error);
            return [];
          })
        )
        .subscribe((results) => {
          this.snackBar.open(`Successfully ${action} ${results.length} agents!`, 'Close');
          this.dataSource.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(agents: JAgent[]): void {
    const requests = agents.map((agent: JAgent) => {
      return this.gs.delete(SERV.AGENTS, agent.id);
    });

    this.subscriptions.push(
      forkJoin(requests)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe((results) => {
          this.snackBar.open(`Successfully deleted ${results.length} agents!`, 'Close');
          this.dataSource.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(agent: JAgent): void {
    this.subscriptions.push(
      this.gs.delete(SERV.AGENTS, agent[0].id).subscribe(() => {
        this.snackBar.open('Successfully deleted agent!', 'Close');
        this.dataSource.reload();
      })
    );
  }

  private rowActionEdit(agent: JAgent): void {
    this.renderAgentLink(agent).subscribe((links: HTTableRouterLink[]) => {
      this.router.navigate(links[0].routerLink).then(() => {});
    });
  }

  /**
   * Render message, if agent is working on a task or in idle mode
   * @param agent - agent instance to check state for
   * @return message containing the current agent state
   * @private
   */
  private renderActiveAgent(agent: JAgent): string {
    return agent.agentSpeed > 0 ? 'Running task' : 'Stopped task';
  }

  /**
   * Render agent status - active or inactive
   * @param agent - agent instance to check state for
   * @return html code containing current state and an icon for the state
   * @private
   */
  private renderStatus(agent: JAgent): SafeHtml {
    let html: string;
    if (agent.isActive) {
      html = '<span class="pill pill-active">Active</span>';
    } else {
      html = '<span class="pill pill-inactive">Inactive</span>';
    }
    return this.sanitize(html);
  }

  /**
   * Render agent information conecnrning the task, agent is working on at the moment
   * @param agent - agent instance to check working state for
   * @return html code containing task information, if agent is processing a task
   * @private
   */
  private renderWorkingOn(agent: JAgent): SafeHtml {
    let html = '';
    if (agent.agentSpeed) {
      html = `
        <div>
        <div>Task: <a href="/tasks/show-tasks/${agent.taskId}/edit">${agent.taskName}</a></div>
        <div>at ${agent.agentSpeed} H/s,<br></div>
        <div>working on chunk <a href="/tasks/chunks/${agent.chunkId}/view">${agent.chunkId}</a></div>
        </div>
      `;
    }

    return this.sanitize(html);
  }

  /**
   * Export working on information
   * @param agent - agent instance to check state for
   * @return html code containing task information, if agent is processing a task
   * @private
   */
  private exportWorkingOn(agent: JAgent): SafeHtml {
    if (agent.agentSpeed) {
      return `Task: ${agent.taskName} at ${agent.agentSpeed} H/s, working on chunk ${agent.chunkId}`;
    } else {
      return '-';
    }
  }

  /**
   * Render information abaout task's last activity
   * @return html code containing task information, if agent is processing a task
   * @return html code containing information abaout tasks last activity
   * @private
   */
  private renderLastActivity(agent: JAgent): SafeHtml {
    const formattedDate = formatUnixTimestamp(agent.lastTime, this.dateFormat);
    const action = `Action: ${agent.lastAct}<br>`;
    const time = `Time: ${formattedDate}<br>`;
    const ip = agent.lastIp ? `<div>IP: ${agent.lastIp}</div>` : '';

    const data = `${action}${time}${ip}`;
    return this.sanitize(data);
  }
}
