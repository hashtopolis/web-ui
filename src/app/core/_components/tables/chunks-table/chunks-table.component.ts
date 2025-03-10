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
import { ChunkDataNew } from '../../../_models/chunk.model';
import { ChunksDataSource } from '../../../_datasources/chunks.datasource';
import { HTTableColumn } from '../../tables/ht-table/ht-table.models';
import { SafeHtml } from '@angular/platform-browser';
import { chunkStates } from '../../../_constants/chunks.config';
import { AgentData } from '../../../_models/agent.model';

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
        render: (chunk: ChunkDataNew) => chunk.attributes.skip,
        isSortable: true
      },
      {
        id: ChunksTableCol.LENGTH,
        dataKey: 'length',
        render: (chunk: ChunkDataNew) => chunk.attributes.length,
        isSortable: true
      },
      {
        id: ChunksTableCol.CHECKPOINT,
        dataKey: 'checkpoint',
        render: (chunk: ChunkDataNew) => this.renderCheckpoint(chunk),
        isSortable: true
      },
      {
        id: ChunksTableCol.PROGRESS,
        dataKey: 'progress',
        render: (chunk: ChunkDataNew) => this.renderProgress(chunk),
        isSortable: true
      },
      {
        id: ChunksTableCol.TASK,
        dataKey: 'taskName',
        routerLink: (chunk: ChunkDataNew) => this.renderTaskLink(chunk.attributes.task),
        isSortable: true
      },
      {
        id: ChunksTableCol.AGENT,
        dataKey: 'agentName',
        // render: (chunk: ChunkDataNew) => this.renderAgent(chunk.attributes.agent),
        routerLink: (chunk: ChunkDataNew) => this.renderAgentLink(chunk.attributes.agent),
        isSortable: true
      },
      {
        id: ChunksTableCol.DISPATCH_TIME,
        dataKey: 'dispatchTime',
        render: (chunk: ChunkDataNew) => this.renderDispatchTime(chunk),
        isSortable: true
      },
      {
        id: ChunksTableCol.LAST_ACTIVITY,
        dataKey: 'solveTime',
        render: (chunk: ChunkDataNew) => this.renderLastActivity(chunk),
        isSortable: true
      },
      {
        id: ChunksTableCol.TIME_SPENT,
        dataKey: 'timeSpent',
        render: (chunk: ChunkDataNew) => this.renderTimeSpent(chunk),
        isSortable: true
      },
      {
        id: ChunksTableCol.STATE,
        dataKey: 'state',
        render: (chunk: ChunkDataNew) => this.renderState(chunk),
        isSortable: true
      },
      {
        id: ChunksTableCol.CRACKED,
        dataKey: 'cracked',
        render: (chunk: ChunkDataNew) => chunk.attributes.cracked,
        routerLink: (chunk: ChunkDataNew) => this.renderCrackedLink(chunk),
        isSortable: true
      }
    ];

    return tableColumns;
  }

  // --- Render functions ---

  @Cacheable(['_id', 'cracked'])
  renderCracked(chunk: ChunkDataNew): SafeHtml {
    let html = `${chunk.attributes.cracked}`;
    if (chunk.attributes.cracked && chunk.attributes.cracked > 0) {
      html = `<a data-view-hashes-task-id="${chunk.attributes.task.id}">${chunk.attributes.cracked}</a>`;
    }

    return this.sanitize(html);
  }

  @Cacheable(['id', 'state'])
  renderState(chunk: ChunkDataNew): SafeHtml {
    let html = `${chunk.attributes.state}`;
    if (chunk.attributes.state && chunk.attributes.state in chunkStates) {
      html = `<span class="pill pill-${chunkStates[
        chunk.attributes.state
      ].toLowerCase()}">${chunkStates[chunk.attributes.state]}</span>`;
    }

    return this.sanitize(html);
  }

  @Cacheable(['id', 'solveTime', 'dispatchTime'])
  renderTimeSpent(chunk: ChunkDataNew): SafeHtml {
    const seconds = chunk.attributes.solveTime - chunk.attributes.dispatchTime;
    if (seconds) {
      return this.sanitize(formatSeconds(seconds));
    }

    return this.sanitize('0');
  }

  @Cacheable(['id', 'progress', 'checkpoint', 'skip', 'length'])
  renderCheckpoint(chunk: ChunkDataNew): SafeHtml {
    const percent = chunk.attributes.progress
      ? (((chunk.attributes.checkpoint - chunk.attributes.skip) / chunk.attributes.length) * 100).toFixed(2)
      : 0;
    const data = chunk.attributes.checkpoint ? `${chunk.attributes.checkpoint} (${percent}%)` : '0';

    return this.sanitize(data);
  }

  @Cacheable(['id', 'progress'])
  renderProgress(chunk: ChunkDataNew): SafeHtml {
    if (chunk.attributes.progress === undefined) {
      return this.sanitize('N/A');
    } else if (chunk.attributes.progress > 0) {
      return this.sanitize(`${chunk.attributes.progress / 100}%`);
    }

    return `${chunk.attributes.progress ? chunk.attributes.progress : 0}`;
  }

  @Cacheable(['id', 'taskId'])
  renderTask(chunk: ChunkDataNew): SafeHtml {
    if (chunk.attributes.task) {
      return this.sanitize(chunk.attributes.task[0].taskName);
    }

    return this.sanitize(`${chunk.attributes.task.id}`);
  }

  @Cacheable(['id'])
  renderAgent(agent: AgentData): SafeHtml {
    if (agent.attributes) {
      return this.sanitize(agent.attributes.agentName);
    }

    return `${agent.id}`;
  }

  @Cacheable(['id', 'dispatchTime'])
  renderDispatchTime(chunk: ChunkDataNew): SafeHtml {
    const formattedDate = formatUnixTimestamp(
      chunk.attributes.dispatchTime,
      this.dateFormat
    );

    return this.sanitize(formattedDate === '' ? 'N/A' : formattedDate);
  }

  @Cacheable(['id', 'solveTime'])
  renderLastActivity(chunk: ChunkDataNew): SafeHtml {
    if (chunk.attributes.solveTime === 0) {
      return '(No activity)';
    } else if (chunk.attributes.solveTime > 0) {
      return this.sanitize(
        formatUnixTimestamp(chunk.attributes.solveTime, this.dateFormat)
      );
    }

    return this.sanitize(`${chunk.attributes.solveTime}`);
  }
}
