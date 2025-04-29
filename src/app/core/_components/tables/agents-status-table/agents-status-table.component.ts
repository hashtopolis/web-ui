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
import {
  HTTableColumn,
  HTTableIcon,
  HTTableRouterLink
} from '@src/app/core/_components/tables/ht-table/ht-table.models';
import { TableDialogComponent } from '@src/app/core/_components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@src/app/core/_components/tables/table-dialog/table-dialog.model';
import { AgentsStatusDataSource } from '@src/app/core/_datasources/agents-status.datasource';
import { Cacheable } from '@src/app/core/_decorators/cacheable';
import { JAgent } from '@src/app/core/_models/agent.model';
import { ChunkDataData } from '@src/app/core/_models/chunk.model';
import { SERV } from '@src/app/core/_services/main.config';
import { formatSeconds, formatUnixTimestamp } from '@src/app/shared/utils/datetime';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'agents-status-table',
  templateUrl: './agents-status-table.component.html',
  standalone: false
})
export class AgentsStatusTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
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
        async: (agent: JAgent) => this.renderActiveAgent(agent),
        export: async (agent: JAgent) => await this.renderActiveAgent(agent)
      },
      {
        id: AgentsStatusTableCol.NAME,
        dataKey: 'agentName',
        render: (agent: JAgent) => this.renderName(agent),
        routerLinkNoCache: (agent: JAgent) => this.renderAgentLink(agent),
        isSortable: true,
        export: async (agent: JAgent) => agent.agentName
      },
      {
        id: AgentsStatusTableCol.AGENT_STATUS,
        dataKey: 'isActive',
        icons: (agent: JAgent) => this.renderStatusIcon(agent),
        render: (agent: JAgent) => this.renderStatus(agent),
        export: async (agent: JAgent) => (agent.isActive ? 'Active' : 'Inactive'),
        isSortable: true
      },
      {
        id: AgentsStatusTableCol.WORKING_ON,
        dataKey: 'workingOn',
        async: (agent: JAgent) => this.renderWorkingOn(agent),
        isSortable: false,
        export: async (agent: JAgent) => (await this.exportWorkingOn(agent)) + ''
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

  // --- Render functions ---

  @Cacheable(['id'])
  async renderActiveAgent(agent: JAgent): Promise<string> {
    const agentSpeed = await this.utilService.calculateSpeed(agent.id, true).toPromise();
    return agentSpeed > 0 ? 'Running task' : 'Stopped task';
  }

  @Cacheable(['id', 'agentName'])
  renderName(agent: JAgent): SafeHtml {
    const agentName = agent.agentName?.length > 40 ? `${agent.agentName.substring(40)}...` : agent.agentName;
    const isTrusted = agent.isTrusted
      ? '<span><fa-icon icon="faLock" aria-hidden="true" ngbTooltip="Trust agent with secret data" /></span>'
      : '';

    return this.sanitize(`<a>${agentName}</a>${isTrusted}`);
  }

  @Cacheable(['id'])
  async renderCurrentSpeed(agent: JAgent): Promise<SafeHtml> {
    let html = '-';
    const speed = await this.getSpeed(agent);
    if (speed) {
      html = `${speed} H/s`;
    }
    return this.sanitize(html);
  }

  @Cacheable(['id'])
  async renderTimeSpent(agent: JAgent): Promise<SafeHtml> {
    let html = '-';
    const timeSpent = await this.getTimeSpent(agent);
    if (timeSpent) {
      html = `${formatSeconds(timeSpent)}`;
    }
    return this.sanitize(html);
  }

  @Cacheable(['id'])
  async renderSearched(agent: JAgent): Promise<SafeHtml> {
    let html = '-';
    const searched = await this.getSearched(agent);
    if (searched) {
      html = `${searched}`;
    }
    return this.sanitize(html);
  }

  @Cacheable(['id'])
  async renderCracked(agent: JAgent): Promise<HTTableRouterLink[]> {
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

  @Cacheable(['id'])
  async renderProgressIcon(agent: JAgent): Promise<HTTableIcon[]> {
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
  renderStatus(agent: JAgent): SafeHtml {
    let html: string;
    if (agent.isActive) {
      html = '<span class="pill pill-active">Active</span>';
    } else {
      html = '<span class="pill pill-inactive">Inactive</span>';
    }

    return this.sanitize(html);
  }

  @Cacheable(['id', 'speed'])
  async renderWorkingOn(agent: JAgent): Promise<SafeHtml> {
    let html = '';
    const speed = await this.getSpeed(agent);
    if (speed) {
      html = `
        <div>
        <div>Task: <a href="/tasks/show-tasks/${agent.taskId}/edit">${agent.taskName}</a></div>
        <div>at ${speed} H/s,<br></div>
        <div>working on chunk <a href="/tasks/chunks/${agent.chunkId}/view">${agent.chunkId}</a></div>
        </div>
      `;
    }

    return this.sanitize(html);
  }

  @Cacheable(['id', 'speed'])
  async exportWorkingOn(agent: JAgent): Promise<SafeHtml> {
    const speed = await this.getSpeed(agent);
    if (speed) {
      return `Task: ${agent.taskName} at ${speed} H/s, working on chunk ${agent.chunkId}`;
    } else {
      return '-';
    }
  }

  @Cacheable(['id', 'lastTime'])
  renderLastActivity(agent: JAgent): SafeHtml {
    const formattedDate = formatUnixTimestamp(agent.lastTime, this.dateFormat);
    const action = `Action: ${agent.lastAct}<br>`;
    const time = `Time: ${formattedDate}<br>`;
    const ip = agent.lastIp ? `<div>IP: ${agent.lastIp}</div>` : '';

    const data = `${action}${time}${ip}`;
    return this.sanitize(data);
  }

  private async getSpeed(agent: JAgent): Promise<number> {
    return this.getChunkDataParam(agent.id, 'speed');
  }

  private async getSearched(agent: JAgent): Promise<number> {
    return this.getChunkDataParam(agent.id, 'searched');
  }

  private async getTimeSpent(agent: JAgent): Promise<number> {
    return this.getChunkDataParam(agent.id, 'timeSpent');
  }

  private async getCracked(agent: JAgent): Promise<number> {
    return this.getChunkDataParam(agent.id, 'cracked');
  }

  private async getChunkDataParam(agentId: number, key: string): Promise<number> {
    const cd: ChunkDataData = await this.getChunkData(agentId);
    if (cd[key]) {
      return cd[key];
    }

    return 0;
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
