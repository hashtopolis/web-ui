import { catchError, of } from 'rxjs';

import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { AccessGroupsAgentContextMenuService } from '@services/context-menu/users/access-groups-agent-menu.service';

import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';

import { ActionMenuEvent } from '@src/app/core/_components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@src/app/core/_components/menus/bulk-action-menu/bulk-action-menu.constants';
import {
  AccessGroupsAgentsTableCol,
  AccessGroupsAgentsTableColumnLabel
} from '@src/app/core/_components/tables/access-groups-agents-table/access-groups-agents-table.constants';
import { BaseTableComponent } from '@src/app/core/_components/tables/base-table/base-table.component';
import { HTTableColumn } from '@src/app/core/_components/tables/ht-table/ht-table.models';
import { TableDialogComponent } from '@src/app/core/_components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@src/app/core/_components/tables/table-dialog/table-dialog.model';
import { AccessGroupsExpandDataSource } from '@src/app/core/_datasources/access-groups-expand.datasource';
import { JAgent } from '@src/app/core/_models/agent.model';
import { RelationshipType, SERV } from '@src/app/core/_services/main.config';

@Component({
  selector: 'app-access-groups-agents-table',
  templateUrl: './access-groups-agents-table.component.html',
  standalone: false
})
export class AccessGroupsAgentsTableComponent extends BaseTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() accessgroupId = 0;
  @Output() agentsRemoved = new EventEmitter<void>(); // Event to notify parent about removed agent(s)

  tableColumns: HTTableColumn[] = [];
  dataSource: AccessGroupsExpandDataSource;
  include = 'agentMembers';
  selectedFilterColumn: HTTableColumn = this.getColumns()[1]; // Default filter column

  ngOnInit(): void {
    this.setColumnLabels(AccessGroupsAgentsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AccessGroupsExpandDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
    if (this.accessgroupId) {
      this.dataSource.setAccessGroupId(this.accessgroupId);
      this.dataSource.setAccessGroupExpand(this.include);
    }
    this.contextMenuService = new AccessGroupsAgentContextMenuService(this.permissionService).addContextMenu();
  }

  ngAfterViewInit(): void {
    // Wait until paginator is defined
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  handleFilter(filterValue: string): void {
    this.dataSource.filterData(filterValue || '', this.selectedFilterColumn.dataKey);
  }

  onFilterColumnChanged(column: HTTableColumn): void {
    this.selectedFilterColumn = column;
    // Re-apply current filter with new column
    const currentFilterValue = this.dataSource['currentFilterValue'] || '';
    if (currentFilterValue) {
      this.dataSource.filterData(currentFilterValue, column.dataKey);
    }
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: AccessGroupsAgentsTableCol.ID,
        dataKey: '_id',
        routerLink: (agent: JAgent) => {
          return of([
            {
              routerLink: ['/agents', agent.id, 'edit'],
              label: agent.id?.toString()
            }
          ]);
        },
        isSortable: true,
        isSearchable: true,
        export: async (agent: JAgent) => agent.id + ''
      },
      {
        id: AccessGroupsAgentsTableCol.NAME,
        dataKey: 'agentName',
        routerLink: (agent: JAgent) => this.renderAgentLink(agent),
        isSortable: true,
        isSearchable: true,
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
          this.bulkActionUnassign(result.data);
        }
      })
    );
  }

  // --- Action functions ---
  exportActionClicked(event: ActionMenuEvent<JAgent[]>): void {
    this.exportService.handleExportAction<JAgent>(
      event,
      this.tableColumns,
      AccessGroupsAgentsTableColumnLabel,
      'hashtopolis-access-groups-agents'
    );
  }

  bulkActionClicked(event: ActionMenuEvent<JAgent[]>): void {
    // Prepare dialog data
    const dialogData: DialogData<JAgent> = {
      rows: event.data,
      title: `Remove ${event.data.length} access group agent${event.data.length > 1 ? 's' : ''} ...`,
      icon: 'warning',
      body: `Are you sure you want to remove the above agent${event.data.length > 1 ? 's' : ''} from the access group?`,
      warn: true,
      listAttribute: 'agentName',
      action: BulkActionMenuAction.DELETE
    };

    // Open confirmation dialog
    this.openDialog(dialogData);
  }

  rowActionClicked(event: ActionMenuEvent<JAgent>): void {
    if (event.menuItem.action === RowActionMenuAction.DELETE) {
      this.openDialog({
        rows: [event.data],
        title: `Remove agent from access group`,
        icon: 'warning',
        body: `Are you sure you want to remove "${event.data.agentName}" from this access group?`,
        warn: true,
        action: event.menuItem.action
      });
    }
  }

  /**
   * Remove agents from access group
   */
  private bulkActionUnassign(agents: JAgent[]): void {
    //Get the IDs of agents
    const agentIdsToDelete = agents.map((agents) => agents.id);

    const payload = {
      data: agentIdsToDelete.map((id) => {
        return { type: RelationshipType.AGENTMEMBER, id: id };
      })
    };

    // Remove the agents from the access group
    const removeRequest = this.gs.deleteRelationships(
      SERV.ACCESS_GROUPS,
      this.accessgroupId,
      RelationshipType.AGENTMEMBER,
      payload
    );
    this.subscriptions.push(
      removeRequest
        .pipe(
          catchError((error) => {
            const msg = 'Error while removing agents from access group';
            console.error(`${msg}: `, error);
            this.alertService.showErrorMessage(msg);
            return [];
          })
        )
        .subscribe(() => {
          this.agentsRemoved.emit();
          this.alertService.showSuccessMessage(
            `Successfully removed ${agents.length} agent${agents.length > 1 ? 's' : ''} from this group`
          );
          this.reload();
        })
    );
  }
}
