import {
  AgentsStatusTableCol,
  AgentsStatusTableColumnLabel
} from '@src/app/core/_components/tables/agents-status-table/agents-status-table.constants';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HTTableColumn, HTTableRouterLink } from '@src/app/core/_components/tables/ht-table/ht-table.models';
import { catchError, forkJoin } from 'rxjs';

import { ASC } from '@src/app/core/_constants/agentsc.config';
import { ActionMenuEvent } from '@src/app/core/_components/menus/action-menu/action-menu.model';
import { AgentViewDialogComponent } from '@src/app/shared/dialog/agent-view-dialog/agent-view-dialog.component';
import { AgentsDataSource } from '@datasources/agents.datasource';
import { BaseTableComponent } from '@src/app/core/_components/tables/base-table/base-table.component';
import { BulkActionMenuAction } from '@src/app/core/_components/menus/bulk-action-menu/bulk-action-menu.constants';
import { DialogData } from '@src/app/core/_components/tables/table-dialog/table-dialog.model';
import { ExportMenuAction } from '@src/app/core/_components/menus/export-menu/export-menu.constants';
import { JAgent } from '@src/app/core/_models/agent.model';
import { RowActionMenuAction } from '@src/app/core/_components/menus/row-action-menu/row-action-menu.constants';
import { SERV } from '@src/app/core/_services/main.config';
import { STATCALCULATION } from '../agent-view-table/agent-view-table.component';
import { SafeHtml } from '@angular/platform-browser';
import { TableDialogComponent } from '@src/app/core/_components/tables/table-dialog/table-dialog.component';
import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';

