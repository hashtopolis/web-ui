import { catchError, finalize, forkJoin, of } from 'rxjs';

import { JHealthCheck } from '@models/health-check.model';
import { ResponseWrapper } from '@models/response.model';

import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { SERV } from '@services/main.config';

import { BaseDataSource } from '@datasources/base.datasource';

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
        .subscribe(([response]: [ResponseWrapper]) => {
          const responseData = { data: response.data, included: response.included };
          const healthChecks = this.serializer.deserialize<JHealthCheck[]>(responseData);

          healthChecks.forEach((healthCheck: JHealthCheck) => {
            healthCheck.hashTypeDescription = healthCheck.hashType?.description;
          });

          const length = response.meta.page.total_elements;

          this.setPaginationConfig(
            this.pageSize,
            length,
            this.pageAfter,
            this.pageBefore,
            this.index
          );
          this.setData(healthChecks);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
