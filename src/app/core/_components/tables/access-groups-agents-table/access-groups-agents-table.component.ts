/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  HTTableColumn,
  HTTableEditable,
  HTTableIcon,
  HTTableRouterLink
} from '../ht-table/ht-table.models';
import {
  AccessGroupsAgentsTableCol,
  AccessGroupsAgentsTableColumnLabel
} from './access-groups-agents-table.constants';
import { catchError, forkJoin } from 'rxjs';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { Agent } from 'src/app/core/_models/agent.model';
import { AccessGroupsExpandDataSource } from 'src/app/core/_datasources/access-groups-expand.datasource';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { Cacheable } from 'src/app/core/_decorators/cacheable';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { Pretask } from 'src/app/core/_models/pretask.model';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SafeHtml } from '@angular/platform-browser';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { User } from 'src/app/core/_models/user.model';
import { UsersTableStatus } from '../users-table/users-table.constants';

@Component({
  selector: 'access-groups-agents-table',
  templateUrl: './access-groups-agents-table.component.html'
})
export class AccessGroupsAgentsTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  @Input() accessgroupId = 0;

  tableColumns: HTTableColumn[] = [];
  dataSource: AccessGroupsExpandDataSource;
  expand = 'agentMembers';

  ngOnInit(): void {
    this.setColumnLabels(AccessGroupsAgentsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AccessGroupsExpandDataSource(
      this.cdr,
      this.gs,
      this.uiService
    );
    this.dataSource.setColumns(this.tableColumns);
    if (this.accessgroupId) {
      this.dataSource.setAccessGroupId(this.accessgroupId);
      this.dataSource.setAccessGroupExpand(this.expand);
    }
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: Agent, filterValue: string): boolean {
    return item.taskName.toLowerCase().includes(filterValue);
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: AccessGroupsAgentsTableCol.ID,
        dataKey: '_id',
        isSortable: true,
        render: (agent: Agent) => agent._id,
        export: async (agent: Agent) => agent._id + ''
      },
      {
        id: AccessGroupsAgentsTableCol.NAME,
        dataKey: 'agentName',
        routerLink: (agent: Agent) => this.renderAgentLink(agent),
        isSortable: true,
        export: async (agent: Agent) => agent.agentName
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
            case BulkActionMenuAction.DELETE:
              this.bulkActionUnassign(result.data);
              break;
          }
        }
      })
    );
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<Agent[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<Agent>(
          'hashtopolis-access-groups-agents',
          this.tableColumns,
          event.data,
          AccessGroupsAgentsTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<Agent>(
          'hashtopolis-access-groups-agents',
          this.tableColumns,
          event.data,
          AccessGroupsAgentsTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<Agent>(
            this.tableColumns,
            event.data,
            AccessGroupsAgentsTableColumnLabel
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
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting Agent Access Group ${event.data.agentName} ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<Agent[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} access group agent ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above pretasks? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'agentName',
          action: event.menuItem.action
        });
        break;
    }
  }

  /**
   * Unasssign Users
   */
  private bulkActionUnassign(agents: Agent[]): void {
    //Get the IDs of pretasks to be deleted
    const usersIdsToDelete = agents.map((agents) => agents._id);
    //Remove the selected pretasks from the list
    const updatedPretasks = this.dataSource
      .getData()
      .filter((agents) => !usersIdsToDelete.includes(agents._id));
    //Update the supertask with the modified list of pretasks
    const payload = {
      userMembers: updatedPretasks.map((agents) => agents._id)
    };
    //Update the supertask with the new list of pretasks
    const updateRequest = this.gs.update(
      SERV.ACCESS_GROUPS,
      this.accessgroupId,
      payload
    );
    this.subscriptions.push(
      updateRequest
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open(
            `Successfully unassigned ${agents.length} users!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(agents: Agent[]): void {
    //Get the IDs of pretasks to be deleted
    const pretaskIdsToDelete = agents.map((agents) => agents._id);
    //Remove the selected pretasks from the list
    const updatedPretasks = this.dataSource
      .getData()
      .filter((agents) => !pretaskIdsToDelete.includes(agents._id));
    //Update the supertask with the modified list of pretasks
    const payload = { agents: updatedPretasks.map((agents) => agents._id) };
    this.subscriptions.push(
      this.gs
        .update(SERV.ACCESS_GROUPS, this.accessgroupId, payload)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open('Successfully unassigned agents!', 'Close');
          this.reload();
        })
    );
  }

  private rowActionEdit(agent: Agent): void {
    this.renderUserLink(agent).then((links: HTTableRouterLink[]) => {
      this.router.navigate(links[0].routerLink);
    });
  }
}
