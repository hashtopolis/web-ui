import { catchError, finalize, forkJoin, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { JHealthCheck } from '../_models/health-check.model';
import { ResponseWrapper } from '../_models/response.model';import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';

export class HealthChecksDataSource extends BaseDataSource<JHealthCheck> {
  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const params: RequestParams = {
      page: {
        size: this.pageSize,
        after: startAt
      },
      include: ['hashType']
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.include = [order];
    }

    const healthChecks$ = this.service.getAll(SERV.HEALTH_CHECKS, params);

    this.subscriptions.push(
      forkJoin([healthChecks$])
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe(
          ([response]: [
            ResponseWrapper
          ]) => {

            const responseData = { data: response.data, included: response.included };
            const healthChecks = this.serializer.deserialize<JHealthCheck[]>(responseData);

            healthChecks.forEach((healthCheck: JHealthCheck) => {
              healthCheck.hashTypeDescription = healthCheck.hashType?.description;
            });

            this.setPaginationConfig(
              this.pageSize,
              this.currentPage,
              healthChecks.length,
            );
            this.setData(healthChecks);
          }
        )
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
