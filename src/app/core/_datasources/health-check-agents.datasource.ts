import { catchError, finalize, forkJoin, of } from 'rxjs';
import { Agent } from '../_models/agent.model';
import { BaseDataSource } from './base.datasource';
import { HealthCheckAgent } from '../_models/health-check.model';
import { ListResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';

export class HealthCheckAgentsDataSource extends BaseDataSource<HealthCheckAgent> {
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
          ([healthCheckResponse, agentsResponse]: [
            ListResponseWrapper<HealthCheckAgent>,
            ListResponseWrapper<Agent>
          ]) => {
            const healthChecksAgent: HealthCheckAgent[] =
              healthCheckResponse.values;
            const agents: Agent[] = agentsResponse.values;

            const joinedData: Array<{ [key: string]: any }> = healthChecksAgent
              .map((healthCheckAgent: HealthCheckAgent) => {
                const matchedAgent = agents.find(
                  (el: Agent) => el._id === healthCheckAgent.agentId
                );

                if (matchedAgent) {
                  return {
                    ...healthCheckAgent,
                    agentName: matchedAgent.agentName
                  };
                } else {
                  // Handle the case where no matching agent is found, ie. deleted agent
                  return null;
                }
              })
              .filter(
                (joinedObject: { [key: string]: any } | null) =>
                  joinedObject !== null
              );

            this.setPaginationConfig(
              this.pageSize,
              this.currentPage,
              healthCheckResponse.total
            );
            this.setData(joinedData as HealthCheckAgent[]);
          }
        )
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
