import {
  AgentTableEditableAction,
  AgentsTableCol,
  AgentsTableColumnLabel
} from './agents-table.constants';
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  DataType,
  HTTableColumn,
  HTTableEditable,
  HTTableIcon,
  HTTableRouterLink
} from '../ht-table/ht-table.models';
import { catchError, forkJoin } from 'rxjs';
import {
  formatSeconds,
  formatUnixTimestamp
} from 'src/app/shared/utils/datetime';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { AgentData } from 'src/app/core/_models/agent.model';
import { AgentsDataSource } from 'src/app/core/_datasources/agents.datasource';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { Cacheable } from 'src/app/core/_decorators/cacheable';
import { ChunkDataData } from 'src/app/core/_models/chunk.model';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { SafeHtml } from '@angular/platform-browser';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';

@Component({
  selector: 'agents-table',
  templateUrl: './agents-table.component.html'
})
export class AgentsTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  @Input() datatype: DataType = 'agents';
  @Input() taskId = 0;
  @Input() assignAgents? = false;

  tableColumns: HTTableColumn[] = [];
  dataSource: AgentsDataSource;
  chunkData: { [key: number]: ChunkDataData } = {};
  private chunkDataLock: { [key: string]: Promise<void> } = {};

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
    if (this.assignAgents) {
      this.dataSource.setAssignAgents(this.assignAgents);
    }
    this.dataSource.reload();
  }

  filter(item: AgentData, filterValue: string): boolean {
    if (
      item.attributes.agentName.toLowerCase().includes(filterValue) ||
      item.attributes.clientSignature.toLowerCase().includes(filterValue) ||
      item.attributes.devices.toLowerCase().includes(filterValue)
    ) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns: HTTableColumn[] = [
      {
        id: AgentsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        render: (agent: AgentData) => agent.id,
        export: async (agent: AgentData) => agent.id + ''
      },
      {
        id: AgentsTableCol.NAME,
        dataKey: 'agentName',
        routerLink: (agent: AgentData) => this.renderAgentLink(agent),
        isSortable: true,
        export: async (agent: AgentData) => agent.attributes.agentName
      },
      {
        id: AgentsTableCol.STATUS,
        dataKey: 'status',
        icons: (agent: AgentData) => this.renderStatusIcon(agent),
        render: (agent: AgentData) => this.renderStatus(agent),
        isSortable: true,
        export: async (agent: AgentData) =>
          agent.attributes.isActive ? 'Active' : 'Inactive'
      },
      {
        id: AgentsTableCol.USER,
        dataKey: 'userId',
        render: (agent: AgentData) => this.renderOwner(agent),
        routerLink: (agent: AgentData) => this.renderUserLink(agent),
        isSortable: true,
        export: async (agent: AgentData) => (agent.attributes.user ? agent.attributes.user.attributes.name : '')
      },
      {
        id: AgentsTableCol.CLIENT,
        dataKey: 'clientSignature',
        render: (agent: AgentData) => this.renderClient(agent),
        isSortable: true,
        export: async (agent: AgentData) =>
          agent.attributes.clientSignature ? agent.attributes.clientSignature : ''
      },
      {
        id: AgentsTableCol.TASK_SPEED,
        dataKey: 'taskId',
        icons: (agent: AgentData) => this.renderProgressIcon(agent),
        async: (agent: AgentData) => this.renderCurrentSpeed(agent),
        isSortable: false,
        export: async (agent: AgentData) => (await this.getSpeed(agent)) + ''
      },
      {
        id: AgentsTableCol.CURRENT_CHUNK,
        dataKey: 'chunkId',
        routerLink: (agent: AgentData) => this.renderChunkLink(agent),
        isSortable: true,
        export: async (agent: AgentData) =>
          agent.attributes.chunk ? agent.attributes.chunk.id + '' : ''
      },
      {
        id: AgentsTableCol.GPUS_CPUS,
        dataKey: 'devices',
        render: (agent: AgentData) => this.renderDevices(agent),
        isSortable: true,
        export: async (agent: AgentData) => agent.attributes.devices
      },
      {
        id: AgentsTableCol.LAST_ACTIVITY,
        dataKey: 'lastTime',
        render: (agent: AgentData) => this.renderLastActivity(agent),
        isSortable: true,
        export: async (agent: AgentData) =>
          formatUnixTimestamp(agent.attributes.lastTime, this.dateFormat)
      },
      {
        id: AgentsTableCol.CRACKED,
        dataKey: 'cracked',
        routerLink: (agent: AgentData) => this.renderCracked(agent),
        isSortable: true,
        export: async (agent: AgentData) => (await this.getCracked(agent)) + ''
      }
    ];

    if (this.taskId === 0) {
      // If this is not assigned agents, add task and access group
      tableColumns.push({
        id: AgentsTableCol.CURRENT_TASK,
        dataKey: 'taskName',
        routerLink: (agent: AgentData) => this.renderTaskLink(agent),
        isSortable: true,
        export: async (agent: AgentData) => (agent.attributes.task ? agent.attributes.taskName : '')
      });
      tableColumns.push({
        id: AgentsTableCol.ACCESS_GROUP,
        dataKey: 'accessGroupId',
        routerLink: (agent: AgentData) => this.renderAccessGroupLinks(agent),
        isSortable: true,
        export: async (agent: AgentData) => agent.attributes.accessGroup
      });
    } else {
      // If this is assigned agents, add benchmark, time spent and keyspace searched
      tableColumns.push({
        id: AgentsTableCol.BENCHMARK,
        dataKey: 'benchmark',
        editable: (agent: AgentData) => {
          return {
            data: agent,
            value: agent.attributes.benchmark,
            action: AgentTableEditableAction.CHANGE_BENCHMARK
          };
        },
        isSortable: true,
        export: async (agent: AgentData) => agent.attributes.benchmark
      });
      tableColumns.push({
        id: AgentsTableCol.TIME_SPENT,
        dataKey: 'timeSpent',
        async: (agent: AgentData) => this.renderTimeSpent(agent),
        icons: undefined,
        isSortable: true,
        export: async (agent: AgentData) => (await this.getTimeSpent(agent)) + ''
      });
      tableColumns.push({
        id: AgentsTableCol.SEARCHED,
        dataKey: 'searched',
        async: (agent: AgentData) => this.renderSearched(agent),
        icons: undefined,
        isSortable: true,
        export: async (agent: AgentData) => (await this.getSearched(agent)) + ''
      });
    }

    return tableColumns;
  }

  editableSaved(editable: HTTableEditable<AgentData>): void {
    switch (editable.action) {
      case AgentTableEditableAction.CHANGE_BENCHMARK:
        this.changeBenchmark(editable.data, editable.value);
        break;
    }
  }

  openDialog(data: DialogData<AgentData>) {
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

  // --- Render functions ---

  @Cacheable(['id', 'agentName', 'isTrusted'])
  renderName(agent: AgentData): SafeHtml {
    const agentName =
      agent.attributes.agentName?.length > 40
        ? `${agent.attributes.agentName.substring(40)}...`
        : agent.attributes.agentName;
    const isTrusted = agent.attributes.isTrusted
      ? '<span><fa-icon icon="faLock" aria-hidden="true" ngbTooltip="Trust agent with secret data" /></span>'
      : '';

    return this.sanitize(
      `<a href="#" data-view-agent-id="${agent.id}">${agentName}</a>${isTrusted}`
    );
  }

  @Cacheable(['id'])
  async renderCurrentSpeed(agent: AgentData): Promise<SafeHtml> {
    let html = '-';
    const speed = await this.getSpeed(agent);
    if (speed) {
      html = `${speed} H/s`;
    }
    return this.sanitize(html);
  }

  @Cacheable(['id'])
  async renderTimeSpent(agent: AgentData): Promise<SafeHtml> {
    let html = '-';
    const timeSpent = await this.getTimeSpent(agent);
    if (timeSpent) {
      html = `${formatSeconds(timeSpent)}`;
    }
    return this.sanitize(html);
  }

  @Cacheable(['id'])
  async renderSearched(agent: AgentData): Promise<SafeHtml> {
    let html = '-';
    const searched = await this.getSearched(agent);
    if (searched) {
      html = `${searched}`;
    }
    return this.sanitize(html);
  }

  @Cacheable(['attributes']['id'])
  async renderCracked(agent: AgentData): Promise<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    const cracked = await this.getCracked(agent);
    console.log(agent.attributes.taskId);
    if (cracked) {
      links.push({
        label: cracked + '',
        routerLink: ['/hashlists', 'hashes', 'tasks', agent.attributes.taskId]
      });
    }

    return links;
  }

  @Cacheable(['id'])
  async renderProgressIcon(agent: AgentData): Promise<HTTableIcon[]> {
    const icons: HTTableIcon[] = [];

    const speed = await this.getSpeed(agent);
    if (speed) {
      icons.push({
        name: 'radio_button_checked',
        cls: 'pulsing-progress'
      });
    }

    return icons;
  }

  //@Cacheable(['id', 'isActive'])
  renderStatus(agent: AgentData): SafeHtml {
    let html: string;
    if (agent.attributes.isActive) {
      html = '<span class="pill pill-active">Active</span>';
    } else {
      html = '<span class="pill pill-inactive">Inactive</span>';
    }

    return this.sanitize(html);
  }

  //@Cacheable(['id', 'userId'])
  renderOwner(agent: AgentData): SafeHtml {
    if (agent.attributes.user) {
      return this.sanitize(agent.attributes.user.attributes.name);
    }
    return '';
  }

  @Cacheable(['attributes']['clientSignature'])
  renderClient(agent: AgentData): SafeHtml {
    if (agent.attributes.clientSignature) {
      return agent.attributes.clientSignature;
    }
    return '';
  }

  @Cacheable(['id', 'lastTime'])
  renderLastActivity(agent: AgentData): SafeHtml {
    const formattedDate = formatUnixTimestamp(agent.attributes.lastTime, this.dateFormat);
    //const data = `<code>${agent.lastAct}</code> at<br>${formattedDate}<br>IP:<code>${agent.lastIp}</code>`;
    const data = `<time datetime="${formatUnixTimestamp(
      agent.attributes.lastTime,
      'yyyy-MM-ddThh:mm:ss'
    )}">${formattedDate}</time>`;
    return this.sanitize(data);
  }

  renderDevices(agent: AgentData): SafeHtml {
    const deviceList = agent.attributes.devices.split('\n');
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

  private async getSpeed(agent: AgentData): Promise<number> {
    return this.getChunkDataParam(agent.id, 'speed');
  }

  private async getSearched(agent: AgentData): Promise<number> {
    return this.getChunkDataParam(agent.id, 'searched');
  }

  private async getTimeSpent(agent: AgentData): Promise<number> {
    return this.getChunkDataParam(agent.id, 'timeSpent');
  }

  private async getCracked(agent: AgentData): Promise<number> {
    return this.getChunkDataParam(agent.id, 'cracked');
  }

  private async getChunkDataParam(
    agentId: number,
    key: string
  ): Promise<number> {
    const cd: ChunkDataData = await this.getChunkData(agentId);
    if (cd[key]) {
      return cd[key];
    }

    return 0;
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<AgentData[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<AgentData>(
          'hashtopolis-agents',
          this.tableColumns,
          event.data,
          AgentsTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<AgentData>(
          'hashtopolis-agents',
          this.tableColumns,
          event.data,
          AgentsTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<AgentData>(
            this.tableColumns,
            event.data,
            AgentsTableColumnLabel
          )
          .then(() => {
            this.snackBar.open(
              'The selected rows are copied to the clipboard',
              'Close'
            );
          });
        break;
    }
  }

  rowActionClicked(event: ActionMenuEvent<AgentData>): void {
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
          title: `${this.assignAgents ? 'Unassigning' : 'Deleting'}  ${
            event.data.attributes.agentName
          } ...`,
          icon: 'warning',
          body: `Are you sure you want to ${
            this.assignAgents ? 'unassign' : 'delete'
          } ${event.data.attributes.agentName}? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<AgentData[]>): void {
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
          title: `${this.assignAgents ? 'Unassigning' : 'Deleting'} ${
            event.data.length
          } agents ...`,
          icon: 'warning',
          body: `Are you sure you want to ${
            this.assignAgents ? 'unassign' : 'delete'
          } the above agents? Note that this action cannot be undone.`,
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
  private bulkActionActivate(agents: AgentData[], isActive: boolean): void {
    const requests = agents.map((agent: AgentData) => {
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
          this.snackBar.open(
            `Successfully ${action} ${results.length} agents!`,
            'Close'
          );
          this.dataSource.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(agents: AgentData[]): void {
    let requests;
    if (this.taskId === 0) {
      requests = agents.map((agent: AgentData) => {
        return this.gs.delete(SERV.AGENTS, agent.id);
      });
    } else {
      requests = agents.map((agent: AgentData) => {
        return this.gs.delete(SERV.AGENT_ASSIGN, agent.attributes.assignmentId);
      });
    }

    this.subscriptions.push(
      forkJoin(requests)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe((results) => {
          this.snackBar.open(
            `Successfully deleted ${results.length} agents!`,
            'Close'
          );
          this.dataSource.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(agent: AgentData): void {
    if (this.taskId === 0) {
      this.subscriptions.push(
        this.gs.delete(SERV.AGENTS, agent[0].id).subscribe(() => {
          this.snackBar.open('Successfully deleted agent!', 'Close');
          this.dataSource.reload();
        })
      );
    } else {
      this.subscriptions.push(
        this.gs
          .delete(SERV.AGENT_ASSIGN, agent[0].assignmentId)
          .subscribe(() => {
            this.snackBar.open('Successfully unassigned agent!', 'Close');
            this.dataSource.reload();
          })
      );
    }
  }

  private rowActionEdit(agent: AgentData): void {
    this.renderAgentLink(agent).then((links: HTTableRouterLink[]) => {
      this.router.navigate(links[0].routerLink);
    });
  }

  /**
   * Retrieves or fetches chunk data associated with a given agent from the data source.
   * If the chunk data for the specified agent ID is not already cached, it is fetched
   * asynchronously from the data source and stored in the cache for future use.
   *
   * @param {number} agentId - The ID of the agent for which chunk data is requested.
   * @returns {Promise<ChunkData>} - A promise that resolves to the chunk data associated with the specified agent.
   *
   * @remarks
   * This function uses a locking mechanism to ensure that concurrent calls for the same agent ID
   * do not interfere with each other. If another call is already fetching or has fetched
   * the chunk data for the same agent ID, subsequent calls will wait for the operation to complete
   * before proceeding.
   */
  private async getChunkData(agentId: number): Promise<ChunkDataData> {
    if (!this.chunkDataLock[agentId]) {
      // If there is no lock, create a new one
      this.chunkDataLock[agentId] = (async () => {
        if (!(agentId in this.chunkData)) {
          // Inside the lock, await the asynchronous operation
          this.chunkData[agentId] = await this.dataSource.getChunkData(agentId);
        }

        // Release the lock when the operation is complete
        delete this.chunkDataLock[agentId];
      })();
    }

    // Wait for the lock to be released before returning the data
    await this.chunkDataLock[agentId];

    return this.chunkData[agentId];
  }

  private changeBenchmark(agent: AgentData, benchmark: string): void {
    if (!benchmark || agent.attributes.benchmark == benchmark) {
      this.snackBar.open('Nothing changed!', 'Close');
      return;
    }

    const request$ = this.gs.update(SERV.AGENT_ASSIGN, agent.id, {
      benchmark: benchmark
    });
    this.subscriptions.push(
      request$
        .pipe(
          catchError((error) => {
            this.snackBar.open(`Failed to update benchmark!`, 'Close');
            console.error('Failed to update benchmark:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open(
            `Changed benchmark to ${benchmark} on Agent #${agent.id}!`,
            'Close'
          );
          this.reload();
        })
    );
  }
}
