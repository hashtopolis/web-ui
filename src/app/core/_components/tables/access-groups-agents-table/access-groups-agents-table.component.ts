import { catchError } from 'rxjs';
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { JAgent } from '@src/app/core/_models/agent.model';

import {
  AccessGroupsAgentsTableCol,
  AccessGroupsAgentsTableColumnLabel
} from '@src/app/core/_components/tables/access-groups-agents-table/access-groups-agents-table.constants';
import { HTTableColumn, HTTableRouterLink } from '@src/app/core/_components/tables/ht-table/ht-table.models';
import { ActionMenuEvent } from '@src/app/core/_components/menus/action-menu/action-menu.model';
import { BaseTableComponent } from '@src/app/core/_components/tables/base-table/base-table.component';
import { BulkActionMenuAction } from '@src/app/core/_components/menus/bulk-action-menu/bulk-action-menu.constants';
import { DialogData } from '@src/app/core/_components/tables/table-dialog/table-dialog.model';
import { ExportMenuAction } from '@src/app/core/_components/menus/export-menu/export-menu.constants';
import { RowActionMenuAction } from '@src/app/core/_components/menus/row-action-menu/row-action-menu.constants';
import { TableDialogComponent } from '@src/app/core/_components/tables/table-dialog/table-dialog.component';

import { AccessGroupsExpandDataSource } from '@src/app/core/_datasources/access-groups-expand.datasource';

import { SERV } from '@src/app/core/_services/main.config';

@Component({
    selector: 'access-groups-agents-table',
    templateUrl: './access-groups-agents-table.component.html',
    standalone: false
})
export class AccessGroupsAgentsTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  @Input() accessgroupId = 0;

  tableColumns: HTTableColumn[] = [];
  dataSource: AccessGroupsExpandDataSource;
  include = 'agentMembers';

  ngOnInit(): void {
    this.setColumnLabels(AccessGroupsAgentsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AccessGroupsExpandDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    if (this.accessgroupId) {
      this.dataSource.setAccessGroupId(this.accessgroupId);
      this.dataSource.setAccessGroupExpand(this.include);
    }
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: JAgent, filterValue: string): boolean {
    return item.taskName.toLowerCase().includes(filterValue);
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: AccessGroupsAgentsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        render: (agent: JAgent) => agent.id,
        export: async (agent: JAgent) => agent.id + ''
      },
      {
        id: AccessGroupsAgentsTableCol.NAME,
        dataKey: 'agentName',
        routerLink: (agent: JAgent) => this.renderAgentLink(agent),
        isSortable: true,
        export: async (agent: JAgent) => agent.agentName
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
            case BulkActionMenuAction.DELETE:
              this.bulkActionUnassign(result.data);
              break;
          }
        }
      })
    );
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<JAgent[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<JAgent>(
          'hashtopolis-access-groups-agents',
          this.tableColumns,
          event.data,
          AccessGroupsAgentsTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<JAgent>(
          'hashtopolis-access-groups-agents',
          this.tableColumns,
          event.data,
          AccessGroupsAgentsTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<JAgent>(this.tableColumns, event.data, AccessGroupsAgentsTableColumnLabel)
          .then(() => {
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

  bulkActionClicked(event: ActionMenuEvent<JAgent[]>): void {
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
  private bulkActionUnassign(agents: JAgent[]): void {
    //Get the IDs of agents
    const agentIdsToDelete = agents.map((agents) => agents.id);
    //Remove the selected agents from the list
    const updatedPretasks = this.dataSource.getData().filter((agents) => !agentIdsToDelete.includes(agents.id));
    //Update the supertask with the modified list of pretasks
    const payload = {
      userMembers: updatedPretasks.map((agents) => agents.id)
    };
    //Update the supertask with the new list of pretasks
    const updateRequest = this.gs.update(SERV.ACCESS_GROUPS, this.accessgroupId, payload);
    this.subscriptions.push(
      updateRequest
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open(`Successfully unassigned ${agents.length} users!`, 'Close');
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(agents: JAgent[]): void {
    //Get the IDs of agents to be deleted
    const agentIdsToDelete = agents.map((agents) => agents.id);
    //Remove the selected agents from access groups
    const updatedAccessGroups = this.dataSource
      .getData()
      .filter((accessGroup) => !agentIdsToDelete.includes(accessGroup.id));
    //Update the accessGroup with the updated list of agents
    const payload = { agents: updatedAccessGroups.map((accessGroup) => accessGroup.id) };
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

  private rowActionEdit(agent: JAgent): void {
    this.renderUserLink(agent).then((links: HTTableRouterLink[]) => {
      this.router.navigate(links[0].routerLink);
    });
  }
}
