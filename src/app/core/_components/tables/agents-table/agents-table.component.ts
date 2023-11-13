/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HTTableColumn, HTTableRouterLink } from '../ht-table/ht-table.models';
import { catchError, forkJoin } from 'rxjs';

import { AccessGroup } from 'src/app/core/_models/access-group.model';
import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { Agent } from 'src/app/core/_models/agent.model';
import { AgentsDataSource } from 'src/app/core/_datasources/agents.datasource';
import { AgentsTableColumnLabel } from './agents-table.constants';
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
import { formatUnixTimestamp } from 'src/app/shared/utils/datetime';

@Component({
  selector: 'agents-table',
  templateUrl: './agents-table.component.html'
})
export class AgentsTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  tableColumns: HTTableColumn[] = [];
  dataSource: AgentsDataSource;
  chunkData: { [key: number]: ChunkData } = {};

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.tableColumns = this.getColumns();
    this.dataSource = new AgentsDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.loadAll();
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
    const tableColumns = [
      {
        name: AgentsTableColumnLabel.ID,
        dataKey: '_id',
        isSortable: true,
        export: async (agent: Agent) => agent._id + ''
      },
      {
        name: AgentsTableColumnLabel.STATUS,
        dataKey: 'status',
        render: (agent: Agent) => this.renderStatus(agent),
        isSortable: true,
        export: async (agent: Agent) => (agent.isActive ? 'Active' : 'Inactive')
      },
      {
        name: AgentsTableColumnLabel.NAME,
        dataKey: 'agentName',
        routerLink: (agent: Agent) => [
          {
            routerLink: ['/agents', 'show-agents', agent._id, 'edit']
          }
        ],
        isSortable: true,
        export: async (agent: Agent) => agent.agentName
      },
      {
        name: AgentsTableColumnLabel.USER,
        dataKey: 'userId',
        render: (agent: Agent) => this.renderOwner(agent),
        routerLink: (agent: Agent) => [
          {
            routerLink: agent.userId ? ['/users', agent.userId, 'edit'] : []
          }
        ],
        isSortable: true,
        export: async (agent: Agent) => (agent.user ? agent.user.name : '')
      },
      {
        name: AgentsTableColumnLabel.CLIENT,
        dataKey: 'clientSignature',
        render: (agent: Agent) => this.renderClient(agent),
        isSortable: true,
        export: async (agent: Agent) =>
          agent.clientSignature ? agent.clientSignature : ''
      },
      {
        name: AgentsTableColumnLabel.CURRENT_TASK,
        dataKey: 'taskName',
        routerLink: (agent: Agent) => [
          {
            routerLink: agent.task
              ? ['/tasks', 'show-tasks', agent.task._id, 'edit']
              : []
          }
        ],
        isSortable: true,
        export: async (agent: Agent) => (agent.task ? agent.task.taskName : '')
      },
      {
        name: AgentsTableColumnLabel.TASK_SPEED,
        dataKey: 'taskId',
        async: (agent: Agent) => this.renderCurrentSpeed(agent),
        isSortable: false,
        export: async (agent: Agent) => (await this.getSpeed(agent)) + ''
      },
      {
        name: AgentsTableColumnLabel.CURRENT_CHUNK,
        dataKey: 'chunkId',
        routerLink: (agent: Agent) => [
          {
            routerLink: agent.chunk
              ? ['/tasks', 'chunks', agent.chunk._id, 'view']
              : []
          }
        ],
        isSortable: true,
        export: async (agent: Agent) =>
          agent.chunk ? agent.chunk._id + '' : ''
      },
      {
        name: AgentsTableColumnLabel.GPUS_CPUS,
        dataKey: 'devices',
        isSortable: true,
        export: async (agent: Agent) => agent.devices
      },
      {
        name: AgentsTableColumnLabel.LAST_ACTIVITY,
        dataKey: 'lastTime',
        render: (agent: Agent) => this.renderLastActivity(agent),
        isSortable: true,
        export: async (agent: Agent) =>
          formatUnixTimestamp(agent.lastTime, this.dateFormat)
      },
      {
        name: AgentsTableColumnLabel.ACCESS_GROUP,
        dataKey: 'accessGroupId',
        routerLink: (agent: Agent) => this.getAccessGroupRouterLinks(agent),
        isSortable: true,
        export: async (agent: Agent) =>
          agent.accessGroups.map((item) => item.groupName).join(', ')
      }
    ];

    return tableColumns;
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

  @Cacheable(['_id', 'taskId'])
  async renderCurrentSpeed(agent: Agent): Promise<SafeHtml> {
    let html = '-';
    const speed = await this.getSpeed(agent);
    if (speed) {
      html = `${speed} H/s`;
    }
    return this.sanitize(html);
  }

  private async getSpeed(agent: Agent): Promise<number> {
    if (!(agent._id in this.chunkData)) {
      this.chunkData[agent._id] = await this.dataSource.getChunkData(agent._id);
    }
    if (this.chunkData[agent._id].speed) {
      return this.chunkData[agent._id].speed;
    }

    return 0;
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

  @Cacheable(['_id', 'accessGroupId'])
  getAccessGroupRouterLinks(agent: Agent): HTTableRouterLink[] {
    const links: HTTableRouterLink[] = agent.accessGroups.map(
      (accessGroup: AccessGroup) => {
        return {
          routerLink: [
            '/users',
            'access-groups',
            accessGroup.accessGroupId,
            'edit'
          ],
          label: accessGroup.groupName
        };
      }
    );

    return links;
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
    const data = `<code>${agent.lastAct}</code> at<br>${formattedDate}<br>IP:<code>${agent.lastIp}</code>`;

    return this.sanitize(data);
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<Agent[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<Agent>(
          'hashtopolis-agents',
          this.tableColumns,
          event.data
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<Agent>(
          'hashtopolis-agents',
          this.tableColumns,
          event.data
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<Agent>(this.tableColumns, event.data)
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
    this.router.navigate(['agents', 'show-agents', agent._id, 'edit']);
  }
}
