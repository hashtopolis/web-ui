import {
  AgentTableEditableAction,
  AgentsTableCol,
  AgentsTableColumnLabel
} from './agents-table.constants';
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
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

import { AccessGroup } from 'src/app/core/_models/access-group.model';
import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { Agent } from 'src/app/core/_models/agent.model';
import { AgentsDataSource } from 'src/app/core/_datasources/agents.datasource';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { Cacheable } from 'src/app/core/_decorators/cacheable';
import { ChunkData } from 'src/app/core/_models/chunk.model';
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
  @Input() taskId = 0;

  tableColumns: HTTableColumn[] = [];
  dataSource: AgentsDataSource;
  chunkData: { [key: number]: ChunkData } = {};
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

    this.dataSource.reload();
  }

  filter(item: Agent, filterValue: string): boolean {
    if (
      item.agentName.toLowerCase().includes(filterValue) ||
      item.clientSignature.toLowerCase().includes(filterValue) ||
      item.devices.toLowerCase().includes(filterValue)
    ) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns: HTTableColumn[] = [
      {
        id: AgentsTableCol.ID,
        dataKey: '_id',
        isSortable: true,
        render: (agent: Agent) => agent._id,
        export: async (agent: Agent) => agent._id + ''
      },
      {
        id: AgentsTableCol.NAME,
        dataKey: 'agentName',
        routerLink: (agent: Agent) => this.renderAgentLink(agent),
        isSortable: true,
        export: async (agent: Agent) => agent.agentName
      },
      {
        id: AgentsTableCol.STATUS,
        dataKey: 'status',
        icons: (agent: Agent) => this.renderStatusIcon(agent),
        render: (agent: Agent) => this.renderStatus(agent),
        isSortable: true,
        export: async (agent: Agent) => (agent.isActive ? 'Active' : 'Inactive')
      },
      {
        id: AgentsTableCol.USER,
        dataKey: 'userId',
        render: (agent: Agent) => this.renderOwner(agent),
        routerLink: (agent: Agent) => this.renderUserLink(agent),
        isSortable: true,
        export: async (agent: Agent) => (agent.user ? agent.user.name : '')
      },
      {
        id: AgentsTableCol.CLIENT,
        dataKey: 'clientSignature',
        render: (agent: Agent) => this.renderClient(agent),
        isSortable: true,
        export: async (agent: Agent) =>
          agent.clientSignature ? agent.clientSignature : ''
      },
      {
        id: AgentsTableCol.TASK_SPEED,
        dataKey: 'taskId',
        icons: (agent: Agent) => this.renderProgressIcon(agent),
        async: (agent: Agent) => this.renderCurrentSpeed(agent),
        isSortable: false,
        export: async (agent: Agent) => (await this.getSpeed(agent)) + ''
      },
      {
        id: AgentsTableCol.CURRENT_CHUNK,
        dataKey: 'chunkId',
        routerLink: (agent: Agent) => this.renderChunkLink(agent),
        isSortable: true,
        export: async (agent: Agent) =>
          agent.chunk ? agent.chunk._id + '' : ''
      },
      {
        id: AgentsTableCol.GPUS_CPUS,
        dataKey: 'devices',
        isSortable: true,
        export: async (agent: Agent) => agent.devices
      },
      {
        id: AgentsTableCol.LAST_ACTIVITY,
        dataKey: 'lastTime',
        render: (agent: Agent) => this.renderLastActivity(agent),
        isSortable: true,
        export: async (agent: Agent) =>
          formatUnixTimestamp(agent.lastTime, this.dateFormat)
      },
      {
        id: AgentsTableCol.CRACKED,
        dataKey: 'cracked',
        routerLink: (agent: Agent) => this.renderCracked(agent),
        isSortable: true,
        export: async (agent: Agent) => (await this.getCracked(agent)) + ''
      }
    ];

    if (this.taskId === 0) {
      // If this is not assigned agents, add task and access group
      tableColumns.push({
        id: AgentsTableCol.CURRENT_TASK,
        dataKey: 'taskName',
        routerLink: (agent: Agent) => this.renderTaskLink(agent),
        isSortable: true,
        export: async (agent: Agent) => (agent.task ? agent.task.taskName : '')
      });
      tableColumns.push({
        id: AgentsTableCol.ACCESS_GROUP,
        dataKey: 'accessGroupId',
        routerLink: (agent: Agent) => this.renderAccessGroupLinks(agent),
        isSortable: true,
        export: async (agent: Agent) =>
          agent.accessGroups.map((item) => item.groupName).join(', ')
      });
    } else {
      // If this is assigned agents, add benchmark, time spent and keyspace searched
      tableColumns.push({
        id: AgentsTableCol.BENCHMARK,
        dataKey: 'benchmark',
        editable: (agent: Agent) => {
          return {
            data: agent,
            value: agent.benchmark,
            action: AgentTableEditableAction.CHANGE_BENCHMARK
          };
        },
        isSortable: true,
        export: async (agent: Agent) => agent.benchmark
      });
      tableColumns.push({
        id: AgentsTableCol.TIME_SPENT,
        dataKey: 'timeSpent',
        async: (agent: Agent) => this.renderTimeSpent(agent),
        icons: undefined,
        isSortable: true,
        export: async (agent: Agent) => (await this.getTimeSpent(agent)) + ''
      });
      tableColumns.push({
        id: AgentsTableCol.SEARCHED,
        dataKey: 'searched',
        async: (agent: Agent) => this.renderSearched(agent),
        icons: undefined,
        isSortable: true,
        export: async (agent: Agent) => (await this.getSearched(agent)) + ''
      });
    }

    return tableColumns;
  }

  editableSaved(editable: HTTableEditable<Agent>): void {
    switch (editable.action) {
      case AgentTableEditableAction.CHANGE_BENCHMARK:
        this.changeBenchmark(editable.data, editable.value);
        break;
    }
  }

  openDialog(data: DialogData<Agent>) {
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

  @Cacheable(['_id', 'agentName', 'isTrusted'])
  renderName(agent: Agent): SafeHtml {
    const agentName =
      agent.agentName?.length > 40
        ? `${agent.agentName.substring(40)}...`
        : agent.agentName;
    const isTrusted = agent.isTrusted
      ? '<span><fa-icon icon="faLock" aria-hidden="true" ngbTooltip="Trust agent with secret data" /></span>'
      : '';

    return this.sanitize(
      `<a href="#" data-view-agent-id="${agent._id}">${agentName}</a>${isTrusted}`
    );
  }

  @Cacheable(['_id'])
  async renderCurrentSpeed(agent: Agent): Promise<SafeHtml> {
    let html = '-';
    const speed = await this.getSpeed(agent);
    if (speed) {
      html = `${speed} H/s`;
    }
    return this.sanitize(html);
  }

  @Cacheable(['_id'])
  async renderTimeSpent(agent: Agent): Promise<SafeHtml> {
    let html = '-';
    const timeSpent = await this.getTimeSpent(agent);
    if (timeSpent) {
      html = `${formatSeconds(timeSpent)}`;
    }
    return this.sanitize(html);
  }

  @Cacheable(['_id'])
  async renderSearched(agent: Agent): Promise<SafeHtml> {
    let html = '-';
    const searched = await this.getSearched(agent);
    if (searched) {
      html = `${searched}`;
    }
    return this.sanitize(html);
  }

  @Cacheable(['_id'])
  async renderCracked(agent: Agent): Promise<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    const cracked = await this.getCracked(agent);

    if (cracked) {
      links.push({
        label: cracked + '',
        routerLink: ['/hashlists', 'hashes', 'tasks', agent.taskId]
      });
    }

    return links;
  }

  @Cacheable(['_id'])
  async renderProgressIcon(agent: Agent): Promise<HTTableIcon[]> {
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

  @Cacheable(['_id', 'isActive'])
  renderStatus(agent: Agent): SafeHtml {
    let html: string;
    if (agent.isActive) {
      html = '<span class="pill pill-active">Active</span>';
    } else {
      html = '<span class="pill pill-inactive">Inactive</span>';
    }

    return this.sanitize(html);
  }

  @Cacheable(['_id', 'userId'])
  renderOwner(agent: Agent): SafeHtml {
    if (agent.user) {
      return this.sanitize(agent.user.name);
    }
    return '';
  }

  @Cacheable(['_id', 'clientSignature'])
  renderClient(agent: Agent): SafeHtml {
    if (agent.clientSignature) {
      return agent.clientSignature;
    }
    return '';
  }

  @Cacheable(['_id', 'lastTime'])
  renderLastActivity(agent: Agent): SafeHtml {
    const formattedDate = formatUnixTimestamp(agent.lastTime, this.dateFormat);
    //const data = `<code>${agent.lastAct}</code> at<br>${formattedDate}<br>IP:<code>${agent.lastIp}</code>`;
    const data = `<time datetime="${formatUnixTimestamp(
      agent.lastTime,
      'yyyy-MM-ddThh:mm:ss'
    )}">${formattedDate}</time>`;
    return this.sanitize(data);
  }

  private async getSpeed(agent: Agent): Promise<number> {
    return this.getChunkDataParam(agent._id, 'speed');
  }

  private async getSearched(agent: Agent): Promise<number> {
    return this.getChunkDataParam(agent._id, 'searched');
  }

  private async getTimeSpent(agent: Agent): Promise<number> {
    return this.getChunkDataParam(agent._id, 'timeSpent');
  }

  private async getCracked(agent: Agent): Promise<number> {
    return this.getChunkDataParam(agent._id, 'cracked');
  }

  private async getChunkDataParam(
    agentId: number,
    key: string
  ): Promise<number> {
    const cd: ChunkData = await this.getChunkData(agentId);
    if (cd[key]) {
      return cd[key];
    }

    return 0;
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<Agent[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<Agent>(
          'hashtopolis-agents',
          this.tableColumns,
          event.data,
          AgentsTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<Agent>(
          'hashtopolis-agents',
          this.tableColumns,
          event.data,
          AgentsTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<Agent>(
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

  rowActionClicked(event: ActionMenuEvent<Agent>): void {
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
          title: `Deleting ${event.data.agentName} ...`,
          icon: 'warning',
          body: `Are you sure you want to delete ${event.data.agentName}? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<Agent[]>): void {
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
  private bulkActionActivate(agents: Agent[], isActive: boolean): void {
    const requests = agents.map((agent: Agent) => {
      return this.gs.update(SERV.AGENTS, agent._id, { isActive: isActive });
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
  private bulkActionDelete(agents: Agent[]): void {
    const requests = agents.map((agent: Agent) => {
      return this.gs.delete(SERV.AGENTS, agent._id);
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
  private rowActionDelete(agent: Agent): void {
    this.subscriptions.push(
      this.gs.delete(SERV.AGENTS, agent._id).subscribe(() => {
        this.snackBar.open('Successfully deleted agent!', 'Close');
        this.dataSource.reload();
      })
    );
  }

  private rowActionEdit(agent: Agent): void {
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
  private async getChunkData(agentId: number): Promise<ChunkData> {
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

  private changeBenchmark(agent: Agent, benchmark: string): void {
    if (!benchmark || agent.benchmark == benchmark) {
      this.snackBar.open('Nothing changed!', 'Close');
      return;
    }

    const request$ = this.gs.update(SERV.AGENT_ASSIGN, agent._id, {
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
            `Changed benchmark to ${benchmark} on Agent #${agent._id}!`,
            'Close'
          );
          this.reload();
        })
    );
  }
}
