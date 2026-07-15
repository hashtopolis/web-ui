import { zTaskWrapperDisplayListResponse } from '@generated/api/zod';
import { EMPTY, catchError } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { Filter, FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JTaskWrapperDisplayOverview } from '@models/task.model';

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
          this.setData(taskWrappers);
        })
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
