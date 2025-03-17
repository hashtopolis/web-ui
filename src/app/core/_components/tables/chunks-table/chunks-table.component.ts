/* eslint-disable @angular-eslint/component-selector */
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { JAgent } from '@src/app/core/_models/agent.model';
import { JChunk } from '@src/app/core/_models/chunk.model';

import { BaseTableComponent } from '@src/app/core/_components/tables/base-table/base-table.component';
import { HTTableColumn } from '@src/app/core/_components/tables/ht-table/ht-table.models';

import { ChunksDataSource } from '@src/app/core/_datasources/chunks.datasource';

import {
  ChunksTableCol,
  ChunksTableColumnLabel
} from '@src/app/core/_components/tables/chunks-table/chunks-table.constants';

import { Cacheable } from '@src/app/core/_decorators/cacheable';

import { chunkStates } from '@src/app/core/_constants/chunks.config';

import { formatSeconds, formatUnixTimestamp } from '@src/app/shared/utils/datetime';

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
    if (this.agentId) {
      this.dataSource.setAgentId(this.agentId);
    }
    this.dataSource.loadAll();
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: ChunksTableCol.ID,
        dataKey: 'id',
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
        isSortable: true
      },
      {
        id: ChunksTableCol.AGENT,
        dataKey: 'agentName',
        // render: (chunk: JChunk) => this.renderAgent(chunk.attributes.agent),
        routerLink: (chunk: JChunk) => this.renderAgentLink(chunk.agent),
        isSortable: true
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
        render: (chunk: JChunk) => chunk.cracked,
        routerLink: (chunk: JChunk) => this.renderCrackedLink(chunk),
        isSortable: true
      }
    ];

    return tableColumns;
  }

  // --- Render functions ---

  @Cacheable(['_id', 'cracked'])
  renderCracked(chunk: JChunk): SafeHtml {
    let html = `${chunk.cracked}`;
    if (chunk.cracked && chunk.cracked > 0) {
      html = `<a data-view-hashes-task-id="${chunk.task.id}">${chunk.cracked}</a>`;
    }

    return this.sanitize(html);
  }

  @Cacheable(['id', 'state'])
  renderState(chunk: JChunk): SafeHtml {
    let html = `${chunk.state}`;
    if (chunk.state && chunk.state in chunkStates) {
      html = `<span class="pill pill-${chunkStates[
        chunk.state
      ].toLowerCase()}">${chunkStates[chunk.state]}</span>`;
    }

    return this.sanitize(html);
  }

  @Cacheable(['id', 'solveTime', 'dispatchTime'])
  renderTimeSpent(chunk: JChunk): SafeHtml {
    const seconds = chunk.solveTime - chunk.dispatchTime;
    if (seconds) {
      return this.sanitize(formatSeconds(seconds));
    }

    return this.sanitize('0');
  }

  @Cacheable(['id', 'progress', 'checkpoint', 'skip', 'length'])
  renderCheckpoint(chunk: JChunk): SafeHtml {
    const percent = chunk.progress
      ? (((chunk.checkpoint - chunk.skip) / chunk.length) * 100).toFixed(2)
      : 0;
    const data = chunk.checkpoint ? `${chunk.checkpoint} (${percent}%)` : '0';

    return this.sanitize(data);
  }

  @Cacheable(['id', 'progress'])
  renderProgress(chunk: JChunk): SafeHtml {
    if (chunk.progress === undefined) {
      return this.sanitize('N/A');
    } else if (chunk.progress > 0) {
      return this.sanitize(`${chunk.progress / 100}%`);
    }

    return `${chunk.progress ? chunk.progress : 0}`;
  }

  @Cacheable(['id', 'taskId'])
  renderTask(chunk: JChunk): SafeHtml {
    if (chunk.task) {
      return this.sanitize(chunk.task[0].taskName);
    }

    return this.sanitize(`${chunk.task.id}`);
  }

  @Cacheable(['id'])
  renderAgent(agent: JAgent): SafeHtml {
    if (agent) {
      return this.sanitize(agent.agentName);
    }

    return `${agent.id}`;
  }

  @Cacheable(['id', 'dispatchTime'])
  renderDispatchTime(chunk: JChunk): SafeHtml {
    const formattedDate = formatUnixTimestamp(
      chunk.dispatchTime,
      this.dateFormat
    );

    return this.sanitize(formattedDate === '' ? 'N/A' : formattedDate);
  }

  @Cacheable(['id', 'solveTime'])
  renderLastActivity(chunk: JChunk): SafeHtml {
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
