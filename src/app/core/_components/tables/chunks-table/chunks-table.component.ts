import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ChunksTableCol, ChunksTableColumnLabel } from '@components/tables/chunks-table/chunks-table.constants';
import { formatSeconds, formatUnixTimestamp } from '@src/app/shared/utils/datetime';

import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { ChunksDataSource } from '@datasources/chunks.datasource';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { JChunk } from '@models/chunk.model';
import { SafeHtml } from '@angular/platform-browser';
import { chunkStates } from '@src/app/core/_constants/chunks.config';
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
  selectedFilterColumn: string = 'all';
  ngOnInit(): void {
    this.setColumnLabels(ChunksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new ChunksDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    if (this.agentId) {
      this.dataSource.setAgentId(this.agentId);
    }
    this.dataSource.loadAll();
  }
  filter(item: JChunk, filterValue: string): boolean {
    filterValue = filterValue.toLowerCase();
    const selectedColumn = this.selectedFilterColumn;
    // Filter based on selected column
    switch (selectedColumn) {
      case 'all': {
        console.log(item);
        // Search across multiple relevant fields
        return (
          item.id.toString().includes(filterValue) ||
          item.taskName.toLowerCase().includes(filterValue) ||
          item.agentName.toLowerCase().includes(filterValue)
        );
      }
      case 'id': {
        return item.id?.toString().includes(filterValue);
      }
      case 'taskName': {
        return item.taskName.toLowerCase().includes(filterValue);
      }
      case 'agentName': {
        return item.agentName.toLowerCase().includes(filterValue);
      }
      default:
        // Default fallback to task name
        return item.agentName.toLowerCase().includes(filterValue);
    }
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: ChunksTableCol.ID,
        dataKey: 'id',
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
        isSortable: true,
        isSearchable: true
      },
      {
        id: ChunksTableCol.AGENT,
        dataKey: 'agentName',
        routerLink: (chunk: JChunk) => this.renderAgentLinkFromChunk(chunk),
        isSortable: true,
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
        isSortable: true
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
        routerLink: (chunk: JChunk) => this.renderCrackedLink(chunk),
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
}
