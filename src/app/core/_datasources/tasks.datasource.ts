import { catchError, finalize, forkJoin, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { SERV } from '../_services/main.config';
import { JTaskWrapper } from '../_models/task-wrapper.model';
import { JHashtype } from '../_models/hashtype.model';
import { ResponseWrapper } from '../_models/response.model';
import { JHashlist } from '../_models/hashlist.model';
import { TaskWrapperData, TaskWrapperRelationshipAttributesData } from '../_models/task-wrapper.model';
import { HashtypeData } from '../_models/hashtype.model';
import { TaskData } from '../_models/task.model';
import { Filter, RequestParams } from '../_models/request-params.model';
import { ListResponseWrapper } from '../_models/response.model';
import { HashlistData } from '../_models/hashlist.model';
import { AccessGroupData } from '../_models/access-group.model';

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

    const filters = new Array<Filter>(
      {field: "isArchived", operator: "eq", value: this._isArchived}
    ) 
    if (this._hashlistId) {
      filters.push({field: "hashlistId", operator: "eq", value: this._hashlistId});
    }

    const params: RequestParams = {
      page: {
        size: this.pageSize,
        after: startAt
      },
      include: ['accessGroup','tasks'],
      filter: filters
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      if (order.length > 0) {
        params.sort = [order];
      }
    }

    const wrappers$ = this.service.getAll(SERV.TASKS_WRAPPER, params);
    const hashLists$ = this.service.getAll(SERV.HASHLISTS, {
      page:{ size: this.maxResults}
    });
    const hashTypes$ = this.service.getAll(SERV.HASHTYPES, {
      page:{ size: this.maxResults}
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
