import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { Filter } from '../_models/request-params.model';
import { JLog } from '../_models/log.model';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';
import { ResponseWrapper } from '../_models/response.model';
import { SERV } from '@services/main.config';

export class LogsDataSource extends BaseDataSource<JLog> {
  loadAll(query?: Filter): void {
    this.loading = true;

    //ToDo: Reactivate sorting
    this.sortingColumn.isSortable = false;

    const params = new RequestParamBuilder().addInitial(this);
    if (query) {
      params.addFilter(query);
    }
    const logs$ = this.service.getAll(SERV.LOGS, params.create());

    this.subscriptions.push(
      logs$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ResponseWrapper) => {
          const responseData = { data: response.data, included: response.included };
          const logs = this.serializer.deserialize<JLog[]>(responseData);

          if (this.currentPage * this.pageSize >= logs.length) {
            this.currentPage = 0;
            this.loadAll();
            return;
          }

          const length = response.meta.page.total_elements;

          this.setPaginationConfig(this.pageSize, length, this.pageAfter, this.pageBefore, this.index);
          this.setData(logs);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
