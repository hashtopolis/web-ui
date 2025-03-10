import {
  AgentBinariesTableCol,
  AgentBinariesTableColumnLabel
} from './agent-binaries-table.constants';
/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, forkJoin } from 'rxjs';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { AgentBinariesDataSource } from 'src/app/core/_datasources/agent-binaries.datasource';
import { AgentBinary } from 'src/app/core/_models/agent-binary.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { HTTableColumn } from '../ht-table/ht-table.models';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'agent-binaries-table',
  templateUrl: './agent-binaries-table.component.html'
})
export class AgentBinariesTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  tableColumns: HTTableColumn[] = [];
  dataSource: AgentBinariesDataSource;

  agentdownloadURL: string;

  ngOnInit(): void {
    this.setColumnLabels(AgentBinariesTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AgentBinariesDataSource(
      this.cdr,
      this.gs,
      this.uiService
    );
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.loadAll();

    const path = this.cs.getEndpoint().replace('/api/v2', '');
    this.agentdownloadURL = path + environment.config.agentdownloadURL;
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: AgentBinary, filterValue: string): boolean {
    if (item.filename.toLowerCase().includes(filterValue)) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: AgentBinariesTableCol.ID,
        dataKey: '_id',
        isSortable: true,
        export: async (agentBinary: AgentBinary) => agentBinary._id + ''
      },
      {
        id: AgentBinariesTableCol.TYPE,
        dataKey: 'type',
        isSortable: true,
        export: async (agentBinary: AgentBinary) => agentBinary.type
      },
      {
        id: AgentBinariesTableCol.OS,
        dataKey: 'operatingSystems',
        isSortable: true,
        export: async (agentBinary: AgentBinary) => agentBinary.operatingSystems
      },
      {
        id: AgentBinariesTableCol.FILENAME,
        dataKey: 'filename',
        isSortable: true,
        export: async (agentBinary: AgentBinary) => agentBinary.filename
      },
      {
        id: AgentBinariesTableCol.VERSION,
        dataKey: 'version',
        isSortable: true,
        export: async (agentBinary: AgentBinary) => agentBinary.version
      },
      {
        id: AgentBinariesTableCol.UPDATE_TRACK,
        dataKey: 'updateTrack',
        isSortable: true,
        export: async (agentBinary: AgentBinary) => agentBinary.updateTrack
      }
    ];

    return tableColumns;
  }

  openDialog(data: DialogData<AgentBinary>) {
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

  exportActionClicked(event: ActionMenuEvent<AgentBinary[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<AgentBinary>(
          'hashtopolis-agent-binaries',
          this.tableColumns,
          event.data,
          AgentBinariesTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<AgentBinary>(
          'hashtopolis-agent-binaries',
          this.tableColumns,
          event.data,
          AgentBinariesTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<AgentBinary>(
            this.tableColumns,
            event.data,
            AgentBinariesTableColumnLabel
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

  rowActionClicked(event: ActionMenuEvent<AgentBinary>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting agentBinary ${event.data.filename} ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
      case RowActionMenuAction.EDIT:
        this.rowActionEdit(event.data);
        break;
      case RowActionMenuAction.COPY_LINK:
        this.rowActionCopyLink(event.data);
        break;
      case RowActionMenuAction.DOWNLOAD:
        this.rowActionDownload(event.data);
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<AgentBinary[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} agent binaries ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above agent binaries? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'filename',
          action: event.menuItem.action
        });
        break;
    }
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(agentBinaries: AgentBinary[]): void {
    const requests = agentBinaries.map((agentBinary: AgentBinary) => {
      return this.gs.delete(SERV.AGENT_BINARY, agentBinary._id);
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
            `Successfully deleted ${results.length} agentBinaries!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(agentBinaries: AgentBinary[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.AGENT_BINARY, agentBinaries[0]._id)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open('Successfully deleted agent binary!', 'Close');
          this.reload();
        })
    );
  }

  private rowActionEdit(agentBinary: AgentBinary): void {
    this.router.navigate([
      '/config',
      'engine',
      'agent-binaries',
      agentBinary._id,
      'edit'
    ]);
  }

  private rowActionCopyLink(agentBinary: AgentBinary): void {
    const link = `${this.agentdownloadURL}${agentBinary._id}`;
    this.clipboard.copy(link);
    this.snackBar.open(
      'The agent binary URL is copied to the clipboard',
      'Close'
    );
  }

  private rowActionDownload(agentBinary: AgentBinary): void {
    window.location.href = `${this.agentdownloadURL}${agentBinary._id}`;
  }
}
