import { Observable, catchError, of } from 'rxjs';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { JAgent } from '@models/agent.model';

import { AgentMenuService } from '@services/context-menu/agent-menu.service';
import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import {
  AgentTableEditableAction,
  AgentsTableCol,
  AgentsTableColumnLabel
} from '@components/tables/agents-table/agents-table.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import {
  DataType,
  HTTableColumn,
  HTTableEditable,
  HTTableIcon,
  HTTableRouterLink
} from '@components/tables/ht-table/ht-table.models';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';

import { AgentsDataSource } from '@datasources/agents.datasource';

import { formatSeconds, formatUnixTimestamp } from '@src/app/shared/utils/datetime';
import { convertCrackingSpeed } from '@src/app/shared/utils/util';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'agents-table',
  templateUrl: './agents-table.component.html',
  standalone: false
})
export class AgentsTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  @Input() datatype: DataType = 'agents';
  @Input() taskId = 0;
  @Input() assignAgents? = false;

  tableColumns: HTTableColumn[] = [];
  dataSource: AgentsDataSource;
  selectedFilterColumn: string = 'all';

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.setColumnLabels(AgentsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AgentsDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    if (this.taskId) {
      this.dataSource.setTaskId(this.taskId);
    }
    this.contextMenuService = new AgentMenuService(this.permissionService).addContextMenu();
    this.dataSource.reload();
  }

  filter(item: JAgent, filterValue: string): boolean {
    filterValue = filterValue.toLowerCase();
    const selectedColumn = this.selectedFilterColumn;
    // Filter based on selected column
    switch (selectedColumn) {
      case 'all': {
        // Search across multiple relevant fields
        return (
          item.id.toString().includes(filterValue) ||
          item.agentName?.toLowerCase().includes(filterValue) ||
          item.user.name?.toLowerCase().includes(filterValue) ||
          item.clientSignature?.toLowerCase().includes(filterValue) ||
          item.devices?.toLowerCase().includes(filterValue) ||
          item.accessGroups?.some((group) => group.groupName.toLowerCase().includes(filterValue)) ||
          item.task?.taskName?.toLowerCase().includes(filterValue)
        );
      }
      case 'id': {
        return String(item.id).toLowerCase().includes(filterValue);
      }
      case 'agentName': {
        return item.agentName?.toLowerCase().includes(filterValue);
      }
      case 'userId': {
        return item.user?.name?.toLowerCase().includes(filterValue);
      }
      case 'clientSignature': {
        return item.clientSignature?.toLowerCase().includes(filterValue);
      }
      case 'devices': {
        return item.devices?.toLowerCase().includes(filterValue);
      }
      case 'accessGroupId': {
        return item.accessGroups?.some((group) => group.groupName.toLowerCase().includes(filterValue));
      }
      case 'taskName': {
        return item.task?.taskName?.toLowerCase().includes(filterValue);
      }
      default:
        return item.task?.taskName?.toLowerCase().includes(filterValue);
    }
  }

  getColumns(): HTTableColumn[] {
    const tableColumns: HTTableColumn[] = [
      {
        id: AgentsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        isSearchable: true,
        render: (agent: JAgent) => agent.id,
        export: async (agent: JAgent) => agent.id + ''
      },
      {
        id: AgentsTableCol.NAME,
        dataKey: 'agentName',
        routerLink: (agent: JAgent) => this.renderAgentLink(agent),
        isSortable: true,
        isSearchable: true,
        export: async (agent: JAgent) => agent.agentName
      },
      {
        id: AgentsTableCol.STATUS,
        dataKey: 'status',
        icon: (agent: JAgent) => this.renderStatusIcon(agent),
        render: (agent: JAgent) => this.renderStatus(agent),
        isSortable: true,
        export: async (agent: JAgent) => (agent.isActive ? 'Active' : 'Inactive')
      },
      {
        id: AgentsTableCol.USER,
        dataKey: 'userId',
        render: (agent: JAgent) => this.renderOwner(agent),
        routerLink: (agent: JAgent) => this.renderUserLinkFromAgent(agent),
        isSortable: true,
        isSearchable: true,
        export: async (agent: JAgent) => (agent.user ? agent.user.name : '')
      },
      {
        id: AgentsTableCol.CLIENT,
        dataKey: 'clientSignature',
        render: (agent: JAgent) => this.renderClient(agent),
        isSortable: true,
        isSearchable: true,
        export: async (agent: JAgent) => (agent.clientSignature ? agent.clientSignature : '')
      },
      {
        id: AgentsTableCol.TASK_SPEED,
        dataKey: 'taskId',
        icon: (agent: JAgent) => this.renderProgressIcon(agent),
        render: (agent: JAgent) => this.renderCurrentSpeed(agent),
        isSortable: false,
        export: async (agent: JAgent) => this.getChunkDataValue(agent, 'speed') + ''
      },
      {
        id: AgentsTableCol.CURRENT_CHUNK,
        dataKey: 'chunkId',
        routerLink: (agent: JAgent) => this.renderChunkLink(agent),
        isSortable: true,
        export: async (agent: JAgent) => (agent.chunk ? agent.chunk.id + '' : '')
      },
      {
        id: AgentsTableCol.GPUS_CPUS,
        dataKey: 'devices',
        render: (agent: JAgent) => this.renderDevices(agent),
        isSortable: true,
        isSearchable: true,
        export: async (agent: JAgent) => agent.devices
      },
      {
        id: AgentsTableCol.LAST_ACTIVITY,
        dataKey: 'lastTime',
        render: (agent: JAgent) => this.renderLastActivity(agent),
        isSortable: true,
        export: async (agent: JAgent) => formatUnixTimestamp(agent.lastTime, this.dateFormat)
      }
    ];

    if (this.taskId === 0) {
      // If this is not assigned agents, add task and access group
      tableColumns.push({
        id: AgentsTableCol.CURRENT_TASK,
        dataKey: 'taskName',
        routerLink: (agent: JAgent) => this.renderTaskLink(agent),
        isSortable: true,
        isSearchable: true,
        export: async (agent: JAgent) => (agent.task ? agent.taskName : '')
      });
      tableColumns.push({
        id: AgentsTableCol.ACCESS_GROUP,
        dataKey: 'accessGroupId',
        routerLink: (agent: JAgent) => this.renderAccessGroupLinks(agent),
        isSortable: true,
        isSearchable: true,
        export: async (agent: JAgent) => agent.accessGroup
      });
    } else {
      // If this is assigned agents, add benchmark, time spent and keyspace searched
      tableColumns.push({
        id: AgentsTableCol.CRACKED,
        dataKey: 'cracked',
        render: (agent: JAgent) => this.renderCracked(agent),
        isSortable: true,
        export: async (agent: JAgent) => this.renderCracked(agent) + ''
      });
      tableColumns.push({
        id: AgentsTableCol.BENCHMARK,
        dataKey: 'benchmark',
        editable: (agent: JAgent) => {
          return {
            data: agent,
            value: agent.benchmark,
            action: AgentTableEditableAction.CHANGE_BENCHMARK
          };
        },
        isSortable: true,
        export: async (agent: JAgent) => agent.benchmark
      });
      tableColumns.push({
        id: AgentsTableCol.TIME_SPENT,
        dataKey: 'timeSpent',
        render: (agent: JAgent) => this.renderTimeSpent(agent),
        isSortable: true,
        export: async (agent: JAgent) => this.getChunkDataValue(agent, 'timeSpent') + ''
      });
      tableColumns.push({
        id: AgentsTableCol.SEARCHED,
        dataKey: 'searched',
        render: (agent: JAgent) => this.renderSearched(agent),
        isSortable: true,
        export: async (agent: JAgent) => this.getChunkDataValue(agent, 'searched') + ''
      });
    }

    return tableColumns;
  }

  editableSaved(editable: HTTableEditable<JAgent>): void {
    switch (editable.action) {
      case AgentTableEditableAction.CHANGE_BENCHMARK:
        this.changeBenchmark(editable.data, editable.value);
        break;
    }
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

  /**
   * Get a value from the agent's chunkdata attribute
   * @param agent - agent instance to get value from
   * @param property name of chunkdata property
   * @return property value or undefined, if property or chunkdata are not defined
   * @private
   */
  private getChunkDataValue(agent: JAgent, property: string): number | undefined {
    if (agent.chunkData && property in agent.chunkData) {
      return agent.chunkData[property];
    }
    return undefined;
  }

  /**
   * Get current agent speed as safe html ready to be rendered
   * @param agent - agent instance to get value from
   * @return html code containing the current speed including a unit
   * @private
   */
  private renderCurrentSpeed(agent: JAgent): SafeHtml {
    const agentSpeed: number = this.getChunkDataValue(agent, 'speed');
    if (agentSpeed) {
      return this.sanitize(convertCrackingSpeed(agentSpeed));
    }
    return this.sanitize('-');
  }

  /**
   * Render a progress icon, if the task is working on a chunk
   * @param agent - agent instance to render icon for
   * @return icon object to render, may be empty, if task is not working on a chunk
   * @private
   */
  private renderProgressIcon(agent: JAgent): HTTableIcon {
    if (this.getChunkDataValue(agent, 'speed')) {
      return { name: 'radio_button_checked', cls: 'pulsing-progress' };
    }
    return { name: '' };
  }

  /**
   * Render time spent the agent is working on a task
   * @param agent - agent instance to render time for
   * @return html code containing time spent on the taks
   * @private
   */
  private renderTimeSpent(agent: JAgent): SafeHtml {
    const timeSpent: number = this.getChunkDataValue(agent, 'timeSpent');
    return this.sanitize(timeSpent ? `${formatSeconds(timeSpent)}` : '-');
  }

  /**
   * Render searched keyspace
   * @param agent - agent instance to render time for
   * @return html code containing the amount of searched keyspace
   * @private
   */
  private renderSearched(agent: JAgent): SafeHtml {
    const searched = this.getChunkDataValue(agent, 'searched') * 100;
    const percentSearched = `${(Math.round(searched * 100) / 100).toLocaleString()}%`;
    return this.sanitize(searched ? `${percentSearched}` : '-');
  }

  /**
   * Render amount of cracked hashes
   * @param agent - agent instance to render time for
   * @return html code containing the amount of cracked hashes
   * @private
   */
  private renderCracked(agent: JAgent): SafeHtml {
    const cracked = this.getChunkDataValue(agent, 'cracked');
    return this.sanitize(cracked ? `<span>${cracked.toLocaleString()}</span>` : '-');
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

  renderOwner(agent: JAgent): SafeHtml {
    if (agent.user) {
      return this.sanitize(agent.user.name);
    }
    return '';
  }

  renderClient(agent: JAgent): SafeHtml {
    if (agent.clientSignature) {
      return agent.clientSignature;
    }
    return '';
  }

  renderLastActivity(agent: JAgent): SafeHtml {
    const formattedDate = formatUnixTimestamp(agent.lastTime, this.dateFormat);
    const data = `<time datetime="${formatUnixTimestamp(agent.lastTime, 'yyyy-MM-ddThh:mm:ss')}">${formattedDate}</time>`;
    return this.sanitize(data);
  }

  renderDevices(agent: JAgent): SafeHtml {
    const deviceList = agent.devices.split('\n');
    const deviceCountMap: { [key: string]: number } = {};

    // Count occurrences of each device
    deviceList.forEach((device) => {
      if (deviceCountMap[device]) {
        deviceCountMap[device]++;
      } else {
        deviceCountMap[device] = 1;
      }
    });

    // Format the result string with HTML line breaks
    const formattedDevices = Object.keys(deviceCountMap)
      .map((device) => `${deviceCountMap[device]} x ${device}`)
      .join('<br>');

    return this.sanitize(formattedDevices);
  }

  exportActionClicked(event: ActionMenuEvent<JAgent[]>): void {
    this.exportService.handleExportAction<JAgent>(
      event,
      this.tableColumns,
      AgentsTableColumnLabel,
      'hashtopolis-agents'
    );
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
          title: `${event.data?.assignmentId ? 'Unassigning' : 'Deleting'}  ${event.data.agentName} ...`,
          icon: 'warning',
          body: `Are you sure you want to ${event.data?.assignmentId ? 'unassign' : 'delete'} ${event.data.agentName}? ${event.data?.assignmentId ? '' : 'Note that this action cannot be undone.'}`,
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
          title: `${this.assignAgents ? 'Unassigning' : 'Deleting'} ${event.data.length} agents ...`,
          icon: 'warning',
          body: `Are you sure you want to ${this.assignAgents ? 'unassign' : 'delete'} the above agents? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'agentName',
          action: event.menuItem.action
        });
        break;
    }
  }

  /**
   * Render a view chunk link for an agent
   * @param agent - agent to render link for
   * @return observable containing the link to render in HTML
   * @private
   */
  private renderChunkLink(agent: JAgent): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (agent && agent.chunkId) {
      links.push({
        routerLink: ['/tasks', 'chunks', agent.chunkId, 'view'],
        label: agent.chunkId
      });
    }
    return of(links);
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionActivate(agents: JAgent[], isActive: boolean): void {
    const action = isActive ? 'activated' : 'deactivated';

    this.subscriptions.push(
      this.gs.bulkUpdate(SERV.AGENTS, agents, { isActive: isActive }).subscribe(() => {
        this.alertService.showSuccessMessage(`Successfully ${action} agents!`);
        this.dataSource.reload();
      })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(agents: JAgent[]): void {
    this.subscriptions.push(
      this.gs
        .bulkDelete(SERV.AGENTS, agents)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion: ', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage(`Successfully deleted agents!`);
          this.dataSource.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(agent: JAgent): void {
    if (agent[0].assignmentId) {
      this.subscriptions.push(
        this.gs.delete(SERV.AGENT_ASSIGN, agent[0].assignmentId).subscribe(() => {
          this.alertService.showSuccessMessage('Successfully unassigned agent!');
          this.dataSource.reload();
        })
      );
    } else {
      this.subscriptions.push(
        this.gs.delete(SERV.AGENTS, agent[0].id).subscribe(() => {
          this.alertService.showSuccessMessage('Successfully deleted agent!');
          this.dataSource.reload();
        })
      );
    }
  }

  private rowActionEdit(agent: JAgent): void {
    this.renderAgentLink(agent).subscribe((links: HTTableRouterLink[]) => {
      this.router.navigate(links[0].routerLink).then(() => {});
    });
  }

  private changeBenchmark(agent: JAgent, benchmark: string): void {
    if (!benchmark || agent.benchmark == benchmark) {
      this.alertService.showSuccessMessage('Nothing changed!');
      return;
    }

    const request$ = this.gs.update(SERV.AGENT_ASSIGN, agent.id, {
      benchmark: benchmark
    });
    this.subscriptions.push(
      request$
        .pipe(
          catchError((error) => {
            this.alertService.showErrorMessage(`Failed to update benchmark!`);
            console.error('Failed to update benchmark:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage(`Changed benchmark to ${benchmark} on Agent #${agent.id}!`);
          this.reload();
        })
    );
  }
}
