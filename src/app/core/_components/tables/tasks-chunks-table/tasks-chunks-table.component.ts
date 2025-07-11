import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  TasksChunksTableCol,
  TasksChunksTableColumnLabel
} from '@components/tables/tasks-chunks-table/tasks-chunks-table.constants';
import { formatSeconds, formatUnixTimestamp } from '@src/app/shared/utils/datetime';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { ChunkContextMenuService } from '@services/context-menu/chunk-menu.service';
import { FilterType } from '@src/app/core/_models/request-params.model';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { JChunk } from '@models/chunk.model';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { SERV } from '@services/main.config';
import { SafeHtml } from '@angular/platform-browser';
import { TasksChunksDataSource } from '@datasources/tasks-chunks.datasource';
import { catchError } from 'rxjs';
import { chunkStates } from '@src/app/core/_constants/chunks.config';
import { convertToLocale } from '@src/app/shared/utils/util';

@Component({
  selector: 'app-tasks-chunks-table',
  templateUrl: './tasks-chunks-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class TasksChunksTableComponent extends BaseTableComponent implements OnInit, OnChanges {
  // Input property to specify a task ID for filtering chunks.
  @Input() taskId: number;
  // Input property to specify to filter all chunks or only live. Live = 0, All = 1
  @Input() isChunksLive: number;

  tableColumns: HTTableColumn[] = [];
  dataSource: TasksChunksDataSource;
  selectedFilterColumn: string;

  // Track initialization
  private isInitialized = false;

  ngOnInit(): void {
    this.setColumnLabels(TasksChunksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new TasksChunksDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
    this.contextMenuService = new ChunkContextMenuService(this.permissionService).addContextMenu();
    // Do NOT load yet
    this.isInitialized = true;
    this.tryLoadData(); // Now safe to load
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isInitialized) return; // Wait until ngOnInit ran

    if (changes['taskId'] || changes['isChunksLive']) {
      this.tryLoadData();
    }
  }

  private tryLoadData(): void {
    if (this.taskId != null) {
      this.dataSource.setTaskId(this.taskId);
      this.dataSource.setIsChunksLive(this.isChunksLive);
      this.dataSource.loadAll();
    }
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: TasksChunksTableCol.ID,
        dataKey: '_id',
        isSortable: true,
        isSearchable: true,
        render: (chunk: JChunk) => chunk.id
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
        routerLink: (chunk: JChunk) => this.renderCrackedLinkFromChunk(chunk),
        isSortable: true
      }
    ];
  }

  filter(input: string) {
    const selectedColumn = this.selectedFilterColumn;
    if (input && input.length > 0) {
      this.dataSource.loadAll({ value: input, field: selectedColumn, operator: FilterType.ICONTAINS });
      return;
    } else {
      this.dataSource.loadAll(); // Reload all data if input is empty
    }
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
    const data = chunk.checkpoint ? `${chunk.checkpoint} (${convertToLocale(Number(percent))}%)` : '0';

    return this.sanitize(data);
  }

  renderProgress(chunk: JChunk): SafeHtml {
    if (chunk.progress === undefined) {
      return this.sanitize('N/A');
    } else if (chunk.progress > 0) {
      return this.sanitize(`${convertToLocale(chunk.progress / 100)}%`);
    }

    return `${chunk.progress ? chunk.progress : 0}`;
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
  rowActionClicked(event: ActionMenuEvent<JChunk>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.RESET:
        this.rowActionReset(event.data);
        break;
    }
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
            const errorMessage = 'Error during resetting';
            console.error(errorMessage, error);
            this.alertService.showErrorMessage(errorMessage);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage('Successfully reseted chunk!');
          this.reload();
        })
    );
  }
}
