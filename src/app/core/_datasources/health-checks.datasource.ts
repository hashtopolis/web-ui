import { catchError, finalize, forkJoin, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { HashtypeDataAttributes } from '../_models/hashtype.model';
import { HealthCheckData } from '../_models/health-check.model';
import { ListResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class HealthChecksDataSource extends BaseDataSource<HealthCheckData> {
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
            ListResponseWrapper<HealthCheckData>
          ]) => {

            let healthChecks: HealthCheckData[] = [];

            response.data.forEach((value: HealthCheckData) => {
              const healthCheck: HealthCheckData = value;

              let hashTypeId: number = value.attributes.hashtypeId;
              let includedhashType = response.included.find((inc) => inc.type === 'hashType' && inc.id === hashTypeId);
              healthCheck.attributes.hashtype = includedhashType.attributes as HashtypeDataAttributes;

              healthChecks.push(healthCheck);
            });

            this.setPaginationConfig(
              this.pageSize,
              this.currentPage,
              response.total
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
