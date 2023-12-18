import { catchError, finalize, forkJoin, of } from 'rxjs';
import { Agent } from '../_models/agent.model';
import { BaseDataSource } from './base.datasource';
import { HealthCheckView } from '../_models/health-check.model';
import { ListResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';

export class HealthChecksViewDataSource extends BaseDataSource<HealthCheckView> {
  private _healthCheckId = 0;

  setHealthCheckId(healthCheckId: number): void {
    this._healthCheckId = healthCheckId;
  }

  loadAll(): void {
    this.loading = true;

    /**
     * @todo Extend health checks api response with Agents
     */
    const healthChecks$ = this.service.getAll(SERV.HEALTH_CHECKS_AGENTS, {
      maxResults: this.pageSize,
      filter: `healthCheckId=${this._healthCheckId}`
    });

    const agents$ = this.service.getAll(SERV.AGENTS, {
      maxResults: this.maxResults
    });

    this.subscriptions.push(
      forkJoin([healthChecks$, agents$])
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe(
          ([healthCheckResponse, hashTypesResponse]: [
            ListResponseWrapper<HealthCheckView>,
            ListResponseWrapper<Agent>
          ]) => {
            const healthChecks: HealthCheckView[] = healthCheckResponse.values;
            const agents: Agent[] = hashTypesResponse.values;

            healthChecks.map((healthCheck) => {
              agents.find((el) => el.agentId === healthCheck.agentId);
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
