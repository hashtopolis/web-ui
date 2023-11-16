import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { Log } from '../_models/log.model';
import { SERV } from '../_services/main.config';

export class LogsDataSource extends BaseDataSource<Log> {
  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const params = {
      maxResults: this.pageSize,
      startAt: startAt
    };

    const logs$ = this.service.getAll(SERV.LOGS, params);

    this.subscriptions.push(
      logs$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<Log>) => {
          const logs: Log[] = response.values;

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
    this.loadAll();
  }
}