@Component({
  selector: 'app-agents-status-table',
  templateUrl: './agents-status-table.component.html',
  standalone: false
})
export class AgentsStatusTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  tableColumns: HTTableColumn[] = [];
  dataSource: AgentsDataSource;

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.setColumnLabels(AgentsStatusTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AgentsDataSource(this.cdr, this.gs, this.uiService);
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
        routerLink: (agent: JAgent) => this.renderAgentLink(agent),
        isSortable: true,
        export: async (agent: JAgent) => agent.agentName
      },
      {
        id: AgentsStatusTableCol.AGENT_STATUS,
        dataKey: 'isActive',
        icon: (agent: JAgent) => this.renderStatusIcon(agent),
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
        routerLink: (agent: JAgent) => this.renderTaskLink(agent),
        export: async (agent: JAgent) => agent.taskName
      },
      {
        id: AgentsStatusTableCol.LAST_ACTIVITY,
        dataKey: 'lastTime',
        render: (agent: JAgent) => this.renderLastActivity(agent),
        isSortable: true,
        export: async (agent: JAgent) => formatUnixTimestamp(agent.lastTime, this.dateFormat)
      },
      {
        id: AgentsStatusTableCol.DEVICE_UTILISATION,
        dataKey: 'avgDevice',
        isSortable: false,
        render: (agent: JAgent) => {
          if (agent.isActive) {
            return this.getMaxOrAvgValue(agent, ASC.GPU_UTIL, STATCALCULATION.AVG_VALUE) + '%';
          } else {
            return 'No data';
          }
        },
        customCellColor: {
          value: (agent: JAgent) => this.getMaxOrAvgValue(agent, ASC.GPU_TEMP, STATCALCULATION.AVG_VALUE),
          treshold1: this.getUtil1(),
          treshold2: this.getUtil2(),
          type: ASC.GPU_UTIL,
          isActive: (agent: JAgent) => agent.isActive,
          lastTime: (agent: JAgent) => agent.lastTime
        }
      },
      {
        id: AgentsStatusTableCol.TEMPERATURE,
        dataKey: 'maxTemp',
        isSortable: true,
        render: (agent: JAgent) => {
          if (agent.isActive) {
            return this.getMaxOrAvgValue(agent, ASC.GPU_TEMP, STATCALCULATION.MAX_VALUE) + '°C';
          } else {
            return 'No data';
          }
        },
        customCellColor: {
          value: (agent: JAgent) => this.getMaxOrAvgValue(agent, ASC.GPU_TEMP, STATCALCULATION.MAX_VALUE),
          treshold1: this.getTemp1(),
          treshold2: this.getTemp2(),
          type: ASC.GPU_UTIL,
          isActive: (agent: JAgent) => agent.isActive,
          lastTime: (agent: JAgent) => agent.lastTime
        }
      },
      {
        id: AgentsStatusTableCol.CPU_UTILISATION,
        dataKey: 'avgCpu',
        isSortable: true,
        render: (agent: JAgent) => {
          if (agent.isActive) {
            return this.getMaxOrAvgValue(agent, ASC.CPU_UTIL, STATCALCULATION.AVG_VALUE) + '%';
          } else {
            return 'No data';
          }
        },
        customCellColor: {
          value: (agent: JAgent) => this.getMaxOrAvgValue(agent, ASC.CPU_UTIL, STATCALCULATION.AVG_VALUE),
          treshold1: this.getUtil1(),
          treshold2: this.getUtil2(),
          type: ASC.CPU_UTIL,
          isActive: (agent: JAgent) => agent.isActive,
          lastTime: (agent: JAgent) => agent.lastTime
        }
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
    /*     const ip = agent.lastIp ? `<div>IP: ${agent.lastIp}</div>` : ''; */
/*     const data = `${action}${time}${ip}`; */
    const data = `${action}${time}`;
    return this.sanitize(data);
  }
  private getMaxOrAvgValue(agent: JAgent, statType: ASC, avgOrMax: STATCALCULATION) {
    const tempDateFilter = agent.agentStats.filter((u) => u.time > 10000000);
    const stat = tempDateFilter.filter((u) => u.statType == statType);
    if (stat && stat.length > 0) {
      switch (avgOrMax) {
        case 1:
          return Math.round(
            stat.reduce((sum, current) => sum + current.value.reduce((a, b) => a + b, 0), 0) / stat.length
          );
        case 2:
          return Math.round(stat.reduce((prev, current) => (prev.value > current.value ? prev : current)).value[0]);
        default:
          return 0; // Provide a default value for unhandled cases
      }
    }
    return 0;
  }
  // Modal Agent utilisation and OffCanvas menu

  getTemp1() {
    // Temperature Config Setting
    return this.uiService.getUIsettings('agentTempThreshold1').value;
  }

  getTemp2() {
    // Temperature 2 Config Setting
    return this.uiService.getUIsettings('agentTempThreshold2').value;
  }

  getUtil1() {
    // CPU Config Setting
    return this.uiService.getUIsettings('agentUtilThreshold1').value;
  }

  getUtil2() {
    // CPU 2 Config Setting
    return this.uiService.getUIsettings('agentUtilThreshold2').value;
  }
  /**
   * Opens modal containing agent stat legend.
   * @param title Modal title
   * @param icon Modal icon
   * @param content Modal content
   * @param thresholdType
   * @param result
   * @param form
   */
  openStatDialog(): void {
    const dialogRef = this.dialog.open(AgentViewDialogComponent, {
      data: {
        agentData: [
          {
            tabName: 'GPU Utilization',
            icon: 'devices',
            threshold1: this.getUtil1(),
            threshold2: this.getUtil2(),
            unitLabel: '%',
            statusLabel: 'GPU Utilization'
          },
          {
            tabName: ' GPU Temperature',
            icon: 'device_thermostat',
            threshold1: this.getTemp1(),
            threshold2: this.getTemp2(),
            unitLabel: '°',
            statusLabel: ' GPU Temperature'
          },
          {
            tabName: 'CPU Utilisation',
            icon: 'computer',
            threshold1: this.getUtil1(),
            threshold2: this.getUtil2(),
            unitLabel: '%',
            statusLabel: 'CPU Utilisation'
          }
        ]
      }
    });
  }
}
