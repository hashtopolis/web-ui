import { catchError, finalize, forkJoin, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { SERV } from '../_services/main.config';
import { JTaskWrapper } from '../_models/task-wrapper.model';
import { JHashtype } from '../_models/hashtype.model';
import { ResponseWrapper } from '../_models/response.model';
import { JHashlist } from '../_models/hashlist.model';
import { FilterType } from '../_models/request-params.model';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

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
    const params = new RequestParamBuilder().addInitial(this).addInclude('accessGroup').addInclude('tasks').addFilter({
      field: 'isArchived',
      operator: FilterType.EQUAL,
      value: this._isArchived
    });

    if (this._hashlistId) {
      params.addFilter({ field: 'hashlistId', operator: FilterType.EQUAL, value: this._hashlistId });
    }

    const wrappers$ = this.service.getAll(SERV.TASKS_WRAPPER, params.create());
    const hashLists$ = this.service.getAll(SERV.HASHLISTS, {
      page: { size: this.maxResults }
    });
    const hashTypes$ = this.service.getAll(SERV.HASHTYPES, {
      page: { size: this.maxResults }
    });

    forkJoin([wrappers$, hashLists$, hashTypes$])
      .pipe(
        catchError(() => of([])),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        ([taskWrapperResponse, hashlistResponse, hashtypeResponse]: [ResponseWrapper, ResponseWrapper, ResponseWrapper]) => {

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
