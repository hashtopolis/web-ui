import { catchError } from 'rxjs';

import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { JAgentErrors } from '@models/agent-errors.model';

import { AgentErrorContextMenuService } from '@services/context-menu/agents/agent-error-menu.service';
import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import {
  AgentErrorTableCol,
  AgentErrorTableColumnLabel
} from '@components/tables/agent-error-table/agent-error-table.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';

import { AgentErrorDatasource } from '@datasources/agent-error.datasource';

import { FilterType } from '@src/app/core/_models/request-params.model';
import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';

@Component({
  selector: 'app-agent-error-table',
  templateUrl: './agent-error-table.component.html',
  standalone: false
})
export class AgentErrorTableComponent extends BaseTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() agentId: number;
  tableColumns: HTTableColumn[] = [];
  dataSource: AgentErrorDatasource;
  selectedFilterColumn: HTTableColumn;
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
  ngOnInit(): void {
    this.setColumnLabels(AgentErrorTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AgentErrorDatasource(this.injector);
    this.dataSource.setColumns(this.tableColumns);

    if (this.agentId) {
      this.dataSource.setAgentId(this.agentId);
    }
    this.contextMenuService = new AgentErrorContextMenuService(this.permissionService).addContextMenu();
  }

  ngAfterViewInit(): void {
    // Wait until paginator is defined
    this.dataSource.loadAll();
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: AgentErrorTableCol.ID,
        dataKey: 'id',
        isSearchable: true,
        export: async (agentError: JAgentErrors) => agentError.id.toString()
      },
      {
        id: AgentErrorTableCol.TIME,
        render: (agentError: JAgentErrors) => this.renderDispatchTime(agentError),
        export: async (agentError: JAgentErrors) => formatUnixTimestamp(agentError.time, this.dateFormat)
      },
      {
        id: AgentErrorTableCol.TASK_ID,
        dataKey: 'taskId',
        isSearchable: true,
        routerLink: (agentError: JAgentErrors) => this.renderTaskLink(agentError, true),
        export: async (agentError: JAgentErrors) => (agentError.taskId ? agentError.taskId.toString() : 'N/A')
      },
      {
        id: AgentErrorTableCol.TASK,
        dataKey: 'taskName',
        routerLink: (agentError: JAgentErrors) => this.renderTaskLink(agentError),
        export: async (agentError: JAgentErrors) => agentError.task.taskName || 'N/A'
      },
      {
        id: AgentErrorTableCol.CHUNK,
        render: (agentError: JAgentErrors) => {
          if (agentError.chunkId) {
            return agentError.chunkId.toString();
          }
          return 'N/A';
        },
        export: async (agentError: JAgentErrors) => (agentError.chunkId ? agentError.chunkId.toString() : 'N/A')
      },
      {
        id: AgentErrorTableCol.MESSAGE,
        isSearchable: true,
        dataKey: 'error',
        render: (agentError: JAgentErrors) => {
          if (agentError.error) {
            return this.sanitize(agentError.error);
          }
          return 'N/A';
        },
        export: async (agentError: JAgentErrors) => agentError.error || 'N/A'
      }
    ];
  }
  filter(input: string) {
    const selectedColumn = this.selectedFilterColumn;
    if (input && input.length > 0) {
      this.dataSource.loadAll({
        value: input,
        field: selectedColumn.dataKey,
        operator: FilterType.ICONTAINS,
        parent: selectedColumn.parent
      });
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
  openDialog(data: DialogData<JAgentErrors>) {
    const dialogRef = this.dialog.open(TableDialogComponent, {
      data: data,
      width: '450px'
    });

    this.subscriptions.push(
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.action) {
          switch (result.action) {
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

  rowActionClicked(event: ActionMenuEvent<JAgentErrors>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `'Deleting'  ${event.data.error} ...`,
          icon: 'warning',
          body: `Are you sure you want to delete ${event.data.error} Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }
  bulkActionClicked(event: ActionMenuEvent<JAgentErrors[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} errors ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above errors? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'error',
          action: event.menuItem.action
        });
        break;
    }
  }
  exportActionClicked(event: ActionMenuEvent<JAgentErrors[]>): void {
    this.exportService.handleExportAction<JAgentErrors>(
      event,
      this.tableColumns,
      AgentErrorTableColumnLabel,
      'hashtopolis-task-errors'
    );
  }
  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(errors: JAgentErrors[]): void {
    this.subscriptions.push(
      this.gs
        .bulkDelete(SERV.AGENT_ERRORS, errors)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion: ', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage(`Successfully deleted errors!`);
          this.dataSource.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(error: JAgentErrors): void {
    this.subscriptions.push(
      this.gs.delete(SERV.AGENT_ERRORS, error[0].id).subscribe(() => {
        this.alertService.showSuccessMessage('Successfully deleted error!');
        this.dataSource.reload();
      })
    );
  }
  renderDispatchTime(chunk: JAgentErrors): SafeHtml {
    const formattedDate = formatUnixTimestamp(chunk.time, this.dateFormat);

    return this.sanitize(formattedDate === '' ? 'N/A' : formattedDate);
  }
}
