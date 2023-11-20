import { catchError, finalize, forkJoin, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { Hashtype } from '../_models/hashtype.model';
import { HealthCheck } from '../_models/health-check.model';
import { ListResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';

export class HealthChecksDataSource extends BaseDataSource<HealthCheck> {
  loadAll(): void {
    this.loading = true;

    /**
     * @todo Extend health checks api response with hashtype
     */
    const healthChecks$ = this.service.getAll(SERV.HEALTH_CHECKS, {
      maxResults: this.pageSize
    });

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
    this.loadAll();
  }
}
