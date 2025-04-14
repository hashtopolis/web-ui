import { catchError, finalize, forkJoin, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { Hashtype } from '../_models/hashtype.model';
import { HealthCheck } from '../_models/health-check.model';
import { ListResponseWrapper } from '../_models/response.model';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';

export class HealthChecksDataSource extends BaseDataSource<HealthCheck> {
  loadAll(): void {
    this.loading = true;

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const params: RequestParams = {
      maxResults: this.pageSize,
      startsAt: startAt
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      params.ordering = order;
    }

    const healthChecks$ = this.service.getAll(SERV.HEALTH_CHECKS, params);

    const hashTypes$ = this.service.getAll(SERV.HASHTYPES, {
      maxResults: this.maxResults
    });

    this.subscriptions.push(
      forkJoin([healthChecks$, hashTypes$])
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe(
          ([healthCheckResponse, hashTypesResponse]: [
            ListResponseWrapper<HealthCheck>,
            ListResponseWrapper<Hashtype>
          ]) => {
            const healthChecks: HealthCheck[] = healthCheckResponse.values;
            const hashTypes: Hashtype[] = hashTypesResponse.values;

            healthChecks.map((healthCheck: HealthCheck) => {
              healthCheck.hashtype = hashTypes.find(
                (el: Hashtype) => el._id === healthCheck.hashtypeId
              );
              healthCheck.hashtypeDescription =
                healthCheck.hashtype.description;
            });

            this.setPaginationConfig(
              this.pageSize,
              this.currentPage,
              healthCheckResponse.total
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
