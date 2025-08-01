import {
  AccessGroupsTableCol,
  AccessGroupsTableColumnLabel
} from '@components/tables/access-groups-table/access-groups-table.constants';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HTTableColumn, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';

import { AccessGroupsContextMenuService } from '@services/context-menu/users/access-groups-menu.service';
import { AccessGroupsDataSource } from '@datasources/access-groups.datasource';
import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';
import { FilterType } from '@src/app/core/_models/request-params.model';
import { JAccessGroup } from '@models/access-group.model';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { SERV } from '@services/main.config';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-access-groups-table',
  templateUrl: './access-groups-table.component.html',
  standalone: false
})
export class AccessGroupsTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  tableColumns: HTTableColumn[] = [];
  dataSource: AccessGroupsDataSource;
  selectedFilterColumn: string;

  ngOnInit(): void {
    this.setColumnLabels(AccessGroupsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AccessGroupsDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
    this.contextMenuService = new AccessGroupsContextMenuService(this.permissionService).addContextMenu();
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(input: string) {
    const selectedColumn = this.selectedFilterColumn;
    if (input && input.length > 0) {
      this.dataSource.loadAll({ value: input, field: selectedColumn, operator: FilterType.ICONTAINS });
      return;
    } else {
      this.dataSource.loadAll(); // Reload all data if input is empty
    }
  }
  getColumns(): HTTableColumn[] {
    return [
      {
        id: AccessGroupsTableCol.ID,
        dataKey: '_id',
        isSortable: true,
        isSearchable: true,
        render: (accessGroup: JAccessGroup) => accessGroup.id,
        export: async (accessGroup: JAccessGroup) => accessGroup.id + ''
      },
      {
        id: AccessGroupsTableCol.NAME,
        dataKey: 'groupName',
        routerLink: (accessGroup: JAccessGroup) => this.renderAccessGroupLink(accessGroup),
        isSortable: true,
        isSearchable: true,
        export: async (accessGroup: JAccessGroup) => accessGroup.groupName
      },
      {
        id: AccessGroupsTableCol.NUSERS,
        dataKey: 'nusers',
        isSortable: false,
        render: (accessGroup: JAccessGroup) => {
          return accessGroup.userMembers.length.toString();
        },
        export: async (accessGroup: JAccessGroup) => accessGroup.userMembers.length.toString()
      },
      {
        id: AccessGroupsTableCol.NAGENTS,
        dataKey: 'nagents',
        isSortable: false,
        render: (accessGroup: JAccessGroup) => {
          return accessGroup.agentMembers.length.toString();
        },
        export: async (accessGroup: JAccessGroup) => accessGroup.agentMembers.length.toString()
      }
    ];
  }

  openDialog(data: DialogData<JAccessGroup>) {
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
              this.bulkActionDelete(result.data);
              break;
          }
        }
      })
    );
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<JAccessGroup[]>): void {
    this.exportService.handleExportAction<JAccessGroup>(
      event,
      this.tableColumns,
      AccessGroupsTableColumnLabel,
      'hashtopolis-access-groups'
    );
  }

  rowActionClicked(event: ActionMenuEvent<JAccessGroup>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting access group ${event.data.groupName} ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
      case RowActionMenuAction.EDIT:
        this.rowActionEdit(event.data);
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<JAccessGroup[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} access groups ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above access groups? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'groupName',
          action: event.menuItem.action
        });
        break;
    }
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(accessGroups: JAccessGroup[]): void {
    this.subscriptions.push(
      this.gs
        .bulkDelete(SERV.ACCESS_GROUPS, accessGroups)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion: ', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage(`Successfully deleted accessgroups!`);
          this.dataSource.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(accessGroups: JAccessGroup[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.ACCESS_GROUPS, accessGroups[0].id)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage('Successfully deleted accessGroup!');
          this.reload();
        })
    );
  }

  private rowActionEdit(accessGroup: JAccessGroup): void {
    this.renderAccessGroupLink(accessGroup).subscribe((links: HTTableRouterLink[]) => {
      this.router.navigate(links[0].routerLink).then(() => {});
    });
  }
}
