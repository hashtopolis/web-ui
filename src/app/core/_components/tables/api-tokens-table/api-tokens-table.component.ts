import { Observable, catchError, firstValueFrom, of } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { ApiTokenStatus, JApiToken, computeApiTokenStatus } from '@models/api-token.model';

import { ApiTokensContextMenuService } from '@services/context-menu/users/api-tokens-menu.service';
import { SERV } from '@services/main.config';
import { ApiTokensRoleService } from '@services/roles/user/api-tokens-role.service';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import {
  ApiTokensRowAction,
  ApiTokensTableCol,
  ApiTokensTableColumnLabel,
  ApiTokensTableEditableAction
} from '@components/tables/api-tokens-table/api-tokens-table.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import {
  HTTableColumn,
  HTTableEditable,
  HTTableIcon,
  HTTableRouterLink
} from '@components/tables/ht-table/ht-table.models';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';

import { ApiTokensDataSource } from '@datasources/api-tokens.datasource';

import { formatUnixTimestamp, lastValidSecond } from '@src/app/shared/utils/datetime';

@Component({
  selector: 'app-api-tokens-table',
  templateUrl: './api-tokens-table.component.html',
  standalone: false
})
export class ApiTokensTableComponent extends BaseTableComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly apiTokensRoleService = inject(ApiTokensRoleService);
  tableColumns: HTTableColumn[] = [];
  dataSource: ApiTokensDataSource;

  ngOnInit(): void {
    this.setColumnLabels(ApiTokensTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new ApiTokensDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
    this.contextMenuService = new ApiTokensContextMenuService(this.permissionService).addContextMenu();
    this.setupFilterErrorSubscription(this.dataSource);
  }

  ngAfterViewInit(): void {
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  getColumns(): HTTableColumn[] {
    const tokenNameColumn: HTTableColumn = {
      id: ApiTokensTableCol.TOKEN_NAME,
      dataKey: 'tokenName',
      isSortable: true,
      export: async (token: JApiToken) => token.tokenName?.trim() ?? ''
    };

    if (this.apiTokensRoleService.hasRole('update')) {
      tokenNameColumn.editable = (token: JApiToken) => {
        return {
          data: token,
          value: token.tokenName ?? '',
          action: ApiTokensTableEditableAction.CHANGE_TOKEN_NAME
        };
      };
    } else {
      tokenNameColumn.render = (token: JApiToken) => token.tokenName?.trim() || '—';
    }

    return [
      {
        id: ApiTokensTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        routerLink: (token: JApiToken) => this.renderDetailLink(token),
        export: async (token: JApiToken) => token.id + ''
      },
      tokenNameColumn,
      {
        id: ApiTokensTableCol.VALID_FROM,
        dataKey: 'startValid',
        render: (token: JApiToken) => formatUnixTimestamp(token.startValid, this.dateFormat),
        isSortable: true,
        export: async (token: JApiToken) => formatUnixTimestamp(token.startValid, this.dateFormat)
      },
      {
        id: ApiTokensTableCol.VALID_UNTIL,
        dataKey: 'endValid',
        render: (token: JApiToken) => formatUnixTimestamp(lastValidSecond(token.endValid), this.dateFormat),
        isSortable: true,
        export: async (token: JApiToken) => formatUnixTimestamp(lastValidSecond(token.endValid), this.dateFormat)
      },
      {
        id: ApiTokensTableCol.STATUS,
        dataKey: 'isRevoked',
        render: (token: JApiToken) => this.renderStatusLabel(token),
        icon: (token: JApiToken) => this.renderApiTokenStatusIcon(token),
        isSortable: true,
        export: async (token: JApiToken) => computeApiTokenStatus(token)
      },
      {
        id: ApiTokensTableCol.CREATOR,
        dataKey: 'userId',
        // Sorting on a relationship name is not supported by the backend filter spec;
        // the `userId` dataKey above is for export grouping only.
        isSortable: false,
        render: (token: JApiToken) => token.user?.name ?? '—',
        export: async (token: JApiToken) => token.user?.name ?? token.userId + ''
      }
    ];
  }

  /**
   * Render the ID column as a link into the detail page. Only this cell is
   * clickable — the underlying ht-table doesn't expose row-level click events,
   * and per-cell links match the navigation pattern used elsewhere.
   */
  private renderDetailLink(token: JApiToken): Observable<HTTableRouterLink[]> {
    return of([
      {
        routerLink: ['/account', 'api-keys', token.id],
        label: token.id + ''
      }
    ]);
  }

  /** Map the lifecycle status to a Material icon. Reuses existing icon vocabulary. */
  private renderApiTokenStatusIcon(token: JApiToken): HTTableIcon {
    const status = computeApiTokenStatus(token);
    if (status === ApiTokenStatus.ACTIVE) {
      return { name: 'check_circle', cls: 'text-ok' };
    }
    if (status === ApiTokenStatus.REVOKED) {
      return { name: 'block', cls: 'text-critical' };
    }
    return { name: 'schedule', cls: 'text-warning' };
  }

  private renderStatusLabel(token: JApiToken): SafeHtml {
    const status = computeApiTokenStatus(token);
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  // --- Inline editing ---

  editableSaved(editable: HTTableEditable<JApiToken>): void {
    switch (editable.action) {
      case ApiTokensTableEditableAction.CHANGE_TOKEN_NAME:
        void this.changeTokenName(editable.data, editable.value);
        break;
    }
  }

  private async changeTokenName(token: JApiToken, value: string): Promise<void> {
    const newName = value.trim();
    if ((token.tokenName ?? '') === newName) {
      this.alertService.showInfoMessage('Nothing changed');
      return;
    }

    try {
      await firstValueFrom(
        this.gs.update(SERV.API_TOKENS, token.id, { tokenName: newName }).pipe(
          catchError((error: HttpErrorResponse) => {
            throw error;
          })
        )
      );
      this.alertService.showSuccessMessage(`Renamed API key #${token.id} to "${newName || '(empty)'}".`);
      this.reload();
    } catch (error) {
      this.alertService.showErrorMessage(`Could not rename API key: ${this.extractMessage(error)}`);
    }
  }

  // --- Action handling ---

  rowActionClicked(event: ActionMenuEvent<JApiToken>): void {
    switch (event.menuItem.action) {
      case ApiTokensRowAction.REVOKE:
        this.openDialog({
          rows: [event.data],
          title: `Revoke API key #${event.data.id}?`,
          icon: 'warning',
          body: 'Once revoked, this token will immediately stop working. This cannot be undone.',
          warn: true,
          action: event.menuItem.action
        });
        break;
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Delete API key #${event.data.id}?`,
          icon: 'warning',
          body: 'This permanently removes the expired token record.',
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }

  private openDialog(data: DialogData<JApiToken>) {
    const dialogRef = this.dialog.open(TableDialogComponent, {
      data: data,
      width: '450px'
    });

    this.subscriptions.push(
      dialogRef.afterClosed().subscribe((result) => {
        if (!result?.action) {
          return;
        }
        const token: JApiToken = result.data[0];
        switch (result.action) {
          case ApiTokensRowAction.REVOKE:
            void this.revoke(token);
            break;
          case RowActionMenuAction.DELETE:
            void this.delete(token);
            break;
        }
      })
    );
  }

  private async revoke(token: JApiToken): Promise<void> {
    try {
      await firstValueFrom(
        this.gs.update(SERV.API_TOKENS, token.id, { isRevoked: true }).pipe(
          catchError((error: HttpErrorResponse) => {
            throw error;
          })
        )
      );
      this.alertService.showSuccessMessage(`Successfully revoked API key #${token.id}.`);
      this.reload();
    } catch (error) {
      this.alertService.showErrorMessage(`Could not revoke API key: ${this.extractMessage(error)}`);
    }
  }

  private async delete(token: JApiToken): Promise<void> {
    try {
      await firstValueFrom(this.gs.delete(SERV.API_TOKENS, token.id));
      this.alertService.showSuccessMessage(`Successfully deleted API key #${token.id}.`);
      this.reload();
    } catch (error) {
      this.alertService.showErrorMessage(`Could not delete API key: ${this.extractMessage(error)}`);
    }
  }

  private extractMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return error.error?.title || error.statusText || 'Unknown error';
    }
    return 'Unknown error';
  }
}
