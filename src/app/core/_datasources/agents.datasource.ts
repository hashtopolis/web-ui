/**
 * Contains data source for agents resource
 * @module
 */
import { catchError, finalize, firstValueFrom, of } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';

import { JAgentAssignment } from '@models/agent-assignment.model';
import { JAgent } from '@models/agent.model';
import { Filter, FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JUser } from '@models/user.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class AgentsDataSource extends BaseDataSource<JAgent> {
  private _taskId = 0;
  private _currentFilter: Filter = null;
  private agentStatsRequired: boolean = false;

  setTaskId(taskId: number): void {
    this._taskId = taskId;
  }

  /**
   * Enable or disabke the retrieval of agentStat relations
   * @param agentStatsRequired
   */
  setAgentStatsRequired(agentStatsRequired: boolean): void {
    this.agentStatsRequired = agentStatsRequired;
  }

  loadAll(query?: Filter): void {
    this.loading = true;
    // Store the current filter if provided
    if (query) {
      this._currentFilter = query;
    }

    // Use stored filter if no new filter is provided
    const activeFilter = query || this._currentFilter;
    let agentParams = new RequestParamBuilder()
      .addInitial(this)
      .addInclude('accessGroups')
      .addInclude('tasks')
      .addInclude('assignments')
      .addInclude('user');
    if (this.agentStatsRequired) {
      agentParams = agentParams.addInclude('agentStats');
    }

    this.applyFilterWithPaginationReset(agentParams, activeFilter, query);

    // Create headers to skip error dialog for filter validation errors
    const httpOptions = { headers: new HttpHeaders({ 'X-Skip-Error-Dialog': 'true' }) };

    this.service
      .getAll(SERV.AGENTS, agentParams.create(), httpOptions)
      .pipe(
        catchError((error) => {
          this.handleFilterError(error);
          return of([]);
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe(async (response: ResponseWrapper) => {
        const serializer = new JsonAPISerializer();
        const responseBody = { data: response.data, included: response.included };
        const agents = serializer.deserialize<JAgent[]>({
          data: responseBody.data,
          included: responseBody.included
        });

        if (agents && agents.length > 0) {
          agents.forEach((agent: JAgent) => {
            if (agent.tasks && agent.tasks.length > 0) {
              agent.taskId = agent.tasks[0].id;
              agent.task = agent.tasks[0];
              agent.taskName = agent.task.taskName;
            }
          });
        }

        const length = response.meta.page.total_elements;
        const nextLink = response.links.next;
        const prevLink = response.links.prev;
        const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
        const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;

        this.setPaginationConfig(this.pageSize, length, after, before, this.index);
        this.setData(agents);
      });
  }

  loadAssignments(): void {
    this.loading = true;
    const assignParams = new RequestParamBuilder()
      .addInclude('agent')
      .addInclude('task')
      .addFilter({ field: 'taskId', operator: FilterType.EQUAL, value: this._taskId })
      .create();

    this.service
      .getAll(SERV.AGENT_ASSIGN, assignParams)
      .pipe(
        catchError(() => of([])),
        finalize(() => (this.loading = false))
      )
      .subscribe(async (response: ResponseWrapper) => {
        const serializer = new JsonAPISerializer();
        const responseBody = { data: response.data, included: response.included };
        const assignments = serializer.deserialize<JAgentAssignment[]>({
          data: responseBody.data,
          included: responseBody.included
        });
        if (assignments && assignments.length > 0) {
          const userIds: Array<number> = assignments
            .map((assignment) => assignment.agent.userId)
            .filter((userId) => userId !== null);
          const users = await this.loadUserData(userIds);

          const agents: JAgent[] = [];
          assignments.forEach((assignment) => {
            const task = assignment.task;
            const agent = assignment.agent;
            agent.task = task;
            agent.user = users.find((user) => user.id === agent.userId);
            agent.taskName = agent.task.taskName;
            agent.taskId = agent.task.id;
            agent.benchmark = assignment.benchmark;
            agents.push(agent);
          });

          const length = response.meta.page.total_elements;
          const nextLink = response.links.next;
          const prevLink = response.links.prev;
          const after = nextLink ? new URL(nextLink).searchParams.get('page[after]') : null;
          const before = prevLink ? new URL(prevLink).searchParams.get('page[before]') : null;

          this.setPaginationConfig(this.pageSize, length, after, before, this.index);
          this.setData(agents);
        } else {
          const agents: JAgent[] = [];
          this.setData(agents);
        }
      });
  }

  reload(): void {
    this.clearSelection();
    if (this._taskId) {
      this.loadAssignments();
    } else {
      this.loadAll();
    }
  }
  clearFilter(): void {
    this._currentFilter = null;
    this.setPaginationConfig(this.pageSize, undefined, undefined, undefined, 0);
    this.reload();
  }

  /**
   * Load user data from backend given an array of user IDs
   * @param userIds - array of user ids
   * @return promise containing an array of user objects matching the given IDs
   * @private
   */
  private async loadUserData(userIds: Array<number>): Promise<JUser[]> {
    let users: Array<JUser> = [];
    if (userIds.length > 0) {
      const userParams = new RequestParamBuilder().addFilter({
        field: 'id',
        operator: FilterType.IN,
        value: userIds
      });
      try {
        const response = await firstValueFrom(
          this.service.getAll(SERV.USERS, userParams.create()).pipe(
            catchError((error) => {
              this.handleFilterError(error);
              throw error;
            })
          )
        );
        const responseBody = { data: response.data, included: response.included };
        users = this.serializer.deserialize<JUser[]>(responseBody);
      } catch {
        // Error already handled via handleFilterError
      }
    }
    return users;
  }
}
