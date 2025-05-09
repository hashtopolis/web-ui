import { catchError } from 'rxjs';

import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { JChunk } from '@models/chunk.model';

import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { ExportMenuAction } from '@components/menus/export-menu/export-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';
import {
  TasksChunksTableCol,
  TasksChunksTableColumnLabel
} from '@components/tables/tasks-chunks-table/tasks-chunks-table.constants';

import { TasksChunksDataSource } from '@datasources/tasks-chunks.datasource';

import { chunkStates } from '@src/app/core/_constants/chunks.config';
import { formatSeconds, formatUnixTimestamp } from '@src/app/shared/utils/datetime';

@Component({
  selector: 'app-tasks-chunks-table',
  templateUrl: './tasks-chunks-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class TasksChunksTableComponent extends BaseTableComponent implements OnInit {
  // Input property to specify a task ID for filtering chunks.
  @Input() taskId: number;
  // Input property to specify to filter all chunks or only live. Live = 0, All = 1
  @Input() isChunksLive: number;

  tableColumns: HTTableColumn[] = [];
  dataSource: TasksChunksDataSource;

  ngOnInit(): void {
    this.setColumnLabels(TasksChunksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new TasksChunksDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    if (this.taskId) {
      this.dataSource.setTaskId(this.taskId);
      this.dataSource.setIsChunksLive(this.isChunksLive);
    }
    this.dataSource.loadAll();
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: TasksChunksTableCol.ID,
        dataKey: 'id',
        isSortable: true
      },
      {
        id: TasksChunksTableCol.START,
        dataKey: 'skip',
        isSortable: true
      },
      {
        id: TasksChunksTableCol.LENGTH,
        dataKey: 'length',
        isSortable: true
      },
      {
        id: TasksChunksTableCol.CHECKPOINT,
        dataKey: 'checkpoint',
        render: (chunk: JChunk) => this.renderCheckpoint(chunk),
        isSortable: true
      },
      {
        id: TasksChunksTableCol.PROGRESS,
        dataKey: 'progress',
        render: (chunk: JChunk) => this.renderProgress(chunk),
        isSortable: true
      },
      {
        id: TasksChunksTableCol.AGENT,
        dataKey: 'agentName',
        render: (chunk: JChunk) => this.renderAgent(chunk),
        routerLink: (chunk: JChunk) => this.renderAgentLinkFromChunk(chunk),
        isSortable: true
      },
      {
        id: TasksChunksTableCol.DISPATCH_TIME,
        dataKey: 'dispatchTime',
        render: (chunk: JChunk) => this.renderDispatchTime(chunk),
        isSortable: true
      },
      {
        id: TasksChunksTableCol.LAST_ACTIVITY,
        dataKey: 'solveTime',
        render: (chunk: JChunk) => this.renderLastActivity(chunk),
        isSortable: true
      },
      {
        id: TasksChunksTableCol.TIME_SPENT,
        dataKey: 'timeSpent',
        render: (chunk: JChunk) => this.renderTimeSpent(chunk),
        isSortable: true
      },
      {
        id: TasksChunksTableCol.STATE,
        dataKey: 'state',
        render: (chunk: JChunk) => this.renderState(chunk),
        isSortable: true
      },
      {
        id: TasksChunksTableCol.CRACKED,
        dataKey: 'cracked',
        routerLink: (chunk: JChunk) => this.renderCrackedLink(chunk),
        isSortable: true
      }
    ];
  }

  // --- Render functions ---
  renderState(chunk: JChunk): SafeHtml {
    let html = `${chunk.state}`;
    if (chunk.state && chunk.state in chunkStates) {
      html = `<span class="pill pill-${chunkStates[chunk.state].toLowerCase()}">${chunkStates[chunk.state]}</span>`;
    }

    return this.sanitize(html);
  }

  renderTimeSpent(chunk: JChunk): SafeHtml {
    const seconds = chunk.solveTime - chunk.dispatchTime;
    if (seconds) {
      return this.sanitize(formatSeconds(seconds));
    }

    return this.sanitize('0');
  }

  renderCheckpoint(chunk: JChunk): SafeHtml {
    const percent = chunk.progress ? (((chunk.checkpoint - chunk.skip) / chunk.length) * 100).toFixed(2) : 0;
    const data = chunk.checkpoint ? `${chunk.checkpoint} (${percent}%)` : '0';

    return this.sanitize(data);
  }

  renderProgress(chunk: JChunk): SafeHtml {
    if (chunk.progress === undefined) {
      return this.sanitize('N/A');
    } else if (chunk.progress > 0) {
      return this.sanitize(`${chunk.progress / 100}%`);
    }

    return `${chunk.progress ? chunk.progress : 0}`;
  }

  renderAgent(chunk: JChunk): SafeHtml {
    if (chunk.agent) {
      return this.sanitize(chunk.agent.agentName);
    }

    return `${chunk.agentId}`;
  }

  renderDispatchTime(chunk: JChunk): SafeHtml {
    const formattedDate = formatUnixTimestamp(chunk.dispatchTime, this.dateFormat);

    return this.sanitize(formattedDate === '' ? 'N/A' : formattedDate);
  }

  renderLastActivity(chunk: JChunk): SafeHtml {
    if (chunk.solveTime === 0) {
      return '(No activity)';
    } else if (chunk.solveTime > 0) {
      return this.sanitize(formatUnixTimestamp(chunk.solveTime, this.dateFormat));
    }

    return this.sanitize(`${chunk.solveTime}`);
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<JChunk[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<JChunk>(
          'hashtopolis-tasks-chunks',
          this.tableColumns,
          event.data,
          TasksChunksTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<JChunk>(
          'hashtopolis-tasks-chunks',
          this.tableColumns,
          event.data,
          TasksChunksTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService.toClipboard<JChunk>(this.tableColumns, event.data, TasksChunksTableColumnLabel).then(() => {
          this.snackBar.open('The selected rows are copied to the clipboard', 'Close');
        });
        break;
    }
  }

  rowActionClicked(event: ActionMenuEvent<JChunk>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.RESET:
        this.rowActionReset(event.data);
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<JChunk[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.RESET:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} users ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above users? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'name',
          action: event.menuItem.action
        });
        break;
    }
  }

  openDialog(data: DialogData<JChunk>) {
    const dialogRef = this.dialog.open(TableDialogComponent, {
      data: data,
      width: '450px'
    });

    this.subscriptions.push(
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.action) {
          switch (result.action) {
            case RowActionMenuAction.RESET:
              this.rowActionReset(result.data);
              break;
          }
        }
      })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionReset(chunks: JChunk): void {
    const path = chunks.state === 2 ? 'abortChunk' : 'resetChunk';
    const payload = { chunkId: chunks.id };
    this.subscriptions.push(
      this.gs
        .chelper(SERV.HELPER, path, payload)
        .pipe(
          catchError((error) => {
            console.error('Error during resetting:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open('Successfully reseted chunk!', 'Close');
          this.reload();
        })
    );
  }
}
