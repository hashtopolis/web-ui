import { AgentErrorTableCol, AgentErrorTableColumnLabel } from './agent-error-table.constants';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HTTableIcon, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';
import { Observable, catchError, of } from 'rxjs';
import { formatSeconds, formatUnixTimestamp } from '@src/app/shared/utils/datetime';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { AgentErrorDatasource } from '@src/app/core/_datasources/agent-error.datasource';
import { AgentsDataSource } from '@src/app/core/_datasources/agents.datasource';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { DialogData } from '../table-dialog/table-dialog.model';
import { HTTableColumn } from '../ht-table/ht-table.models';
import { JAgentErrors } from '@src/app/core/_models/agent-errors.model';
import { SERV } from '@src/app/core/_services/main.config';
import { SafeHtml } from '@angular/platform-browser';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';

@Component({
  selector: 'app-agent-error-table',
  templateUrl: './agent-error-table.component.html',
  styleUrl: './agent-error-table.component.scss',
  standalone: false
})
export class AgentErrorTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  @Input() agentId: number;
  tableColumns: HTTableColumn[] = [];
  dataSource: AgentErrorDatasource;
  ngOnDestroy(): void {}
  ngOnInit(): void {
    this.setColumnLabels(AgentErrorTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AgentErrorDatasource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);

    if (this.agentId) {
      this.dataSource.setAgentId(this.agentId);
    }
    this.dataSource.loadAll();
  }
  getColumns(): HTTableColumn[] {
    return [
      {
        id: AgentErrorTableCol.ID,
        render: (agentError: JAgentErrors) => agentError.id.toString(),
        export: async (agentError: JAgentErrors) => agentError.id.toString()
      },
      {
        id: AgentErrorTableCol.TIME,
        render: (agentError: JAgentErrors) => this.renderDispatchTime(agentError),
        export: async (agentError: JAgentErrors) => formatUnixTimestamp(agentError.time, this.dateFormat)
      },
      {
        id: AgentErrorTableCol.TASK_ID,
        routerLink: (agentError: JAgentErrors) => this.renderTaskLink(agentError, true),
        export: async (agentError: JAgentErrors) => (agentError.taskId ? agentError.taskId.toString() : 'N/A')
      },
      {
        id: AgentErrorTableCol.TASK,
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
          }
        }
      })
    );
  }
  rowActionClicked(event: ActionMenuEvent<JAgentErrors>): void {
    console.log('Row action clicked:', event);
  }
  bulkActionClicked(event: ActionMenuEvent<JAgentErrors[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE:
        console.log('Bulk delete action clicked:', event);
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
    console.log('Bulk action clicked:', event);
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
          this.alertService.showSuccessMessage(`Successfully deleted agents!`);
          this.dataSource.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(agent: JAgentErrors): void {
    /*     if (agent[0].assignmentId) {
      this.subscriptions.push(
        this.gs.delete(SERV.AGENT_ASSIGN, agent[0].assignmentId).subscribe(() => {
          this.alertService.showSuccessMessage('Successfully unassigned agent!');
          this.dataSource.reload();
        })
      );
    } else {
      this.subscriptions.push(
        this.gs.delete(SERV.AGENTS, agent[0].id).subscribe(() => {
          this.alertService.showSuccessMessage('Successfully deleted agent!');
          this.dataSource.reload();
        })
      );
    } */
  }
  renderDispatchTime(chunk: JAgentErrors): SafeHtml {
    const formattedDate = formatUnixTimestamp(chunk.time, this.dateFormat);

    return this.sanitize(formattedDate === '' ? 'N/A' : formattedDate);
  }
}
