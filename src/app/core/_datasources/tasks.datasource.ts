import { catchError, finalize, forkJoin, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { SERV } from '../_services/main.config';
import { JTaskWrapper } from '../_models/task-wrapper.model';
import { JHashtype } from '../_models/hashtype.model';
import { RequestParams } from '../_models/request-params.model';
import { ResponseWrapper } from '../_models/response.model';
import { JHashlist } from '../_models/hashlist.model';

export class TasksDataSource extends BaseDataSource<
  JTaskWrapper,
  MatTableDataSourcePaginator
> {
  private _isArchived = false;
  private _hashlistId = 0;

  setIsArchived(isArchived: boolean): void {
    this._isArchived = isArchived;
  }

  setHashlistId(hashlistId: number): void {
    this._hashlistId = hashlistId;
  }

  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const additionalFilter = this._hashlistId
      ? `,hashlistId=${this._hashlistId}`
      : '';

    const params: RequestParams = {
      maxResults: this.pageSize,
      startsAt: startAt,
      include: 'accessGroup,tasks',
      filter: `filter[isArchived__eq]=${this._isArchived}${additionalFilter}`
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.ordering = order;
    }

    const wrappers$ = this.service.getAll(SERV.TASKS_WRAPPER, params);
    const hashLists$ = this.service.getAll(SERV.HASHLISTS, {
      maxResults: this.maxResults
    });
    const hashTypes$ = this.service.getAll(SERV.HASHTYPES, {
      maxResults: this.maxResults
    });

    forkJoin([wrappers$, hashLists$, hashTypes$])
      .pipe(
        catchError(() => of([])),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        ([taskWrapperResponse, hashlistResponse, hashtypeResponse]:[ResponseWrapper, ResponseWrapper, ResponseWrapper]) => {

          const taskWrapperResponseBody = { data: taskWrapperResponse.data, included: taskWrapperResponse.included };
          const taskWrappersDeserialized = this.serializer.deserialize<JTaskWrapper[]>(taskWrapperResponseBody);

          const hashlistResponseBody = { data: hashlistResponse.data, included: hashlistResponse.included };
          const hashlists = this.serializer.deserialize<JHashlist[]>(hashlistResponseBody);

          const hashtypeResponseBody = { data: hashtypeResponse.data, included: hashtypeResponse.included };
          const hashtypes = this.serializer.deserialize<JHashtype[]>(hashtypeResponseBody);

          let taskWrappers: JTaskWrapper[] = [];

          taskWrappersDeserialized.forEach((value: JTaskWrapper) => {
            const taskWrapper: JTaskWrapper = value;

              const matchingHashList = hashlists.find(
                        (hashlist: JHashlist) => hashlist.id === taskWrapper.hashlistId
                      );
              taskWrapper.hashlists = [matchingHashList];

              const matchingHashTypes = hashtypes.find(
                        (hashtype: JHashtype) =>
                          hashtype.id === matchingHashList.hashTypeId
                      );
              taskWrapper.hashtypes = [matchingHashTypes];

            taskWrappers.push(taskWrapper);
          });

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            taskWrappers.length
          );
          this.setData(taskWrappers);
        }
      );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
