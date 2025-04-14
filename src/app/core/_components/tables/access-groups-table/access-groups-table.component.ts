import {
  AccessGroupsTableCol,
  AccessGroupsTableColumnLabel
} from './access-groups-table.constants';
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HTTableColumn, HTTableRouterLink } from '../ht-table/ht-table.models';
import { catchError, forkJoin } from 'rxjs';

import { JAccessGroup } from 'src/app/core/_models/access-group.model';
import { AccessGroupsDataSource } from 'src/app/core/_datasources/access-groups.datasource';
import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';

@Component({
    selector: 'access-groups-table',
    templateUrl: './access-groups-table.component.html',
    standalone: false
})
export class AccessGroupsTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  tableColumns: HTTableColumn[] = [];
  dataSource: AccessGroupsDataSource;

  ngOnInit(): void {
    this.setColumnLabels(AccessGroupsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AccessGroupsDataSource(
      this.cdr,
      this.gs,
      this.uiService
    );
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: JAccessGroup, filterValue: string): boolean {
    if (item.groupName.toLowerCase().includes(filterValue)) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: AccessGroupsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        export: async (accessGroup: JAccessGroup) => accessGroup.id + ''
      },
      {
        id: AccessGroupsTableCol.NAME,
        dataKey: 'groupName',
        routerLink: (accessGroup: JAccessGroup) =>
          this.renderAccessGroupLink(accessGroup),
        isSortable: true,
        export: async (accessGroup: JAccessGroup) => accessGroup.groupName
      },
      {
        id: AccessGroupsTableCol.NUSERS,
        dataKey: 'nusers',
        isSortable: true,
        render: (accessGroup: JAccessGroup) => {
          return accessGroup.userMembers.length.toString();
        },
        export: async (accessGroup: JAccessGroup) =>
          accessGroup.userMembers.length.toString()
      },
      {
        id: AccessGroupsTableCol.NAGENTS,
        dataKey: 'nagents',
        isSortable: true,
        render: (accessGroup: JAccessGroup) => {
          return accessGroup.agentMembers.length.toString();
        },
        export: async (accessGroup: JAccessGroup) =>
          accessGroup.agentMembers.length.toString()
      }
    ];

    return tableColumns;
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
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<JAccessGroup>(
          'hashtopolis-access-groups',
          this.tableColumns,
          event.data,
          AccessGroupsTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<JAccessGroup>(
          'hashtopolis-access-groups',
          this.tableColumns,
          event.data,
          AccessGroupsTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<JAccessGroup>(
            this.tableColumns,
            event.data,
            AccessGroupsTableColumnLabel
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
    const requests = accessGroups.map((accessGroup: JAccessGroup) => {
      return this.gs.delete(SERV.ACCESS_GROUPS, accessGroup.id);
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
            `Successfully deleted ${results.length} access groups!`,
            'Close'
          );
          this.reload();
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
          this.snackBar.open('Successfully deleted accessGroup!', 'Close');
          this.reload();
        })
    );
  }

  private rowActionEdit(accessGroup: JAccessGroup): void {
    this.renderAccessGroupLink(accessGroup).then(
      (links: HTTableRouterLink[]) => {
        this.router.navigate(links[0].routerLink);
      }
    );
  }
}
