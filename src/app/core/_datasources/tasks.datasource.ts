import { catchError, finalize, forkJoin, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { Hashlist } from 'src/app/hashlists/hashlist.model';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { SERV } from '../_services/main.config';
import { TaskWrapper } from '../_models/task-wrapper.model';

export class TasksDataSource extends BaseDataSource<
  TaskWrapper,
  MatTableDataSourcePaginator
> {
  private _isArchived = false;

  setIsArchived(isArchived: boolean): void {
    this._isArchived = isArchived;
  }

  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const params = {
      maxResults: this.pageSize,
      startAt: startAt,
      expand: 'accessGroup,tasks',
      filter: `isArchived=${this._isArchived}`
    };

    const wrappers$ = this.service.getAll(SERV.TASKS_WRAPPER, params);
    const hashLists$ = this.service.getAll(SERV.HASHLISTS, {
      maxResults: this.maxResults
    });

    forkJoin([wrappers$, hashLists$])
      .pipe(
        catchError(() => of([])),
        finalize(() => (this.loading = false))
      )
      .subscribe(([taskWrapperResponse, hashlistResponse]) => {
        const wrappers: TaskWrapper[] = taskWrapperResponse.values.map(
          (wrapper: TaskWrapper) => {
            const matchingHashList = hashlistResponse.values.find(
              (hashlist: Hashlist) => hashlist._id === wrapper.hashlistId
            );
            wrapper.hashlists = [matchingHashList];
            return wrapper;
          }
        );
        this.setPaginationConfig(
          this.pageSize,
          this.currentPage,
          taskWrapperResponse.total
        );

        this.setData(wrappers);
      });
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
