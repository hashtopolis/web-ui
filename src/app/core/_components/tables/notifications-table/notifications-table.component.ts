/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HTTableColumn, HTTableRouterLink } from '../ht-table/ht-table.models';
import {
  NotificationsTableCol,
  NotificationsTableColumnLabel
} from './notifications-table.constants';
import { catchError, forkJoin } from 'rxjs';

import { ACTION } from 'src/app/core/_constants/notifications.config';
import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { Cacheable } from 'src/app/core/_decorators/cacheable';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { JNotification } from 'src/app/core/_models/notification.model';
import { NotificationsDataSource } from 'src/app/core/_datasources/notifications.datasource';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';

@Component({
  selector: 'notifications-table',
  templateUrl: './notifications-table.component.html'
})
export class NotificationsTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  tableColumns: HTTableColumn[] = [];
  dataSource: NotificationsDataSource;

  ngOnInit(): void {
    this.setColumnLabels(NotificationsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new NotificationsDataSource(
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

  filter(item: JNotification, filterValue: string): boolean {
    if (item.notification.toLowerCase().includes(filterValue)) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: NotificationsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        export: async (notification: JNotification) => notification.id + ''
      },
      {
        id: NotificationsTableCol.STATUS,
        dataKey: 'isActive',
        render: (notification: JNotification) =>
          notification.isActive ? 'Active' : 'Inactive',
        icons: (notification: JNotification) =>
          this.renderStatusIcon(notification),
        isSortable: true,
        export: async (notification: JNotification) => notification.isActive + ''
      },
      {
        id: NotificationsTableCol.ACTION,
        dataKey: 'action',
        isSortable: true,
        render: (notification: JNotification) => notification.action,
        export: async (notification: JNotification) => notification.action
      },
      {
        id: NotificationsTableCol.APPLIED_TO,
        dataKey: 'appliedTo',
        routerLink: (notification: JNotification) =>
          this.renderAppliedToLink(notification),
        isSortable: true,
        export: async (notification: JNotification) => notification.action
      },
      {
        id: NotificationsTableCol.NOTIFICATION,
        dataKey: 'notification',
        isSortable: true,
        render: (notification: JNotification) => notification.notification,
        export: async (notification: JNotification) => notification.notification
      },
      {
        id: NotificationsTableCol.RECEIVER,
        dataKey: 'receiver',
        isSortable: true,
        render: (notification: JNotification) => notification.receiver,
        export: async (notification: JNotification) => notification.receiver
      }
    ];

    return tableColumns;
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
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<JNotification>(
          'hashtopolis-notifications',
          this.tableColumns,
          event.data,
          NotificationsTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<JNotification>(
          'hashtopolis-notifications',
          this.tableColumns,
          event.data,
          NotificationsTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<JNotification>(
            this.tableColumns,
            event.data,
            NotificationsTableColumnLabel
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
    const requests = notifications.map((notification: JNotification) => {
      return this.gs.delete(SERV.NOTIFICATIONS, notification.id);
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
            `Successfully deleted ${results.length} notifications!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionActivate(
    notifications: JNotification[],
    isActive: boolean
  ): void {
    const requests = notifications.map((notification: JNotification) => {
      return this.gs.update(SERV.NOTIFICATIONS, notification.id, {
        isActive: isActive
      });
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
            `Successfully ${action} ${results.length} notifications!`,
            'Close'
          );
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
          this.snackBar.open('Successfully deleted notification!', 'Close');
          this.reload();
        })
    );
  }

  private rowActionEdit(notification: JNotification): void {
    this.router.navigate([
      '/account',
      'notifications',
      notification.id,
      'edit'
    ]);
  }

  @Cacheable(['id', 'actions', 'objectId'])
  async renderAppliedToLink(
    notification: JNotification
  ): Promise<HTTableRouterLink[]> {
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

    return links;
  }
}
