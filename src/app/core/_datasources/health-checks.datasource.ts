import { catchError, finalize, forkJoin, of } from 'rxjs';

import { JHealthCheck } from '@models/health-check.model';
import { Filter } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class HealthChecksDataSource extends BaseDataSource<JHealthCheck> {
  private _currentFilter: Filter = null;

  loadAll(query?: Filter): void {
    this.loading = true;
    // Store the current filter if provided
    if (query) {
      this._currentFilter = query;
    }

    // Use stored filter if no new filter is provided
    const activeFilter = query || this._currentFilter;
    let params = new RequestParamBuilder().addInitial(this).addInclude('hashType');
    params = this.applyFilterWithPaginationReset(params, activeFilter, query);
    const healthChecks$ = this.service.getAll(SERV.HEALTH_CHECKS, params.create());

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
          const nextLink = response.links.next;
          const prevLink = response.links.prev;
          const after = nextLink ? new URL(response.links.next).searchParams.get('page[after]') : null;
          const before = prevLink ? new URL(response.links.prev).searchParams.get('page[before]') : null;

          this.setPaginationConfig(this.pageSize, length, after, before, this.index);
          this.setData(healthChecks);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
  clearFilter(): void {
    this._currentFilter = null;
    this.setPaginationConfig(this.pageSize, undefined, undefined, undefined, 0);
    this.reload();
  }
}
