import {
  AgentsStatusTableCol,
  AgentsStatusTableColumnLabel
} from './agents-status-table.constants';
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
import { AgentData } from 'src/app/core/_models/agent.model';
import { AgentsDataSource } from 'src/app/core/_datasources/agents.datasource';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { Cacheable } from 'src/app/core/_decorators/cacheable';
import {  ChunkDataData } from 'src/app/core/_models/chunk.model';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { SafeHtml } from '@angular/platform-browser';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { AgentsStatusDataSource } from 'src/app/core/_datasources/agents-status.datasource';

@Component({
  selector: 'agents-status-table',
  templateUrl: './agents-status-table.component.html'
})
export class AgentsStatusTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  tableColumns: HTTableColumn[] = [];
  dataSource: AgentsStatusDataSource;
  chunkData: { [key: number]: ChunkDataData } = {};
  private chunkDataLock: { [key: string]: Promise<void> } = {};

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.setColumnLabels(AgentsStatusTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AgentsStatusDataSource(
      this.cdr,
      this.gs,
      this.uiService
    );
    this.dataSource.setColumns(this.tableColumns);
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
        id: AgentsStatusTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        render: (agent: AgentData) => agent.id,
        export: async (agent: AgentData) => agent.id + ''
      },
      {
        id: AgentsStatusTableCol.STATUS,
        dataKey: 'status',
        isSortable: true,
        async: (agent: AgentData) => this.renderActiveAgent(agent),
        export: async (agent: AgentData) => (agent.attributes.isActive ? 'Active' : 'Inactive')
      },
      {
        id: AgentsStatusTableCol.NAME,
        dataKey: 'agentName',
        render: (agent: AgentData) => this.renderName(agent),
        routerLink: (agent: AgentData) => this.renderAgentLink(agent),
        isSortable: true,
        export: async (agent: AgentData) => agent.attributes.agentName
      },
      {
        id: AgentsStatusTableCol.AGENT_STATUS,
        dataKey: 'isActive',
        icons: (agent: AgentData) => this.renderStatusIcon(agent),
        render: (agent: AgentData) => this.renderStatus(agent),
        isSortable: true
      },
      {
        id: AgentsStatusTableCol.WORKING_ON,
        dataKey: 'status',
        async: (agent: AgentData) => this.renderWorkingOn(agent),
        isSortable: false,
        export: async (agent: AgentData) => (await this.renderWorkingOn(agent)) + ''
      },
      {
        id: AgentsStatusTableCol.ASSIGNED,
        dataKey: 'taskName',
        isSortable: true,
        render: (agent: AgentData) => agent.attributes.taskName,
        routerLink: (agent: AgentData) => this.renderTaskLink(agent.attributes.task),
        export: async (agent: AgentData) => agent.attributes.taskName
      },
      {
        id: AgentsStatusTableCol.LAST_ACTIVITY,
        dataKey: 'lastTime',
        render: (agent: AgentData) => this.renderLastActivity(agent),
        isSortable: true,
        export: async (agent: AgentData) =>
          formatUnixTimestamp(agent.attributes.lastTime, this.dateFormat)
      }
    ];

    return tableColumns;
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

  @Cacheable(['id'])
  async renderActiveAgent(agent: AgentData): Promise<SafeHtml> {
    const agentSpeed = await this.utilService
      .calculateSpeed(agent.id, true)
      .toPromise();
    const result = agentSpeed > 0 ? 'Running task' : 'Stopped task';
    return this.sanitize(`${result}`);
  }

  @Cacheable(['id', 'agentName'])
  renderName(agent: AgentData): SafeHtml {
    const agentName =
      agent.attributes.agentName?.length > 40
        ? `${agent.attributes.agentName.substring(40)}...`
        : agent.attributes.agentName;
    const isTrusted = agent.attributes.isTrusted
      ? '<span><fa-icon icon="faLock" aria-hidden="true" ngbTooltip="Trust agent with secret data" /></span>'
      : '';

    return this.sanitize(`<a>${agentName}</a>${isTrusted}`);
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

  @Cacheable(['id'])
  async renderCracked(agent: AgentData): Promise<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    const cracked = await this.getCracked(agent);

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

  @Cacheable(['id', 'isActive'])
  renderStatus(agent: AgentData): SafeHtml {
    let html: string;
    if (agent.attributes.isActive) {
      html = '<span class="pill pill-active">Active</span>';
    } else {
      html = '<span class="pill pill-inactive">Inactive</span>';
    }

    return this.sanitize(html);
  }

  @Cacheable(['id', 'speed'])
  async renderWorkingOn(agent: AgentData): Promise<SafeHtml> {
    let html = '';
    const speed = await this.getSpeed(agent);
    if (speed) {
      html = `
        <div>
        <div>Task: <a href="/tasks/show-tasks/${agent.attributes.taskId}/edit">${agent.attributes.taskName}</a></div>
        <div>at ${speed} H/s,<br></div>
        <div>working on chunk <a href="/tasks/chunks/${agent.attributes.chunkId}/view">${agent.attributes.chunkId}</a></div>
        </div>
      `;
    }

    return this.sanitize(html);
  }

  @Cacheable(['id', 'lastTime'])
  renderLastActivity(agent: AgentData): SafeHtml {
    const formattedDate = formatUnixTimestamp(
      agent.attributes.lastTime,
      this.dateFormat
    );
    const action = `Action: ${agent.attributes.lastAct}<br>`;
    const time = `Time: ${formattedDate}<br>`;
    const ip = agent.attributes.lastIp ? `<div>IP: ${agent.attributes.lastIp}</div>` : '';

    const data = `${action}${time}${ip}`;
    return this.sanitize(data);
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
          AgentsStatusTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<AgentData>(
          'hashtopolis-agents',
          this.tableColumns,
          event.data,
          AgentsStatusTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<AgentData>(
            this.tableColumns,
            event.data,
            AgentsStatusTableColumnLabel
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
          title: `Deleting '${event.data.attributes.agentName}' ...`,
          icon: 'warning',
          body: `Are you sure you want to delete '${event.data.attributes.agentName}'? Note that this action cannot be undone.`,
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
    const requests = agents.map((agent: AgentData) => {
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
    this.subscriptions.push(
      this.gs.delete(SERV.AGENTS, agent[0].id).subscribe(() => {
        this.snackBar.open('Successfully deleted agent!', 'Close');
        this.dataSource.reload();
      })
    );
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
}
