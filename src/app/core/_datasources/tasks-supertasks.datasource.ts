import { zTaskListResponse } from '@generated/api/zod';
import { EMPTY, catchError, finalize } from 'rxjs';

import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JTaskWith } from '@models/task.model';

import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

type Subtask = JTaskWith<'dispatched' | 'searched' | 'totalAssignedAgents' | 'status' | 'currentSpeed' | 'cracked'>;

export class TasksSupertasksDataSource extends BaseDataSource<Subtask> {
  private _supertTaskId = 0;

  setSuperTaskId(supertTaskId: number) {
    this._supertTaskId = supertTaskId;
  }

  loadAll(): void {
    this.loading = true;

    // fetch all subtasks of task as this is a client sorted table
    this.pageSize = this.maxResults;

    const params = new RequestParamBuilder()
      .addInitial(this)
      .addFilter({ field: 'taskWrapperId', operator: FilterType.EQUAL, value: this._supertTaskId })
      .addAggregate({
        field: 'task',
        values: ['dispatched', 'searched', 'totalAssignedAgents', 'status', 'currentSpeed', 'cracked'] as const
      })
      .create();

    const subtasks$ = this.service.getAll(SERV.TASKS, params);

    this.subscriptions.push(
      subtasks$
        .pipe(
          catchError(() => EMPTY),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const subtasks: Subtask[] = this.serializer.deserialize(response, zTaskListResponse, params);
          const length = response.meta.page.total_elements;
          const nextLink = response.links.next;
          const prevLink = response.links.prev;
          const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
          const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;

          this.setPaginationConfig(this.pageSize, length, after, before, this.index);
          this.setData(subtasks);
        })
    );
  }

  getData(): Subtask[] {
    return this.getOriginalData();
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
