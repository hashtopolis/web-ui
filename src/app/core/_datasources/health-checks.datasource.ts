import { catchError, finalize, forkJoin, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { JHealthCheck } from '../_models/health-check.model';
import { ResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class HealthChecksDataSource extends BaseDataSource<JHealthCheck> {
  loadAll(): void {
    this.loading = true;
    const params = new RequestParamBuilder().addInitial(this).addInclude('hashType').create();
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
