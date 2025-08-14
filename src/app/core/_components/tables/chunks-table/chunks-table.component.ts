import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { JChunk } from '@models/chunk.model';

import { ChunkActionsService } from '@services/actions/chunk-actions.service';
import { ChunkContextMenuService } from '@services/context-menu/chunk-menu.service';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { ChunksTableCol, ChunksTableColumnLabel } from '@components/tables/chunks-table/chunks-table.constants';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

import { ChunksDataSource } from '@datasources/chunks.datasource';

import { chunkStates } from '@src/app/core/_constants/chunks.config';
import { FilterType } from '@src/app/core/_models/request-params.model';
import { formatSeconds, formatUnixTimestamp } from '@src/app/shared/utils/datetime';
import { convertToLocale } from '@src/app/shared/utils/util';

@Component({
  selector: 'app-chunks-table',
  templateUrl: './chunks-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class ChunksTableComponent extends BaseTableComponent implements OnInit {
  // Input property to specify an agent ID for filtering chunks.
  @Input() agentId: number;

  tableColumns: HTTableColumn[] = [];
  dataSource: ChunksDataSource;
  selectedFilterColumn: string;

  private readonly chunkActions = inject(ChunkActionsService);

  ngOnInit(): void {
    this.setColumnLabels(ChunksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new ChunksDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
    if (this.agentId) {
      this.dataSource.setAgentId(this.agentId);
    }
    this.contextMenuService = new ChunkContextMenuService(this.permissionService).addContextMenu();
    this.dataSource.loadAll();
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

  getColumns(): HTTableColumn[] {
    return [
      {
        id: ChunksTableCol.ID,
        dataKey: 'chunkId',
        render: (chunk: JChunk) => chunk.id,
        isSearchable: true,
        isSortable: true
      },
      {
        id: ChunksTableCol.START,
        dataKey: 'skip',
        render: (chunk: JChunk) => chunk.skip,
        isSortable: true
      },
      {
        id: ChunksTableCol.LENGTH,
        dataKey: 'length',
        render: (chunk: JChunk) => chunk.length,
        isSortable: true
      },
      {
        id: ChunksTableCol.CHECKPOINT,
        dataKey: 'checkpoint',
        render: (chunk: JChunk) => this.renderCheckpoint(chunk),
        isSortable: true
      },
      {
        id: ChunksTableCol.PROGRESS,
        dataKey: 'progress',
        render: (chunk: JChunk) => this.renderProgress(chunk),
        isSortable: true
      },
      {
        id: ChunksTableCol.TASK,
        dataKey: 'taskName',
        routerLink: (chunk: JChunk) => this.renderTaskLink(chunk),
        isSortable: false,
        isSearchable: true
      },
      {
        id: ChunksTableCol.AGENT,
        dataKey: 'agentName',
        routerLink: (chunk: JChunk) => this.renderAgentLinkFromChunk(chunk),
        isSortable: false,
        isSearchable: true
      },
      {
        id: ChunksTableCol.DISPATCH_TIME,
        dataKey: 'dispatchTime',
        render: (chunk: JChunk) => this.renderDispatchTime(chunk),
        isSortable: true
      },
      {
        id: ChunksTableCol.LAST_ACTIVITY,
        dataKey: 'solveTime',
        render: (chunk: JChunk) => this.renderLastActivity(chunk),
        isSortable: true
      },
      {
        id: ChunksTableCol.TIME_SPENT,
        dataKey: 'timeSpent',
        render: (chunk: JChunk) => this.renderTimeSpent(chunk),
        isSortable: false
      },
      {
        id: ChunksTableCol.STATE,
        dataKey: 'state',
        render: (chunk: JChunk) => this.renderState(chunk),
        isSortable: true
      },
      {
        id: ChunksTableCol.CRACKED,
        dataKey: 'cracked',
        routerLink: (chunk: JChunk) => this.renderCrackedLinkFromChunk(chunk),
        isSortable: true
      }
    ];
  }

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
