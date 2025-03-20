import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { LogData } from '../_models/log.model';
import { SERV } from '../_services/main.config';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class LogsDataSource extends BaseDataSource<LogData> {
  loadAll(): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInitial(this).create();
    const logs$ = this.service.getAll(SERV.LOGS, params);

    this.subscriptions.push(
      logs$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<LogData>) => {
          const logs: LogData[] = response.data;
          if (this.currentPage * this.pageSize >= response.total) {
            this.currentPage = 0;
            this.loadAll();
            return;
          }

          this.setPaginationConfig(
            this.pageSize,
            this.currentPage,
            response.total
          );
          this.setData(logs);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
