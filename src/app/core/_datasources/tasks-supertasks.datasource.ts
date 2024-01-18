import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { SERV } from '../_services/main.config';
import { SuperTask } from '../_models/supertask.model';

export class TasksSupertasksDataSource extends BaseDataSource<
  Task,
  MatTableDataSourcePaginator
> {
  private _supertTaskId = 0;

  setSuperTaskId(supertTaskId: number) {
    this._supertTaskId = supertTaskId;
  }

  loadAll(): void {
    this.loading = true;

    const pretasks$ = this.service.getAll(SERV.TASKS, {
      maxResults: this.maxResults,
      filter: 'taskWrapperId=' + this._supertTaskId + '',
      expand: 'assignedAgents'
    });

    this.subscriptions.push(
      pretasks$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<Task>) => {
          const pretasks: Task[] = response.values;
          this.setData(pretasks);
        })
    );
  }

  getData(): Task[] {
    return this.getOriginalData();
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
