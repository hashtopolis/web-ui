import { catchError, finalize, map, of, switchMap } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';

import { Filter, FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JSuperTask } from '@models/supertask.model';
import { JTask } from '@models/task.model';

import { SERV } from '@services/main.config';

import { BaseDataSource } from '@datasources/base.datasource';

import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class SuperTasksDataSource extends BaseDataSource<JSuperTask> {
  private _currentFilter: Filter = null;

  loadAll(query?: Filter): void {
    this.loading = true;
    // Store the current filter if provided
    if (query) {
      this._currentFilter = query;
    }

    // Use stored filter if no new filter is provided
    const activeFilter = query || this._currentFilter;
    let params = new RequestParamBuilder().addInitial(this).addInclude('pretasks');
    params = this.applyFilterWithPaginationReset(params, activeFilter, query);

    // Create headers to skip error dialog for filter validation errors
    const httpOptions = { headers: new HttpHeaders({ 'X-Skip-Error-Dialog': 'true' }) };
    const supertasks$ = this.service.getAll(SERV.SUPER_TASKS, params.create(), httpOptions).pipe(
      map((response: ResponseWrapper) => {
        const responseBody = { data: response.data, included: response.included };
        const supertasks = this.serializer.deserialize<JSuperTask[]>(responseBody);

        const length = response.meta.page.total_elements;
        const nextLink = response.links.next;
        const prevLink = response.links.prev;
        const after = nextLink ? new URL(response.links.next).searchParams.get('page[after]') : null;
        const before = prevLink ? new URL(response.links.prev).searchParams.get('page[before]') : null;

        this.setPaginationConfig(this.pageSize, length, after, before, this.index);

        return supertasks;
      })
    );

    this.subscriptions.push(
      supertasks$
        .pipe(
          switchMap((supertasks) =>
            this.getSubtasksBySupertaskId$(supertasks.map((supertask) => supertask.id)).pipe(
              map((subtasksBySupertaskId) => ({ supertasks, subtasksBySupertaskId }))
            )
          )
        )
        .pipe(
          catchError((error) => {
            this.handleFilterError(error);
            return of({ supertasks: [], subtasksBySupertaskId: new Map<number, JTask[]>() });
          }),
          finalize(() => (this.loading = false))
        )
        .subscribe(({ supertasks, subtasksBySupertaskId }) => {
          const supertasksWithStatus = supertasks.map((supertask) => {
            const subtasks = subtasksBySupertaskId.get(supertask.id) || [];
            const activeSubtasks = subtasks.filter((subtask) => (subtask.activeAgents || 0) > 0).length;
            const completedSubtasks = subtasks.filter((subtask) => this.isCompletedSubtask(subtask)).length;

            return {
              ...supertask,
              subtasks,
              activeSubtasks,
              isRunning: activeSubtasks > 0,
              isCompleted: subtasks.length > 0 && completedSubtasks === subtasks.length
            };
          });

          this.setData(supertasksWithStatus);
        })
    );
  }

  private getSubtasksBySupertaskId$(supertaskIds: number[]) {
    if (!supertaskIds?.length) {
      return of(new Map<number, JTask[]>());
    }

    const params = new RequestParamBuilder()
      .setPageSize(Math.max(this.maxResults, supertaskIds.length * 25))
      .addFilter({ field: 'taskWrapperId', operator: FilterType.IN, value: supertaskIds })
      .addFilter({ field: 'isArchived', operator: FilterType.EQUAL, value: false })
      .create();

    return this.service.getAll(SERV.TASKS, params).pipe(
      map((response: ResponseWrapper) => {
        const subtasks = this.serializer.deserialize<JTask[]>({
          data: response.data,
          included: response.included
        });

        const mapBySupertaskId = new Map<number, JTask[]>();
        subtasks.forEach((subtask) => {
          const list = mapBySupertaskId.get(subtask.taskWrapperId) || [];
          list.push(subtask);
          mapBySupertaskId.set(subtask.taskWrapperId, list);
        });

        return mapBySupertaskId;
      }),
      catchError(() => of(new Map<number, JTask[]>()))
    );
  }

  private isCompletedSubtask(subtask: JTask): boolean {
    return (
      subtask.keyspaceProgress >= subtask.keyspace && subtask.keyspaceProgress > 0 && Number(subtask.searched) === 100
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }

  clearFilter(): void {
    this._currentFilter = null;
    this.setPaginationConfig(this.pageSize, undefined, undefined, undefined, 0);
    this.reload();
  }
}
