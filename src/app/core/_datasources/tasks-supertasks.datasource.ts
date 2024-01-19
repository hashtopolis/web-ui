import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { SERV } from '../_services/main.config';
import { TaskWrapper } from '../_models/task-wrapper.model';

export class TasksSupertasksDataSource extends BaseDataSource<
  TaskWrapper,
  MatTableDataSourcePaginator
> {
  private _supertTaskId = 0;

  setSuperTaskId(supertTaskId: number) {
    this._supertTaskId = supertTaskId;
  }

  loadAll(): void {
    this.loading = true;

    const pretasks$ = this.service.getAll(SERV.TASKS_WRAPPER, {
      maxResults: this.maxResults,
      filter: 'taskWrapperId=' + this._supertTaskId + '',
      expand: 'tasks'
    });

    this.subscriptions.push(
      pretasks$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<TaskWrapper>) => {
          console.log(response);
          const pretasks: any[] = response.values[0].tasks;
          this.setData(pretasks);
        })
    );
  }

  getData(): TaskWrapper[] {
    return this.getOriginalData();
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
