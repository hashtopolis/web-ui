import { catchError, finalize, of } from 'rxjs';

import { JHealthCheckAgent } from '@models/health-check.model';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class HealthCheckAgentsDataSource extends BaseDataSource<JHealthCheckAgent> {
  private _healthCheckId = 0;

  setHealthCheckId(healthCheckId: number): void {
    this._healthCheckId = healthCheckId;
  }

  loadAll(): void {
    this.loading = true;
    const healthCheckParams = new RequestParamBuilder()
      .addInitial(this)
      .addFilter({
        field: 'healthCheckId',
        operator: FilterType.EQUAL,
        value: this._healthCheckId
      })
      .addInclude('agent')
      .create();

    const healthChecks$ = this.service.getAll(SERV.HEALTH_CHECKS_AGENTS, healthCheckParams);

    this.subscriptions.push(
      healthChecks$
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe((healthCheckResponse: ResponseWrapper) => {
          const healthChecksAgent = new JsonAPISerializer().deserialize<JHealthCheckAgent[]>({
            data: healthCheckResponse.data,
            included: healthCheckResponse.included
          });

          const length = healthCheckResponse.meta.page.total_elements;
          const nextLink = healthCheckResponse.links.next;
          const prevLink = healthCheckResponse.links.prev;
          const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
          const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;

          this.setPaginationConfig(this.pageSize, length, after, before, this.index);
          this.setData(healthChecksAgent);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
