import { Observable, catchError, forkJoin, of } from 'rxjs';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { JAgent } from '@models/agent.model';
import { ChunkData } from '@models/chunk.model';

import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { ExportMenuAction } from '@components/menus/export-menu/export-menu.constants';
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

import { Cacheable } from '@src/app/core/_decorators/cacheable';
import { formatSeconds, formatUnixTimestamp } from '@src/app/shared/utils/datetime';

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

  filter(item: JAgent, filterValue: string): boolean {
    return (
      item.agentName.toLowerCase().includes(filterValue) ||
      item.clientSignature.toLowerCase().includes(filterValue) ||
      item.devices.toLowerCase().includes(filterValue)
    );
  }

  getColumns(): HTTableColumn[] {
    const tableColumns: HTTableColumn[] = [
      {
        id: AgentsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        render: (agent: JAgent) => agent.id,
        export: async (agent: JAgent) => agent.id + ''
      },
      {
        id: AgentsTableCol.NAME,
        dataKey: 'agentName',
        routerLinkNoCache: (agent: JAgent) => this.renderAgentLink(agent),
        isSortable: true,
        export: async (agent: JAgent) => agent.agentName
      },
      {
        id: AgentsTableCol.STATUS,
        dataKey: 'status',
        iconsNoCache: (agent: JAgent) => this.renderStatusIcon(agent),
        render: (agent: JAgent) => this.renderStatus(agent),
        isSortable: true,
        export: async (agent: JAgent) => (agent.isActive ? 'Active' : 'Inactive')
      },
      {
        id: AgentsTableCol.USER,
        dataKey: 'userId',
        render: (agent: JAgent) => this.renderOwner(agent),
        routerLinkNoCache: (agent: JAgent) => this.renderUserLinkFromAgent(agent),
        isSortable: true,
        export: async (agent: JAgent) => (agent.user ? agent.user.name : '')
      },
      {
        id: AgentsTableCol.CLIENT,
        dataKey: 'clientSignature',
        render: (agent: JAgent) => this.renderClient(agent),
        isSortable: true,
        export: async (agent: JAgent) => (agent.clientSignature ? agent.clientSignature : '')
      },
      {
        id: AgentsTableCol.TASK_SPEED,
        dataKey: 'taskId',
        icons: (agent: JAgent) => this.renderProgressIcon(agent),
        async: (agent: JAgent) => this.renderCurrentSpeed(agent),
        isSortable: false,
        export: async (agent: JAgent) => (await this.getSpeed(agent)) + ''
      },
      {
        id: AgentsTableCol.CURRENT_CHUNK,
        dataKey: 'chunkId',
        routerLinkNoCache: (agent: JAgent) => this.renderChunkLink(agent),
        isSortable: true,
        export: async (agent: JAgent) => (agent.chunk ? agent.chunk.id + '' : '')
      },
      {
        id: AgentsTableCol.GPUS_CPUS,
        dataKey: 'devices',
        render: (agent: JAgent) => this.renderDevices(agent),
        isSortable: true,
        export: async (agent: JAgent) => agent.devices
      },
      {
        id: AgentsTableCol.LAST_ACTIVITY,
        dataKey: 'lastTime',
        render: (agent: JAgent) => this.renderLastActivity(agent),
        isSortable: true,
        export: async (agent: JAgent) => formatUnixTimestamp(agent.lastTime, this.dateFormat)
      },
      {
        id: AgentsTableCol.CRACKED,
        dataKey: 'cracked',
        //routerLinkNoCache: (agent: JAgent) => this.renderCrackedLink(agent),
        isSortable: true,
        export: async (agent: JAgent) => (await this.getCracked(agent)) + ''
      }
    ];

    if (this.taskId === 0) {
      // If this is not assigned agents, add task and access group
      tableColumns.push({
        id: AgentsTableCol.CURRENT_TASK,
        dataKey: 'taskName',
        routerLinkNoCache: (agent: JAgent) => this.renderTaskLink(agent),
        isSortable: true,
        export: async (agent: JAgent) => (agent.task ? agent.taskName : '')
      });
      tableColumns.push({
        id: AgentsTableCol.ACCESS_GROUP,
        dataKey: 'accessGroupId',
        routerLinkNoCache: (agent: JAgent) => this.renderAccessGroupLinks(agent),
        isSortable: true,
        export: async (agent: JAgent) => agent.accessGroup
      });
    } else {
      // If this is assigned agents, add benchmark, time spent and keyspace searched
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
        async: (agent: JAgent) => this.renderTimeSpent(agent),
        icons: undefined,
        isSortable: true,
        export: async (agent: JAgent) => (await this.getTimeSpent(agent)) + ''
      });
      tableColumns.push({
        id: AgentsTableCol.SEARCHED,
        dataKey: 'searched',
        async: (agent: JAgent) => this.renderSearched(agent),
        icons: undefined,
        isSortable: true,
        export: async (agent: JAgent) => (await this.getSearched(agent)) + ''
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

  // --- Render functions ---
  @Cacheable(['id']) async renderCurrentSpeed(agent: JAgent): Promise<SafeHtml> {
    let html = '-';
    const speed = await this.getSpeed(agent);
    if (speed) {
      html = `${speed} H/s`;
    }
    return this.sanitize(html);
  }

  @Cacheable(['id']) async renderTimeSpent(agent: JAgent): Promise<SafeHtml> {
    let html = '-';
    const timeSpent = await this.getTimeSpent(agent);
    if (timeSpent) {
      html = `${formatSeconds(timeSpent)}`;
    }
    return this.sanitize(html);
  }

  @Cacheable(['id']) async renderSearched(agent: JAgent): Promise<SafeHtml> {
    let html = '-';
    const searched = await this.getSearched(agent);
    if (searched) {
      html = `${searched}`;
    }
    return this.sanitize(html);
  }

  @Cacheable(['id'])
  async renderCracked(agent: JAgent): Promise<SafeHtml> {
    let html = '';
    const cracked = await this.getCracked(agent);
    if (cracked) {
      html = `<span>${cracked}</span>`;
    }
    return this.sanitize(html);
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
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<JAgent>('hashtopolis-agents', this.tableColumns, event.data, AgentsTableColumnLabel);
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<JAgent>('hashtopolis-agents', this.tableColumns, event.data, AgentsTableColumnLabel);
        break;
      case ExportMenuAction.COPY:
        this.exportService.toClipboard<JAgent>(this.tableColumns, event.data, AgentsTableColumnLabel).then(() => {
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
          title: `${this.assignAgents ? 'Unassigning' : 'Deleting'}  ${event.data.agentName} ...`,
          icon: 'warning',
          body: `Are you sure you want to ${this.assignAgents ? 'unassign' : 'delete'} ${event.data.agentName}? Note that this action cannot be undone.`,
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
  private renderCrackedLink(agent: JAgent): Observable<HTTableRouterLink[]> {
    const observable$ = new Observable<HTTableRouterLink[]>((subscriber) => {
      (async () => {
        try {
          const response = await this.getCracked(agent);
          subscriber.next([{ label: response + '', routerLink: ['/hashlists', 'hashes', 'tasks', agent.taskId] }]);
          subscriber.complete();
        } catch (error) {
          subscriber.error(error);
        }
      })();
    });

    return observable$;
  }
  */

  private async getSpeed(agent: JAgent): Promise<number> {
    return this.getChunkDataParam(agent.id, 'speed');
  }

  private async getSearched(agent: JAgent): Promise<number> {
    return this.getChunkDataParam(agent.id, 'searched');
  }

  // --- Action functions ---

  private async getTimeSpent(agent: JAgent): Promise<number> {
    return this.getChunkDataParam(agent.id, 'timeSpent');
  }

  private async getCracked(agent: JAgent): Promise<number> {
    return this.getChunkDataParam(agent.id, 'cracked');
  }

  private async getChunkDataParam(agentId: number, key: string): Promise<number> {
    const cd: ChunkData = await this.getChunkData(agentId);
    if (cd[key]) {
      return cd[key];
    }

    return 0;
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
    let requests;
    if (this.taskId === 0) {
      requests = agents.map((agent: JAgent) => {
        return this.gs.delete(SERV.AGENTS, agent.id);
      });
    } else {
      requests = agents.map((agent: JAgent) => {
        return this.gs.delete(SERV.AGENT_ASSIGN, agent.assignmentId);
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
          this.snackBar.open(`Successfully deleted ${results.length} agents!`, 'Close');
          this.dataSource.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(agent: JAgent): void {
    if (this.taskId === 0) {
      this.subscriptions.push(
        this.gs.delete(SERV.AGENTS, agent[0].id).subscribe(() => {
          this.snackBar.open('Successfully deleted agent!', 'Close');
          this.dataSource.reload();
        })
      );
    } else {
      this.subscriptions.push(
        this.gs.delete(SERV.AGENT_ASSIGN, agent[0].assignmentId).subscribe(() => {
          this.snackBar.open('Successfully unassigned agent!', 'Close');
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

  private changeBenchmark(agent: JAgent, benchmark: string): void {
    if (!benchmark || agent.benchmark == benchmark) {
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
          this.snackBar.open(`Changed benchmark to ${benchmark} on Agent #${agent.id}!`, 'Close');
          this.reload();
        })
    );
  }
}
