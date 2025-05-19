import {
  AgentsViewTableCol,
  AgentsViewTableColumnLabel
} from '@components/tables/agent-view-table/agents-view-table.constants';
import { Component, OnInit } from '@angular/core';
import { HTTableColumn, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';
import { catchError, forkJoin } from 'rxjs';

import { ASC } from '@src/app/core/_constants/agentsc.config';
import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { AgentViewDialogComponent } from '@src/app/shared/dialog/agent-view-dialog/agent-view-dialog.component';
import { AgentsViewDataSource } from '@datasources/agents-view.datasource';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { JAgent } from '@models/agent.model';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from '@src/app/core/_services/main.config';
import { SafeHtml } from '@angular/platform-browser';
import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';

export class STATCALCULATION {
  public static AVG_VALUE = 1;
  public static MAX_VALUE = 2;
}
@Component({
  selector: 'app-agent-view-table',
  templateUrl: './agent-view-table.component.html',
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
    return [
      {
        id: AgentsViewTableCol.ID,
        dataKey: '_id',
        isSortable: true,
        render: (agent: JAgent) => agent.id
      },
      {
        id: AgentsViewTableCol.NAME,
        dataKey: 'agentName',
        isSortable: true,
        icon: (agent: JAgent) => this.renderStatusIcon(agent),
        routerLink: (agent: JAgent) => this.renderAgentLink(agent),
        render: (agent: JAgent) => agent.agentName
      },
      {
        id: AgentsViewTableCol.STATUS,
        dataKey: 'status',
        isSortable: true,
        render: (agent: JAgent) => this.renderActiveAgent(agent),
        export: async (agent: JAgent) => this.renderActiveAgent(agent)
      },
      {
        id: AgentsViewTableCol.DEVICE_UTILISATION,
        dataKey: 'avgDevice',
        isSortable: true,
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
        id: AgentsViewTableCol.TEMPERATURE,
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
        id: AgentsViewTableCol.CPU_UTILISATION,
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
      },
      {
        id: AgentsViewTableCol.LAST_ACTIVITY,
        dataKey: 'lastTime',
        isSortable: true,
        render: (agent: JAgent) => this.renderLastActivity(agent)
      }
    ];
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
   * Render message, if agent is working on a task or in idle mode
   * @param agent - agent instance to check state for
   * @return message containing the current agent state
   * @private
   */
  private renderActiveAgent(agent: JAgent): string {
    return agent.agentSpeed > 0 ? 'Running task' : 'Stopped task';
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

    const data = `${action}${time}`;
    return this.sanitize(data);
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
            tabName: 'Device Utilisation ',
            icon: 'devices',
            threshold1: this.getUtil1(),
            threshold2: this.getUtil2(),
            unitLabel: 'Device',
            statusLabel: 'CPU'
          },
          {
            tabName: 'Temperature',
            icon: 'device_thermostat',
            threshold1: this.getTemp1(),
            threshold2: this.getTemp2(),
            unitLabel: 'Temprature',
            statusLabel: 'Device'
          },
          {
            tabName: 'CPU Utilisation',
            icon: 'computer',
            threshold1: this.getUtil1(),
            threshold2: this.getUtil2(),
            unitLabel: 'CPU',
            statusLabel: 'Device'
          }
        ]
      }
    });
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

      /*       case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting '${event.data.agentName}' ...`,
          icon: 'warning',
          body: `Are you sure you want to delete '${event.data.agentName}'? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break; */
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
  private rowActionEdit(agent: JAgent): void {
    this.renderAgentLink(agent).subscribe((links: HTTableRouterLink[]) => {
      this.router.navigate(links[0].routerLink).then(() => {});
    });
  }
}
