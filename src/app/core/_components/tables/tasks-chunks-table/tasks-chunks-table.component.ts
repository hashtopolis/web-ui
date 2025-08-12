import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { JChunk } from '@models/chunk.model';

import { ChunkActionsService } from '@services/actions/chunk-actions.service';
import { ChunkContextMenuService } from '@services/context-menu/chunk-menu.service';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import {
  TasksChunksTableCol,
  TasksChunksTableColumnLabel
} from '@components/tables/tasks-chunks-table/tasks-chunks-table.constants';

import { TasksChunksDataSource } from '@datasources/tasks-chunks.datasource';

import { chunkStates } from '@src/app/core/_constants/chunks.config';
import { formatSeconds, formatUnixTimestamp } from '@src/app/shared/utils/datetime';
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
  selectedFilterColumn: string = 'all';

  // Track initialization
  private isInitialized = false;

  private readonly chunkActions = inject(ChunkActionsService);

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
        dataKey: 'id',
        isSortable: true,
        isSearchable: true
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
        isSortable: true,
        isSearchable: true
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

  /**
   * Filter function for chunks
   * @param item Chunk object
   * @param filterValue String value to filter filename
   * @returns True, if filename contains filterValue
   *          False, if not
   */
  filter(item: JChunk, filterValue: string): boolean {
    filterValue = filterValue.toLowerCase();
    const selectedColumn = this.selectedFilterColumn;

    switch (selectedColumn) {
      case 'all': {
        return (
          item.id?.toString().toLowerCase().includes(filterValue) || item.agentName?.toLowerCase().includes(filterValue)
        );
      }
      case 'id': {
        return item.id?.toString().toLowerCase().includes(filterValue);
      }
      case 'agentName': {
        return item.agentName?.toLowerCase().includes(filterValue);
      }

      default: {
        return item.id?.toString().toLowerCase().includes(filterValue);
      }
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

  rowActionClicked(event: ActionMenuEvent<JChunk>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.RESET:
        this.subscriptions.push(
          this.chunkActions.resetChunk(event.data).subscribe(() => {
            this.alertService.showSuccessMessage('Successfully reseted chunk!');
            this.reload();
          })
        );
        break;
    }
  }
}
