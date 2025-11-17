/**
 * Contains data source for agents resource
 * @module
 */
import { catchError, finalize, firstValueFrom, of } from 'rxjs';

import { JAgentAssignment } from '@models/agent-assignment.model';
import { JAgentStat } from '@models/agent-stats.model';
import { JAgent } from '@models/agent.model';
import { JChunk } from '@models/chunk.model';
import { Filter, FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JUser } from '@models/user.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class AgentsDataSource extends BaseDataSource<JAgent> {
  private chunktime = this.uiService.getUIsettings('chunktime').value;
  private _taskId = 0;
  private _currentFilter: Filter = null;
  private agentStatsRequired: boolean = false;

  // Agent stats intervall to define the max time period agent stats will be retrieved, current preset to 24h
  private AGENTSTATS_INTERVALL: number = 3600000 * 24;

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
    const agentParams = new RequestParamBuilder()
      .addInitial(this)
      .addInclude('accessGroups')
      .addInclude('tasks')
      .addInclude('assignments');

    this.applyFilterWithPaginationReset(agentParams, activeFilter, query);

    this.service
      .getAll(SERV.AGENTS, agentParams.create())
      .pipe(
        catchError(() => of([])),
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
          const agentIds = agents.map((agent) => agent.id);

          const userIds: Array<number> = agents.map((agent) => agent.userId).filter((userId) => userId !== null);
          const [users, agentStats] = await Promise.all([this.loadUserData(userIds), this.loadAgentStats(agentIds)]);

          agents.forEach((agent: JAgent) => {
            agent.user = users.find((user: JUser) => user.id === agent.userId);
            if (agent.tasks && agent.tasks.length > 0) {
              agent.taskId = agent.tasks[0].id;
              agent.task = agent.tasks[0];
              agent.taskName = agent.task.taskName;
            }
            if (this.agentStatsRequired) {
              agent.agentStats = agentStats.filter((entry) => entry.agentId === agent.id);
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
   * @return promise containing an array of user objects matching the fiven IDs
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
      const response = await firstValueFrom(this.service.getAll(SERV.USERS, userParams.create()));
      const responseBody = { data: response.data, included: response.included };
      users = this.serializer.deserialize<JUser[]>(responseBody);
    }
    return users;
  }

  /**
   * Load related agent statistics for the last 24h
   * @param agentIds
   * @private
   */
  private async loadAgentStats(agentIds: Array<number>): Promise<JAgentStat[]> {
    if (this.agentStatsRequired) {
      const agentStatParams = new RequestParamBuilder()
        .addFilter({
          field: 'agentId',
          operator: FilterType.IN,
          value: agentIds
        })
        .addFilter({
          field: 'time',
          operator: FilterType.GREATER,
          value: Math.floor((Date.now() - this.AGENTSTATS_INTERVALL) / 1000)
        });
      const response: ResponseWrapper = await firstValueFrom(
        this.service.getAll(SERV.AGENTS_STATS, agentStatParams.create())
      );
      const responseBody = { data: response.data, included: response.included };
      return this.serializer.deserialize<JAgentStat[]>(responseBody);
    }

    return [];
  }

  /**
   * Get current agent cracking speed from all asssigned chunks
   * @param agent - agent instance to get cracking speed for
   * @param chunks - collection of all available chunks
   * @return current agent's cracking speed
   * @private
   */
  private getAgentSpeed(agent: JAgent, chunks: JChunk[]): number {
    let chunkSpeed: number = 0;
    for (const chunk of chunks.filter((element) => element.agentId === agent.id)) {
      if (
        Date.now() / 1000 - Math.max(chunk.solveTime, chunk.dispatchTime) < this.chunktime &&
        chunk.progress < 10000
      ) {
        chunkSpeed += chunk.speed;
      }
    }
    return chunkSpeed;
  }
}
