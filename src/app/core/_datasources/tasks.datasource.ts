import { zChunkListResponse, zTaskListResponse, zTaskWrapperDisplayListResponse } from '@generated/api/zod';
import { EMPTY, catchError, map, of, switchMap } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { JChunk } from '@models/chunk.model';
import { Filter, FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JTask, JTaskWrapperDisplayOverview, TaskType } from '@models/task.model';

import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class TasksDataSource extends BaseDataSource<JTaskWrapperDisplayOverview> {
  private _isArchived: boolean | null = false;
  private _hashlistID = 0;
  private filterQuery: Filter;
  setFilterQuery(filter: Filter): void {
    this.filterQuery = filter;
  }
  setIsArchived(isArchived: boolean | null): void {
    this.reset(true);
    this.pageAfter = null;
    this.pageBefore = null;
    this.index = 0;
    this._isArchived = isArchived;
  }

  setHashlistID(hashlistID: number): void {
    this._hashlistID = hashlistID;
  }

  loadAll(query?: Filter): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInitial(this).addAggregate({
      field: 'taskwrapperdisplay',
      values: ['totalAssignedAgents', 'searched', 'dispatched', 'status', 'currentSpeed'] as const
    });
    if (this._isArchived !== null) {
      params.addFilter({
        field: 'taskWrapperIsArchived',
        operator: FilterType.EQUAL,
        value: this._isArchived
      });
    }
    if (query) {
      params.addFilter(query);
    }

    if (this._hashlistID && this._hashlistID > 0) {
      params.addFilter({
        field: 'hashlistId',
        operator: FilterType.EQUAL,
        value: this._hashlistID
      });
    }

    const requestParams = params.create();
    const wrappers$ = this.service.getAll(SERV.TASKS_WRAPPER_DISPLAYS, requestParams);

    this.subscriptions.push(
      wrappers$
        .pipe(
          catchError((error) => {
            this.handleFilterError(error);
            return EMPTY;
          }),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const taskWrappers: JTaskWrapperDisplayOverview[] = this.serializer
            .deserialize(response, zTaskWrapperDisplayListResponse, requestParams)
            .map((w) => ({ ...w, taskWrapperId: w.taskWrapperId ?? w.id }));
          const length = response.meta.page.total_elements;
          const nextLink = response.links.next;
          const prevLink = response.links.prev;
          const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
          const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;

          this.setPaginationConfig(this.pageSize, length, after, before, this.index);
          this.subscriptions.push(
            this.enrichSupertaskMetrics(taskWrappers).subscribe((enrichedWrappers) => {
              this.setData(enrichedWrappers);
            })
          );
        })
    );
  }

  /**
   * Enrich visible supertask rows with live metrics derived from their subtasks.
   * Loads subtasks for the currently visible supertasks, fetches their chunks, then
   * recalculates consolidated speed and assigned-agents counts so the tasks table can
   * display current values even when the wrapper endpoint does not provide them.
   *
   * @param taskWrappers Task and supertask rows currently loaded in the table.
   * @returns Observable emitting the same rows with supertask currentSpeed and
   * totalAssignedAgents refreshed from subtask chunk data.
   */
  private enrichSupertaskMetrics(taskWrappers: JTaskWrapperDisplayOverview[]) {
    const supertaskWrapperIds = taskWrappers
      .filter((wrapper) => wrapper.taskType === TaskType.SUPERTASK)
      .map((wrapper) => wrapper.taskWrapperId ?? wrapper.id)
      .filter((id): id is number => typeof id === 'number');

    if (supertaskWrapperIds.length === 0) {
      return of(taskWrappers);
    }

    const tasksParams = new RequestParamBuilder()
      .addFilter({ field: 'taskWrapperId', operator: FilterType.IN, value: supertaskWrapperIds })
      .create();

    return this.service.getAll(SERV.TASKS, tasksParams).pipe(
      map((tasksResponse: ResponseWrapper) =>
        this.serializer.deserialize(tasksResponse, zTaskListResponse, tasksParams)
      ),
      switchMap((subtasks: JTask[]) => {
        if (subtasks.length === 0) {
          return of(taskWrappers);
        }

        const chunkParams = new RequestParamBuilder()
          .addFilter({
            field: 'taskId',
            operator: FilterType.IN,
            value: subtasks.map((task) => task.id)
          })
          .create();

        return this.service.getAll(SERV.CHUNKS, chunkParams).pipe(
          map((chunkResponse: ResponseWrapper) => {
            const chunks: JChunk[] = this.serializer.deserialize(chunkResponse, zChunkListResponse, chunkParams);
            const speedByWrapperId = new Map<number, number>();
            const agentsByWrapperId = new Map<number, number>();

            for (const task of subtasks) {
              const chunkData = this.convertChunks(task.id, chunks, false, task.keyspace);
              const taskSpeed = chunkData.speed;
              const taskAgents = chunkData.agents.length;
              const wrapperId = task.taskWrapperId;
              speedByWrapperId.set(wrapperId, (speedByWrapperId.get(wrapperId) ?? 0) + taskSpeed);
              agentsByWrapperId.set(wrapperId, (agentsByWrapperId.get(wrapperId) ?? 0) + taskAgents);
            }

            return taskWrappers.map((wrapper) => {
              if (wrapper.taskType !== TaskType.SUPERTASK) {
                return wrapper;
              }

              const wrapperId = wrapper.taskWrapperId ?? wrapper.id;
              return {
                ...wrapper,
                currentSpeed: wrapperId ? (speedByWrapperId.get(wrapperId) ?? 0) : 0,
                totalAssignedAgents: wrapperId ? (agentsByWrapperId.get(wrapperId) ?? 0) : 0
              };
            });
          })
        );
      }),
      catchError(() => of(taskWrappers))
    );
  }

  reload(): void {
    this.clearSelection();
    if (this.filterQuery && this.filterQuery.value) {
      this.loadAll(this.filterQuery);
    } else {
      this.loadAll();
    }
  }
}
