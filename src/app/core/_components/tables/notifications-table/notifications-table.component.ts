import { Observable, catchError, of } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { JNotification } from '@models/notification.model';

import { NotificationsContextMenuService } from '@services/context-menu/notifications-menu.service';
import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { HTTableColumn, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';
import {
  NotificationsTableCol,
  NotificationsTableColumnLabel
} from '@components/tables/notifications-table/notifications-table.constants';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';

import { NotificationsDataSource } from '@datasources/notifications.datasource';

import { ACTION } from '@src/app/core/_constants/notifications.config';

@Component({
  selector: 'app-notifications-table',
  templateUrl: './notifications-table.component.html',
  standalone: false
})
export class NotificationsTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  tableColumns: HTTableColumn[] = [];
  dataSource: NotificationsDataSource;
  selectedFilterColumn: string = 'all';

  ngOnInit(): void {
    this.setColumnLabels(NotificationsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new NotificationsDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.contextMenuService = new NotificationsContextMenuService(this.permissionService).addContextMenu();
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: JNotification, filterValue: string): boolean {
    filterValue = filterValue.toLowerCase();
    const selectedColumn = this.selectedFilterColumn;
    // Filter based on selected column
    switch (selectedColumn) {
      case 'all': {
        // Search across multiple relevant fields
        return (
          item.id.toString().includes(filterValue) ||
          item.notification?.toLowerCase().includes(filterValue) ||
          item.action?.toLowerCase().includes(filterValue) ||
          item.receiver?.toLowerCase().includes(filterValue)
        );
      }
      case 'id': {
        return item.id.toString().includes(filterValue);
      }
      case 'action': {
        return item.action?.toLowerCase().includes(filterValue);
      }
      case 'receiver': {
        return item.receiver?.toLowerCase().includes(filterValue);
      }
      case 'notification': {
        return item.notification?.toLowerCase().includes(filterValue);
      }
      default:
        // Default fallback to task name
        return item.notification?.toLowerCase().includes(filterValue);
    }
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: NotificationsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        isSearchable: true,
        export: async (notification: JNotification) => notification.id + ''
      },
      {
        id: NotificationsTableCol.STATUS,
        dataKey: 'isActive',
        render: (notification: JNotification) => (notification.isActive ? 'Active' : 'Inactive'),
        icon: (notification: JNotification) => this.renderStatusIcon(notification),
        isSortable: true,
        export: async (notification: JNotification) => notification.isActive + ''
      },
      {
        id: NotificationsTableCol.ACTION,
        dataKey: 'action',
        isSortable: true,
        isSearchable: true,
        render: (notification: JNotification) => notification.action,
        export: async (notification: JNotification) => notification.action
      },
      {
        id: NotificationsTableCol.APPLIED_TO,
        dataKey: 'appliedTo',
        routerLink: (notification: JNotification) => this.renderAppliedToLink(notification),
        isSortable: true,
        export: async (notification: JNotification) => notification.action
      },
      {
        id: NotificationsTableCol.NOTIFICATION,
        dataKey: 'notification',
        isSortable: true,
        isSearchable: true,
        render: (notification: JNotification) => notification.notification,
        export: async (notification: JNotification) => notification.notification
      },
      {
        id: NotificationsTableCol.RECEIVER,
        dataKey: 'receiver',
        isSearchable: true,
        isSortable: true,
        render: (notification: JNotification) => notification.receiver,
        export: async (notification: JNotification) => notification.receiver
      }
    ];
  }

  openDialog(data: DialogData<JNotification>) {
    const dialogRef = this.dialog.open(TableDialogComponent, {
      data: data,
      width: '450px'
    });

    this.subscriptions.push(
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.action) {
          switch (result.action) {
            case BulkActionMenuAction.ACTIVATE:
              this.bulkActionActivate(result.data, true);
              break;
            case BulkActionMenuAction.DEACTIVATE:
              this.bulkActionActivate(result.data, false);
              break;
            case BulkActionMenuAction.DELETE:
              this.bulkActionDelete(result.data);
              break;
            case RowActionMenuAction.DELETE:
              this.rowActionDelete(result.data);
              break;
          }
        }
      })
    );
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<JNotification[]>): void {
    this.exportService.handleExportAction<JNotification>(
      event,
      this.tableColumns,
      NotificationsTableColumnLabel,
      'hashtopolis-notifications'
    );
  }

  rowActionClicked(event: ActionMenuEvent<JNotification>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting notification ${event.data.action} (${event.data.id}) ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
      case RowActionMenuAction.EDIT:
        this.rowActionEdit(event.data);
        break;
      case RowActionMenuAction.ACTIVATE:
        this.bulkActionActivate([event.data], true);
        break;
      case RowActionMenuAction.DEACTIVATE:
        this.bulkActionActivate([event.data], false);
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<JNotification[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.ACTIVATE:
        this.openDialog({
          rows: event.data,
          title: `Activating ${event.data.length} notifications ...`,
          icon: 'info',
          listAttribute: 'action',
          action: event.menuItem.action
        });
        break;
      case BulkActionMenuAction.DEACTIVATE:
        this.openDialog({
          rows: event.data,
          title: `Deactivating ${event.data.length} notifications ...`,
          icon: 'info',
          listAttribute: 'action',
          action: event.menuItem.action
        });
        break;
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} notifications ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above notifications? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'action',
          action: event.menuItem.action
        });
        break;
    }
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(notifications: JNotification[]): void {
    this.subscriptions.push(
      this.gs
        .bulkDelete(SERV.NOTIFICATIONS, notifications)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion: ', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage(`Successfully deleted notifications!`);
          this.dataSource.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionActivate(notifications: JNotification[], isActive: boolean): void {
    const action = isActive ? 'activated' : 'deactivated';

    this.subscriptions.push(
      this.gs.bulkUpdate(SERV.NOTIFICATIONS, notifications, { isActive: isActive }).subscribe(() => {
        this.alertService.showSuccessMessage(`Successfully ${action} notifications!`);
        this.dataSource.reload();
      })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(notifications: JNotification[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.NOTIFICATIONS, notifications[0].id)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage('Successfully deleted notification!');
          this.reload();
        })
    );
  }

  private rowActionEdit(notification: JNotification): void {
    this.router.navigate(['/account', 'notifications', notification.id, 'edit']);
  }

  private renderAppliedToLink(notification: JNotification): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];

    switch (notification.action) {
      case ACTION.AGENT_ERROR:
      case ACTION.OWN_AGENT_ERROR:
      case ACTION.DELETE_AGENT:
        links.push({
          label: `Agent: ${notification.objectId}`,
          routerLink: ['/agents', 'show-agents', notification.objectId, 'edit']
        });
        break;

      case ACTION.NEW_TASK:
      case ACTION.TASK_COMPLETE:
      case ACTION.DELETE_TASK:
        links.push({
          label: `Task: ${notification.objectId}`,
          routerLink: ['/tasks', 'show-tasks', notification.objectId, 'edit']
        });
        break;

      case ACTION.DELETE_HASHLIST:
      case ACTION.HASHLIST_ALL_CRACKED:
      case ACTION.HASHLIST_CRACKED_HASH:
        links.push({
          label: `Hashlist: ${notification.objectId}`,
          routerLink: ['/hashlists', 'hashlist', notification.objectId, 'edit']
        });
        break;

      case ACTION.USER_CREATED:
      case ACTION.USER_DELETED:
      case ACTION.USER_LOGIN_FAILED:
        links.push({
          label: `User: ${notification.objectId}`,
          routerLink: ['/users', notification.objectId]
        });
        break;
    }

    return of(links);
  }
}
