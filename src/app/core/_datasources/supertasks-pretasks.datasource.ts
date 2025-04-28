import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { SERV } from '../_services/main.config';
import { SuperTask } from '../_models/supertask.model';

export class SuperTasksPretasksDataSource extends BaseDataSource<
  SuperTask,
  MatTableDataSourcePaginator
> {
  private _supertTaskId = 0;

  setSuperTaskId(supertTaskId: number) {
    this._supertTaskId = supertTaskId;
  }

  loadAll(): void {
    this.loading = true;

    const params = {
      expand: 'pretasks'
    };

    const pretasks$ = this.service.get(
      SERV.SUPER_TASKS,
      this._supertTaskId,
      params
    );

    this.subscriptions.push(
      pretasks$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<SuperTask>) => {
          const pretasks: SuperTask[] = response['pretasks'];
          this.setData(pretasks);
        })
    );
  }

  getData(): SuperTask[] {
    return this.getOriginalData();
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
