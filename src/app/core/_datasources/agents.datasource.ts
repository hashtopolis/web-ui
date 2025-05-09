/**
 * Contains data source for agents resource
 * @module
 */
import { catchError, finalize, firstValueFrom, forkJoin, of } from 'rxjs';

import { JAgentAssignment } from '@models/agent-assignment.model';
import { JAgent } from '@models/agent.model';
import { JChunk } from '@models/chunk.model';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JTask } from '@models/task.model';
import { JUser } from '@models/user.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';

import { BaseDataSource } from '@datasources/base.datasource';

export class AgentsDataSource extends BaseDataSource<JAgent> {
  private _taskId = 0;

  setTaskId(taskId: number): void {
    this._taskId = taskId;
  }

  loadAll(): void {
    this.loading = true;
    const agentParams = new RequestParamBuilder().addInitial(this).addInclude('accessGroups').create();
    const agents$ = this.service.getAll(SERV.AGENTS, agentParams);

    const params = new RequestParamBuilder().setPageSize(this.maxResults).create();
    const users$ = this.service.getAll(SERV.USERS, params);
    const agentAssign$ = this.service.getAll(SERV.AGENT_ASSIGN, params);
    const tasks$ = this.service.getAll(SERV.TASKS, params);

    const serializer = new JsonAPISerializer();

    forkJoin([agents$, users$, agentAssign$, tasks$])
      .pipe(
        catchError(() => of([])),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        async ([agentResponse, userResponse, assignmentResponse, taskResponse]: [
          ResponseWrapper,
          ResponseWrapper,
          ResponseWrapper,
          ResponseWrapper
        ]) => {
          const agents = serializer.deserialize<JAgent[]>({
            data: agentResponse.data,
            included: agentResponse.included
          });
          const users = serializer.deserialize<JUser[]>({
            data: userResponse.data,
            included: userResponse.included
          });
          const assignments = serializer.deserialize<JAgentAssignment[]>({
            data: assignmentResponse.data,
            included: assignmentResponse.included
          });
          const tasks = serializer.deserialize<JTask[]>({
            data: taskResponse.data,
            included: taskResponse.included
          });

          agents.map((agent: JAgent) => {
            agent.user = users.find((user: JUser) => user.id === agent.userId);
            agent.taskId = assignments.find((assignment) => assignment.agentId === agent.id)?.taskId;
            if (agent.taskId) {
              agent.task = tasks.find((e) => e.id === agent.taskId);
              agent.taskName = agent.task.taskName;
            }
            return agent;
          });
          await this.loadChunkData(agents, assignments);
          this.setPaginationConfig(this.pageSize, this.currentPage, agents.length);
          this.setData(agents);
        }
      );
  }

  loadAssignments(): void {
    this.loading = true;
    const params = new RequestParamBuilder().setPageSize(this.maxResults).create();
    const assignParams = new RequestParamBuilder()
      .setPageSize(this.pageSize)
      .setPageAfter(this.currentPage * this.pageSize)
      .addInclude('agent')
      .addInclude('task')
      .addFilter({ field: 'taskId', operator: FilterType.EQUAL, value: this._taskId })
      .create();

    const agentAssign$ = this.service.getAll(SERV.AGENT_ASSIGN, assignParams);
    const users$ = this.service.getAll(SERV.USERS, params);

    const serializer = new JsonAPISerializer();

    forkJoin([users$, agentAssign$])
      .pipe(
        catchError(() => of([])),
        finalize(() => (this.loading = false))
      )
      .subscribe(async ([userResponse, assignmentResponse]: [ResponseWrapper, ResponseWrapper]) => {
        const users = serializer.deserialize<JUser[]>({
          data: userResponse.data,
          included: userResponse.included
        });
        const assignments = serializer.deserialize<JAgentAssignment[]>({
          data: assignmentResponse.data,
          included: assignmentResponse.included
        });
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

        await this.loadChunkData(agents, assignments);
        this.setPaginationConfig(this.pageSize, this.currentPage, assignments.length);
        this.setData(agents);
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
   * Load related chunks for all agents and convert them to ChunkData objects
   * @param agents - agents collection
   * @param assignments - agent assignment collection
   * @private
   */
  private async loadChunkData(agents: JAgent[], assignments: JAgentAssignment[]): Promise<void> {
    if (agents.length) {
      const chunkParams = new RequestParamBuilder().addFilter({
        field: 'agentId',
        operator: FilterType.IN,
        value: agents.map((agent) => agent.id)
      });

      const response: ResponseWrapper = await firstValueFrom(this.service.getAll(SERV.CHUNKS, chunkParams.create()));
      const responseBody = { data: response.data, included: response.included };
      const chunks = this.serializer.deserialize<JChunk[]>(responseBody);

      agents.forEach((agent: JAgent) => {
        agent.chunk = chunks.find((chunk) => chunk.agentId === agent.id);
        agent.assignmentId = assignments.find((assignment) => assignment.agentId === agent.id)?.id;
        if (agent.chunk) {
          agent.chunkId = agent.chunk.id;
        }
        agent.chunkData = this.convertChunks(agent.id, chunks, true);
      });
    }
  }
}
