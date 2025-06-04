import {
  AgentBinariesTableCol,
  AgentBinariesTableColumnLabel
} from '@components/tables/agent-binaries-table/agent-binaries-table.constants';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, forkJoin } from 'rxjs';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { AgentBinariesDataSource } from '@datasources/agent-binaries.datasource';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';
import { ExportMenuAction } from '@components/menus/export-menu/export-menu.constants';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { JAgentBinary } from '@models/agent-binary.model';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { SERV } from '@services/main.config';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { environment } from '@src/environments/environment';

@Component({
  selector: 'app-agent-binaries-table',
  templateUrl: './agent-binaries-table.component.html',
  standalone: false
})
export class AgentBinariesTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  tableColumns: HTTableColumn[] = [];
  dataSource: AgentBinariesDataSource;
  selectedFilterColumn: string = 'all';
  agentdownloadURL: string;

  ngOnInit(): void {
    this.setColumnLabels(AgentBinariesTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new AgentBinariesDataSource(this.cdr, this.gs, this.uiService);
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

  filter(item: JAgentBinary, filterValue: string): boolean {
    filterValue = filterValue.toLowerCase();
    const selectedColumn = this.selectedFilterColumn;
    // Filter based on selected column
    switch (selectedColumn) {
      case 'all': {
        // Search across multiple relevant fields
        return (
          item.id.toString().includes(filterValue) ||
          item.filename?.toLowerCase().includes(filterValue) ||
          item.operatingSystems?.toLowerCase().includes(filterValue) ||
          item.agentbinaryType?.toLowerCase().includes(filterValue) ||
          item.updateTrack?.toLowerCase().includes(filterValue) ||
          item.version?.toLowerCase().includes(filterValue)
        );
      }
      case 'id': {
        return item.id.toString().includes(filterValue);
      }
      case 'filename': {
        return item.filename?.toLowerCase().includes(filterValue);
      }
      case 'operatingSystems': {
        return item.operatingSystems?.toLowerCase().includes(filterValue);
      }
      case 'type': {
        return item.agentbinaryType?.toLowerCase().includes(filterValue);
      }
      case 'updateTrack': {
        return item.updateTrack?.toLowerCase().includes(filterValue);
      }
      case 'version': {
        return item.version?.toLowerCase().includes(filterValue);
      }
      default:
        // Default fallback to task name
        return item.filename?.toLowerCase().includes(filterValue);
    }
  }
  getColumns(): HTTableColumn[] {
    return [
      {
        id: AgentBinariesTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        isSearchable: true,
        export: async (agentBinary: JAgentBinary) => agentBinary.id + ''
      },
      {
        id: AgentBinariesTableCol.TYPE,
        dataKey: 'type',
        isSortable: true,
        isSearchable: true,
        render: (agentBinary: JAgentBinary) => agentBinary.agentbinaryType,
        export: async (agentBinary: JAgentBinary) => agentBinary.agentbinaryType
      },
      {
        id: AgentBinariesTableCol.OS,
        dataKey: 'operatingSystems',
        isSortable: true,
        isSearchable: true,
        render: (agentBinary: JAgentBinary) => agentBinary.operatingSystems,
        export: async (agentBinary: JAgentBinary) => agentBinary.operatingSystems
      },
      {
        id: AgentBinariesTableCol.FILENAME,
        dataKey: 'filename',
        isSortable: true,
        isSearchable: true,
        render: (agentBinary: JAgentBinary) => agentBinary.filename,
        export: async (agentBinary: JAgentBinary) => agentBinary.filename
      },
      {
        id: AgentBinariesTableCol.VERSION,
        dataKey: 'version',
        isSortable: true,
        isSearchable: true,
        render: (agentBinary: JAgentBinary) => agentBinary.version,
        export: async (agentBinary: JAgentBinary) => agentBinary.version
      },
      {
        id: AgentBinariesTableCol.UPDATE_TRACK,
        dataKey: 'updateTrack',
        isSortable: true,
        isSearchable: true,
        render: (agentBinary: JAgentBinary) => agentBinary.updateTrack,
        export: async (agentBinary: JAgentBinary) => agentBinary.updateTrack
      }
    ];
  }

  openDialog(data: DialogData<JAgentBinary>) {
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

  exportActionClicked(event: ActionMenuEvent<JAgentBinary[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<JAgentBinary>(
          'hashtopolis-agent-binaries',
          this.tableColumns,
          event.data,
          AgentBinariesTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<JAgentBinary>(
          'hashtopolis-agent-binaries',
          this.tableColumns,
          event.data,
          AgentBinariesTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<JAgentBinary>(this.tableColumns, event.data, AgentBinariesTableColumnLabel)
          .then(() => {
            this.snackBar.open('The selected rows are copied to the clipboard', 'Close');
          });
        break;
    }
  }

  rowActionClicked(event: ActionMenuEvent<JAgentBinary>): void {
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

  bulkActionClicked(event: ActionMenuEvent<JAgentBinary[]>): void {
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
  private bulkActionDelete(agentBinaries: JAgentBinary[]): void {
    this.subscriptions.push(
      this.gs
        .bulkDelete(SERV.AGENT_BINARY, agentBinaries)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion: ', error);
            return [];
          })
        )
        .subscribe((results) => {
          this.snackBar.open(`Successfully deleted agent binaries!`, 'Close');
          this.dataSource.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(agentBinaries: JAgentBinary[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.AGENT_BINARY, agentBinaries[0].id)
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

  private rowActionEdit(agentBinary: JAgentBinary): void {
    this.router.navigate(['/config', 'engine', 'agent-binaries', agentBinary.id, 'edit']);
  }

  private rowActionCopyLink(agentBinary: JAgentBinary): void {
    const link = `${this.agentdownloadURL}${agentBinary.id}`;
    this.clipboard.copy(link);
    this.snackBar.open('The agent binary URL is copied to the clipboard', 'Close');
  }

  private rowActionDownload(agentBinary: JAgentBinary): void {
    window.location.href = `${this.agentdownloadURL}${agentBinary.id}`;
  }
}
