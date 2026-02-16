import { Observable, catchError, of } from 'rxjs';

import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

import { JGlobalPermissionGroup } from '@models/global-permission-group.model';

import { PermissionsContextMenuService } from '@services/context-menu/users/permissions-menu.service';
import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { HTTableColumn, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';
import {
  PermissionsTableCol,
  PermissionsTableColumnLabel
} from '@components/tables/permissions-table/permissions-table.constants';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';

import { PermissionsDataSource } from '@datasources/permissions.datasource';

import { FilterType } from '@src/app/core/_models/request-params.model';

@Component({
  selector: 'app-permissions-table',
  templateUrl: './permissions-table.component.html',
  standalone: false
})
export class PermissionsTableComponent extends BaseTableComponent implements OnInit, OnDestroy, AfterViewInit {
  tableColumns: HTTableColumn[] = [];
  dataSource: PermissionsDataSource;
  selectedFilterColumn: HTTableColumn;

  ngOnInit(): void {
    this.setColumnLabels(PermissionsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new PermissionsDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
    this.contextMenuService = new PermissionsContextMenuService(this.permissionService).addContextMenu();
    // Setup filter error handling
    this.setupFilterErrorSubscription(this.dataSource);
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
  filter(input: string) {
    const selectedColumn = this.selectedFilterColumn;
    if (input && input.length > 0) {
      this.dataSource.loadAll({ value: input, field: selectedColumn.dataKey, operator: FilterType.ICONTAINS, parent: selectedColumn.parent });
      return;
    } else {
      this.dataSource.loadAll(); // Reload all data if input is empty
    }
  }
  handleBackendSqlFilter(event: string) {
    if (event && event.trim().length > 0) {
      this.filter(event);
    } else {
      // Clear the filter when search box is cleared
      this.dataSource.clearFilter();
    }
  }
  getColumns(): HTTableColumn[] {
    return [
      {
        id: PermissionsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        isSearchable: true,
        export: async (permission: JGlobalPermissionGroup) => permission.id + ''
      },
      {
        id: PermissionsTableCol.NAME,
        dataKey: 'name',
        routerLink: (permission: JGlobalPermissionGroup) => this.renderPermissionLink(permission),
        isSortable: true,
        isSearchable: true,
        export: async (permission: JGlobalPermissionGroup) => permission.name
      },
      {
        id: PermissionsTableCol.MEMBERS,
        dataKey: 'numUsers',
        isSortable: false,
        render: (permission: JGlobalPermissionGroup) => permission.userMembers.length,
        export: async (permission: JGlobalPermissionGroup) => permission.userMembers.length + ''
      }
    ];
  }

  openDialog(data: DialogData<JGlobalPermissionGroup>) {
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

  exportActionClicked(event: ActionMenuEvent<JGlobalPermissionGroup[]>): void {
    this.exportService.handleExportAction<JGlobalPermissionGroup>(
      event,
      this.tableColumns,
      PermissionsTableColumnLabel,
      'hashtopolis-permissions'
    );
  }

  rowActionClicked(event: ActionMenuEvent<JGlobalPermissionGroup>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting permission ${event.data.name} ...`,
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

  bulkActionClicked(event: ActionMenuEvent<JGlobalPermissionGroup[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} permissions ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above permissions? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'name',
          action: event.menuItem.action
        });
        break;
    }
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(permissions: JGlobalPermissionGroup[]): void {
    this.subscriptions.push(
      this.gs
        .bulkDelete(SERV.ACCESS_PERMISSIONS_GROUPS, permissions)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion: ', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage(`Successfully deleted permission groups!`);
          this.dataSource.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(permissions: JGlobalPermissionGroup[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.ACCESS_PERMISSIONS_GROUPS, permissions[0].id)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage('Successfully deleted permission group!');
          this.reload();
        })
    );
  }

  private rowActionEdit(permission: JGlobalPermissionGroup): void {
    this.router.navigate(['/users', 'global-permissions-groups', permission.id, 'edit']);
  }

  /**
   * Render edit permission group link
   * @param permissionGroup - permissiongroup object to render edit link for
   * @return observable araay containing link
   * @private
   */
  private renderPermissionLink(permissionGroup: JGlobalPermissionGroup): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (permissionGroup) {
      links.push({
        routerLink: ['/users', 'global-permissions-groups', permissionGroup.id, 'edit'],
        label: permissionGroup.name
      });
    }
    return of(links);
  }
}
