import { catchError, finalize, of } from 'rxjs';
import { BaseDataSource } from '@datasources/base.datasource';
import { JPretask } from '@models/pretask.model';
import { MatTableDataSourcePaginator } from '@angular/material/table';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { SERV } from '@services/main.config';
import { ResponseWrapper } from '@models/response.model';
import { JsonAPISerializer } from '@services/api/serializer-service';
import { JSuperTask } from '@models/supertask.model';

export class SuperTasksPretasksDataSource extends BaseDataSource<JPretask, MatTableDataSourcePaginator> {
  private _supertTaskId = 0;

  setSuperTaskId(supertTaskId: number) {
    this._supertTaskId = supertTaskId;
  }

  loadAll(): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInclude('pretasks').create();
    const pretasks$ = this.service.get(SERV.SUPER_TASKS.URL, this._supertTaskId, params);

    this.subscriptions.push(
      pretasks$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const pretasks = new JsonAPISerializer().deserialize<JSuperTask>({
            data: response.data,
            included: response.included
          }).pretasks;
          this.setData(pretasks);
        })
    );
  }

  getData(): JPretask[] {
    return this.getOriginalData();
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
