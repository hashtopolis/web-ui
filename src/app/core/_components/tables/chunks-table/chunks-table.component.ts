/* eslint-disable @angular-eslint/component-selector */
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  ChunksTableCol,
  ChunksTableColumnLabel
} from './chunks-table.constants';
import {
  formatSeconds,
  formatUnixTimestamp
} from 'src/app/shared/utils/datetime';

import { BaseTableComponent } from '../base-table/base-table.component';
import { Cacheable } from '../../../_decorators/cacheable';
import { Chunk } from '../../../_models/chunk.model';
import { ChunksDataSource } from '../../../_datasources/chunks.datasource';
import { HTTableColumn } from '../../tables/ht-table/ht-table.models';
import { SafeHtml } from '@angular/platform-browser';
import { chunkStates } from '../../../_constants/chunks.config';

@Component({
  selector: 'chunks-table',
  templateUrl: './chunks-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChunksTableComponent extends BaseTableComponent implements OnInit {
  // Input property to specify an agent ID for filtering chunks.
  @Input() agentId: number;

  tableColumns: HTTableColumn[] = [];
  dataSource: ChunksDataSource;

  ngOnInit(): void {
    this.setColumnLabels(ChunksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new ChunksDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.loadAll();
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: ChunksTableCol.ID,
        dataKey: '_id',
        isSortable: true
      },
      {
        id: ChunksTableCol.START,
        dataKey: 'skip',
        isSortable: true
      },
      {
        id: ChunksTableCol.LENGTH,
        dataKey: 'length',
        isSortable: true
      },
      {
        id: ChunksTableCol.CHECKPOINT,
        dataKey: 'checkpoint',
        render: (chunk: Chunk) => this.renderCheckpoint(chunk),
        isSortable: true
      },
      {
        id: ChunksTableCol.PROGRESS,
        dataKey: 'progress',
        render: (chunk: Chunk) => this.renderProgress(chunk),
        isSortable: true
      },
      {
        id: ChunksTableCol.TASK,
        dataKey: 'taskName',
        routerLink: (chunk: Chunk) => this.renderTaskLink(chunk),
        isSortable: true
      },
      {
        id: ChunksTableCol.AGENT,
        dataKey: 'agentName',
        render: (chunk: Chunk) => this.renderAgent(chunk),
        routerLink: (chunk: Chunk) => this.renderAgentLink(chunk),
        isSortable: true
      },
      {
        id: ChunksTableCol.DISPATCH_TIME,
        dataKey: 'dispatchTime',
        render: (chunk: Chunk) => this.renderDispatchTime(chunk),
        isSortable: true
      },
      {
        id: ChunksTableCol.LAST_ACTIVITY,
        dataKey: 'solveTime',
        render: (chunk: Chunk) => this.renderLastActivity(chunk),
        isSortable: true
      },
      {
        id: ChunksTableCol.TIME_SPENT,
        dataKey: 'timeSpent',
        render: (chunk: Chunk) => this.renderTimeSpent(chunk),
        isSortable: true
      },
      {
        id: ChunksTableCol.STATE,
        dataKey: 'state',
        render: (chunk: Chunk) => this.renderState(chunk),
        isSortable: true
      },
      {
        id: ChunksTableCol.CRACKED,
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
}
