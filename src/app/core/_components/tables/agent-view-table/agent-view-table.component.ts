import { AgentsViewTableCol, AgentsViewTableColumnLabel } from './agents-view-table.constants';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { ASC } from '@src/app/core/_constants/agentsc.config';
import { AgentStatusModalComponent } from '@src/app/agents/agent-status/agent-status-modal/agent-status-modal.component';
import { AgentViewDialogComponent } from '@src/app/shared/dialog/agent-view-dialog/agent-view-dialog.component';
import { AgentsViewDataSource } from 'src/app/core/_datasources/agents-view.datasource';
import { BaseTableComponent } from '../base-table/base-table.component';
import { HTTableColumn } from '../ht-table/ht-table.models';
import { JAgent } from 'src/app/core/_models/agent.model';
import { NgStyle } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';

export class STATCALCULATION {
  public static AVG_VALUE = 1;
  public static MAX_VALUE = 2;
}
@Component({
  selector: 'app-agent-view-table',
  templateUrl: './agent-view-table.component.html',
  styleUrls: ['./agent-view-table.component.scss'],
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
    const tableColumns: HTTableColumn[] = [
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
        icons: (agent: JAgent) => this.renderStatusIcon(agent),
        routerLink: (agent: JAgent) => this.renderAgentLink(agent),
        render: (agent: JAgent) => agent.agentName
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
        render: (agent: JAgent) => 'Time: ' + formatUnixTimestamp(agent.lastTime, this.dateFormat)
      }
    ];
    return tableColumns;
  }
  private getMaxOrAvgValue(agent: JAgent, statType: ASC, avgOrMax: STATCALCULATION) {
    const tempDateFilter = agent.agentStats.filter((u) => u.time > 10000000);
    const stat = tempDateFilter.filter((u) => u.statType == statType);
    switch (avgOrMax) {
      case 1:
        const avgDevice = Math.round(
          stat.reduce((sum, current) => sum + current.value.reduce((a, b) => a + b, 0), 0) / stat.length
        );
        return avgDevice;
      case 2:
        const maxTemp = Math.round(
          stat.reduce((prev, current) => (prev.value > current.value ? prev : current)).value[0]
        );
        return maxTemp;

      default:
        return 0; // Provide a default value for unhandled cases
    }
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
  openDialog(): void {
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

    // dialogRef.afterClosed().subscribe();
  }
}
