import { catchError, finalize, forkJoin, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { Hashlist } from 'src/app/hashlists/hashlist.model';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { SERV } from '../_services/main.config';
import { TaskWrapper } from '../_models/task-wrapper.model';
import { Hashtype } from '../_models/hashtype.model';

export class TasksDataSource extends BaseDataSource<
  TaskWrapper,
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
    // @todo Implement hashlist filter in API
    const additionalFilter = this._hashlistId
      ? `;hashlistId=${this._hashlistId}`
      : '';
    const params = {
      maxResults: this.pageSize,
      startAt: startAt,
      expand: 'accessGroup,tasks',
      filter: `isArchived=${this._isArchived}` //${additionalFilter}`
    };

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
        ([taskWrapperResponse, hashlistResponse, hashtypeResponse]) => {
          const wrappers: TaskWrapper[] = taskWrapperResponse.values.map(
            (wrapper: TaskWrapper) => {
              const matchingHashList = hashlistResponse.values.find(
                (hashlist: Hashlist) => hashlist._id === wrapper.hashlistId
              );
              const matchingHashTypes = hashtypeResponse.values.find(
                (hashtype: Hashtype) =>
                  hashtype._id === matchingHashList.hashTypeId
              );
              wrapper.hashlists = [matchingHashList];
              wrapper.hashtypes = [matchingHashTypes];
              wrapper.taskName = wrapper.tasks[0].taskName;
              wrapper.accessGroupName = wrapper.accessGroup?.groupName;
              return wrapper;
            }
          );
          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            taskWrapperResponse.total
          );
          this.setData(wrappers);
        }
      );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
