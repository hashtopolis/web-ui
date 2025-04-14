import { catchError, finalize, forkJoin, of } from 'rxjs';

import { FilterType } from '@models/request-params.model';
import { JHealthCheckAgent } from '@models/health-check.model';
import { JAgent } from '@models/agent.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { SERV } from '@services/main.config';

import { BaseDataSource } from '@datasources/base.datasource';

export class HealthCheckAgentsDataSource extends BaseDataSource<JHealthCheckAgent> {
  private _healthCheckId = 0;

  setHealthCheckId(healthCheckId: number): void {
    this._healthCheckId = healthCheckId;
  }

  loadAll(): void {
    this.loading = true;
    const healthCheckParams = new RequestParamBuilder()
      .setPageSize(this.pageSize)
      .addFilter({
        field: 'healthCheckId',
        operator: FilterType.EQUAL,
        value: this._healthCheckId
      })
      .create();

    const agentParams = new RequestParamBuilder().setPageSize(this.pageSize).create();

    /**
     * @todo Extend health checks api response with Agents
     */
    const healthChecks$ = this.service.getAll(SERV.HEALTH_CHECKS_AGENTS, healthCheckParams);
    const agents$ = this.service.getAll(SERV.AGENTS, agentParams);

    this.subscriptions.push(
      forkJoin([healthChecks$, agents$])
        .pipe(
          catchError(() => of([])),
          finalize(() => (this.loading = false))
        )
        .subscribe(([healthCheckResponse, agentsResponse]: [ResponseWrapper, ResponseWrapper]) => {
          const healthChecksAgent = new JsonAPISerializer().deserialize<JHealthCheckAgent[]>({
            data: healthCheckResponse.data,
            included: healthCheckResponse.included
          });
          const agents = new JsonAPISerializer().deserialize<JAgent[]>({
            data: agentsResponse.data,
            included: agentsResponse.included
          });

          const joinedData: Array<{ [key: string]: any }> = healthChecksAgent
            .map((healthCheckAgent: JHealthCheckAgent) => {
              const matchedAgent = agents.find((agent: JAgent) => agent.id === healthCheckAgent.agentId);

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
            .filter((joinedObject: { [key: string]: any } | null) => joinedObject !== null);

          this.setPaginationConfig(this.pageSize, this.currentPage, healthChecksAgent.length);
          this.setData(joinedData as JHealthCheckAgent[]);
        })
    );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
