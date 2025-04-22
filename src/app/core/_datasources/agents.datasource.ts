/**
 * Contains data source for agents resource
 * @module
 */
import { catchError, finalize, forkJoin, of } from 'rxjs';

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
  private _assignAgents = false;

  setTaskId(taskId: number): void {
    this._taskId = taskId;
  }

  setAssignAgents(assign: boolean): void {
    this._assignAgents = assign;
  }

  loadAll(): void {
    this.loading = true;
    const agentParams = new RequestParamBuilder().addInitial(this).addInclude('accessGroups').create();
    const params = new RequestParamBuilder().setPageSize(this.maxResults).create();

    const agents$ = this.service.getAll(SERV.AGENTS, agentParams);
    const users$ = this.service.getAll(SERV.USERS, params);
    const agentAssign$ = this.service.getAll(SERV.AGENT_ASSIGN, params);
    const tasks$ = this.service.getAll(SERV.TASKS, params);
    const chunks$ = this.service.getAll(SERV.CHUNKS, params);

    const serializer = new JsonAPISerializer();

    forkJoin([agents$, users$, agentAssign$, tasks$, chunks$])
      .pipe(
        catchError(() => of([])),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        ([agentResponse, userResponse, assignmentResponse, taskResponse, chunkResponse]: [
          ResponseWrapper,
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
          const chunks = serializer.deserialize<JChunk[]>({
            data: chunkResponse.data,
            included: chunkResponse.included
          });

          agents.map((agent: JAgent) => {
            agent.user = users.find((user: JUser) => user.id === agent.userId);
            agent.taskId = assignments.find((assignment) => assignment.agentId === agent.id)?.taskId;
            if (agent.taskId) {
              agent.task = tasks.find((e) => e.id === agent.taskId);
              agent.taskName = agent.task.taskName;
              agent.chunk = chunks.find((chunk) => chunk.agentId === agent.id);
              if (agent.chunk) {
                agent.chunkId = agent.chunk.id;
              }
            }
            return agent;
          });

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
    const chunks$ = this.service.getAll(SERV.CHUNKS, params);
    const users$ = this.service.getAll(SERV.USERS, params);

    const serializer = new JsonAPISerializer();

    forkJoin([users$, agentAssign$, chunks$])
      .pipe(
        catchError(() => of([])),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        ([userResponse, assignmentResponse, chunkResponse]: [ResponseWrapper, ResponseWrapper, ResponseWrapper]) => {
          const users = serializer.deserialize<JUser[]>({
            data: userResponse.data,
            included: userResponse.included
          });
          const assignments = serializer.deserialize<JAgentAssignment[]>({
            data: assignmentResponse.data,
            included: assignmentResponse.included
          });
          const chunks = serializer.deserialize<JChunk[]>({
            data: chunkResponse.data,
            included: chunkResponse.included
          });
          const agents: JAgent[] = [];

          assignments.forEach((assignment) => {
            const task = assignment.task;
            const agent = assignment.agent;
            agent.task = task;
            agent.user = users.find((user) => user.id === agent.userId);
            agent.taskName = agent.task.taskName;
            agent.taskId = agent.task.id;
            agent.chunk = chunks.find((chunk) => chunk.agentId === agent.id);
            agent.assignmentId = assignments.find((e) => e.agentId === agent.id)?.id;
            if (agent.chunk) {
              agent.chunkId = agent.chunk.id;
            }
            agent.benchmark = assignment.benchmark;

            agents.push(agent);
          });

          this.setPaginationConfig(this.pageSize, this.currentPage, assignments.length);
          this.setData(agents);
        }
      );
  }

  reload(): void {
    this.clearSelection();
    if (this._taskId) {
      this.loadAssignments();
    } else {
      this.loadAll();
    }
  }
}
