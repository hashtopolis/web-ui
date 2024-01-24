/* eslint-disable @angular-eslint/component-selector */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  TasksChunksTableCol,
  TasksChunksTableColumnLabel
} from './tasks-chunks-table.constants';
import {
  formatSeconds,
  formatUnixTimestamp
} from 'src/app/shared/utils/datetime';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { Cacheable } from '../../../_decorators/cacheable';
import { Chunk } from '../../../_models/chunk.model';
import { chunkStates } from '../../../_constants/chunks.config';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { HTTableColumn } from '../ht-table/ht-table.models';
import { SafeHtml } from '@angular/platform-browser';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { TasksChunksDataSource } from 'src/app/core/_datasources/tasks-chunks.datasource';
import { catchError } from 'rxjs';

@Component({
  selector: 'tasks-chunks-table',
  templateUrl: './tasks-chunks-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksChunksTableComponent
  extends BaseTableComponent
  implements OnInit
{
  // Input property to specify an task ID for filtering chunks.
  @Input() taskId: number;

  tableColumns: HTTableColumn[] = [];
  dataSource: TasksChunksDataSource;

  ngOnInit(): void {
    this.setColumnLabels(TasksChunksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new TasksChunksDataSource(
      this.cdr,
      this.gs,
      this.uiService
    );
    this.dataSource.setColumns(this.tableColumns);
    if (this.taskId) {
      this.dataSource.setTaskId(this.taskId);
    }
    this.dataSource.loadAll();
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: TasksChunksTableCol.ID,
        dataKey: '_id',
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
        render: (chunk: Chunk) => this.renderCheckpoint(chunk),
        isSortable: true
      },
      {
        id: TasksChunksTableCol.PROGRESS,
        dataKey: 'progress',
        render: (chunk: Chunk) => this.renderProgress(chunk),
        isSortable: true
      },
      {
        id: TasksChunksTableCol.AGENT,
        dataKey: 'agentName',
        render: (chunk: Chunk) => this.renderAgent(chunk),
        routerLink: (chunk: Chunk) => this.renderAgentLink(chunk),
        isSortable: true
      },
      {
        id: TasksChunksTableCol.DISPATCH_TIME,
        dataKey: 'dispatchTime',
        render: (chunk: Chunk) => this.renderDispatchTime(chunk),
        isSortable: true
      },
      {
        id: TasksChunksTableCol.LAST_ACTIVITY,
        dataKey: 'solveTime',
        render: (chunk: Chunk) => this.renderLastActivity(chunk),
        isSortable: true
      },
      {
        id: TasksChunksTableCol.TIME_SPENT,
        dataKey: 'timeSpent',
        render: (chunk: Chunk) => this.renderTimeSpent(chunk),
        isSortable: true
      },
      {
        id: TasksChunksTableCol.STATE,
        dataKey: 'state',
        render: (chunk: Chunk) => this.renderState(chunk),
        isSortable: true
      },
      {
        id: TasksChunksTableCol.CRACKED,
        dataKey: 'cracked',
        routerLink: (chunk: Chunk) => this.renderCrackedLink(chunk),
        isSortable: true
      }
    ];

    return tableColumns;
  }

  // --- Render functions ---

  @Cacheable(['_id', 'cracked'])
  renderCracked(chunk: Chunk): SafeHtml {
    let html = `${chunk.cracked}`;
    if (chunk.cracked && chunk.cracked > 0) {
      html = `<a data-view-hashes-task-id="${chunk.task._id}">${chunk.cracked}</a>`;
    }

    return this.sanitize(html);
  }

  @Cacheable(['_id', 'state'])
  renderState(chunk: Chunk): SafeHtml {
    let html = `${chunk.state}`;
    if (chunk.state && chunk.state in chunkStates) {
      html = `<span class="pill pill-${chunkStates[
        chunk.state
      ].toLowerCase()}">${chunkStates[chunk.state]}</span>`;
    }

    return this.sanitize(html);
  }

  @Cacheable(['_id', 'solveTime', 'dispatchTime'])
  renderTimeSpent(chunk: Chunk): SafeHtml {
    const seconds = chunk.solveTime - chunk.dispatchTime;
    if (seconds) {
      return this.sanitize(formatSeconds(seconds));
    }

    return this.sanitize('0');
  }

  @Cacheable(['_id', 'progress', 'checkpoint', 'skip', 'length'])
  renderCheckpoint(chunk: Chunk): SafeHtml {
    const percent = chunk.progress
      ? (((chunk.checkpoint - chunk.skip) / chunk.length) * 100).toFixed(2)
      : 0;
    const data = chunk.checkpoint ? `${chunk.checkpoint} (${percent}%)` : '0';

    return this.sanitize(data);
  }

  @Cacheable(['_id', 'progress'])
  renderProgress(chunk: Chunk): SafeHtml {
    if (chunk.progress === undefined) {
      return this.sanitize('N/A');
    } else if (chunk.progress > 0) {
      return this.sanitize(`${chunk.progress / 100}%`);
    }

    return `${chunk.progress ? chunk.progress : 0}`;
  }

  @Cacheable(['_id', 'taskId'])
  renderTask(chunk: Chunk): SafeHtml {
    if (chunk.task) {
      return this.sanitize(chunk.task.taskName);
    }

    return this.sanitize(`${chunk.taskId}`);
  }

  @Cacheable(['_id', 'agentId'])
  renderAgent(chunk: Chunk): SafeHtml {
    if (chunk.agent) {
      return this.sanitize(chunk.agent.agentName);
    }

    return `${chunk.agentId}`;
  }

  @Cacheable(['_id', 'dispatchTime'])
  renderDispatchTime(chunk: Chunk): SafeHtml {
    const formattedDate = formatUnixTimestamp(
      chunk.dispatchTime,
      this.dateFormat
    );

    return this.sanitize(formattedDate === '' ? 'N/A' : formattedDate);
  }

  @Cacheable(['_id', 'solveTime'])
  renderLastActivity(chunk: Chunk): SafeHtml {
    if (chunk.solveTime === 0) {
      return '(No activity)';
    } else if (chunk.solveTime > 0) {
      return this.sanitize(
        formatUnixTimestamp(chunk.solveTime, this.dateFormat)
      );
    }

    return this.sanitize(`${chunk.solveTime}`);
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<Chunk[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<Chunk>(
          'hashtopolis-tasks-chunks',
          this.tableColumns,
          event.data,
          TasksChunksTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<Chunk>(
          'hashtopolis-tasks-chunks',
          this.tableColumns,
          event.data,
          TasksChunksTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<Chunk>(
            this.tableColumns,
            event.data,
            TasksChunksTableColumnLabel
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

  rowActionClicked(event: ActionMenuEvent<Chunk>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.RESET:
        this.rowActionReset(event.data);
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<Chunk[]>): void {
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

  openDialog(data: DialogData<Chunk>) {
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
  private rowActionReset(chunks: Chunk): void {
    const path = chunks.state === 2 ? 'abortChunk' : 'resetChunk';
    const payload = { chunkId: chunks.chunkId };
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
