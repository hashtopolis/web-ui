import { catchError, finalize, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { LogData } from '../_models/log.model';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';

export class LogsDataSource extends BaseDataSource<LogData> {
  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const params: RequestParams = {
      page: {
        size: this.pageSize,
        after: startAt
      },
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.sort = [order];
    }

    const logs$ = this.service.getAll(SERV.LOGS, params);

    this.subscriptions.push(
      logs$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((response: ListResponseWrapper<LogData>) => {
          const logs: LogData[] = response.data;

          if (startAt >= response.total) {
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
