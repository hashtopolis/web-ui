/**
 * Contains data source for agents resource
 * @module
 */
import { catchError, finalize, firstValueFrom, of } from 'rxjs';

import { JAgentAssignment } from '@models/agent-assignment.model';
import { JAgent } from '@models/agent.model';
import { JChunk } from '@models/chunk.model';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JUser } from '@models/user.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { IParamBuilder } from '@services/params/builder-types.service';

import { BaseDataSource } from '@datasources/base.datasource';

import { ChunkState, chunkStates } from '@src/app/core/_constants/chunks.config';

export class AgentsDataSource extends BaseDataSource<JAgent> {
  private chunktime = this.uiService.getUIsettings('chunktime').value;
  private _taskId = 0;

  setTaskId(taskId: number): void {
    this._taskId = taskId;
  }

  loadAll(): void {
    this.loading = true;
    const agentParams = new RequestParamBuilder()
      .addInitial(this)
      .addInclude('accessGroups')
      .addInclude('tasks')
      .addInclude('assignments')
      .addInclude('agentStats')
      .create();

    this.service
      .getAll(SERV.AGENTS, agentParams)
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
          const chunkParams = new RequestParamBuilder()
            .addFilter({
              field: 'agentId',
              operator: FilterType.IN,
              value: agents.map((agent) => agent.id)
            })
            .addFilter({
              field: 'state',
              operator: FilterType.EQUAL,
              value: chunkStates.indexOf(ChunkState.RUNNING)
            });

          const userIds: Array<number> = agents.map((agent) => agent.userId).filter((userId) => userId !== null);
          const [users, chunks] = await Promise.all([this.loadUserData(userIds), this.loadChunkData(chunkParams)]);

          agents.forEach((agent: JAgent) => {
            agent.user = users.find((user: JUser) => user.id === agent.userId);
            if (agent.tasks && agent.tasks.length > 0) {
              agent.taskId = agent.tasks[0].id;
              agent.task = agent.tasks[0];
              agent.taskName = agent.task.taskName;
              this.setChunkParams(agent, chunks, agent.assignments);
            }
          });
        }
        const length = response.meta.page.total_elements;

        this.setPaginationConfig(this.pageSize, length, this.pageAfter, this.pageBefore, this.index);
        this.setData(agents);
      });
  }

  loadAssignments(): void {
    this.loading = true;
    const assignParams = new RequestParamBuilder()
      .setPageSize(this.pageSize)
      .setPageAfter(this.currentPage * this.pageSize)
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

          const chunkParams = new RequestParamBuilder()
            .addFilter({
              field: 'taskId',
              operator: FilterType.EQUAL,
              value: this._taskId
            })
            .addFilter({
              field: 'agentId',
              operator: FilterType.IN,
              value: agents.map((agent) => agent.id)
            });
          const chunks = await this.loadChunkData(chunkParams);
          agents.forEach((agent: JAgent) => {
            this.setChunkParams(agent, chunks, assignments);
          });

          const length = response.meta.page.total_elements;

          this.setPaginationConfig(this.pageSize, length, this.pageAfter, this.pageBefore, this.index);
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

  /**
   * Load related running chunks for all agents and convert them to ChunkData objects
   * @param requestParams
   * @private
   */
  private async loadChunkData(requestParams: IParamBuilder): Promise<JChunk[]> {
    const response: ResponseWrapper = await firstValueFrom(this.service.getAll(SERV.CHUNKS, requestParams.create()));
    const responseBody = { data: response.data, included: response.included };
    return this.serializer.deserialize<JChunk[]>(responseBody);
  }

  /**
   * Set agent chunk parameters and convert to ch8unkdata
   * @param agent - current agent instance
   * @param chunks - current chunk collectioz
   * @param assignments - current agent assignments
   * @private
   */
  private setChunkParams(agent: JAgent, chunks: JChunk[], assignments: JAgentAssignment[]): void {
    agent.chunk = chunks
      .filter((chunk) => chunk.state == chunkStates.indexOf(ChunkState.RUNNING))
      .find((chunk) => chunk.agentId === agent.id);

    agent.assignmentId = assignments.find((assignment) => assignment.agentId === agent.id)?.id;
    if (agent.chunk) {
      agent.chunkId = agent.chunk.id;
      if (chunks) {
        agent.agentSpeed = this.getAgentSpeed(agent, chunks);
      }
    }
    agent.chunkData = this.convertChunks(agent.id, chunks, true, agent.task.keyspace);
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
