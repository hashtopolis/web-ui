import { Chunk, ChunkData } from '../_models/chunk.model';
import { catchError, finalize, forkJoin, of } from 'rxjs';

import { Agent } from '../_models/agent.model';
import { AgentAssignment } from '../_models/agent-assignment.model';
import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';
import { Task } from '../_models/task.model';
import { User } from '../_models/user.model';

export class AgentsDataSource extends BaseDataSource<Agent> {
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

    const startAt = this.currentPage * this.pageSize;
    const sorting = this.sortingColumn;

    const agentParams: RequestParams = {
      maxResults: this.pageSize,
      startsAt: startAt,
      expand: 'accessGroups'
    };

    if (sorting.dataKey && sorting.isSortable) {
      const order = this.buildSortingParams(sorting);
      agentParams.ordering = order;
    }

    const params = { maxResults: this.maxResults };
    const agents$ = this.service.getAll(SERV.AGENTS, agentParams);
    const users$ = this.service.getAll(SERV.USERS, params);
    const agentAssign$ = this.service.getAll(SERV.AGENT_ASSIGN, params);
    const tasks$ = this.service.getAll(SERV.TASKS, params);
    const chunks$ = this.service.getAll(SERV.CHUNKS, params);

    forkJoin([agents$, users$, agentAssign$, tasks$, chunks$])
      .pipe(
        catchError(() => of([])),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        ([a, u, aa, t, c]: [
          ListResponseWrapper<Agent>,
          ListResponseWrapper<User>,
          ListResponseWrapper<AgentAssignment>,
          ListResponseWrapper<Task>,
          ListResponseWrapper<Chunk>
        ]) => {
          const agents: Agent[] = a.values;
          const users: User[] = u.values;
          const assignments: AgentAssignment[] = aa.values;
          const tasks: Task[] = t.values;
          const chunks: Chunk[] = c.values;

          agents.map((agent: Agent) => {
            agent.user = users.find((e: User) => e._id === agent.userId);
            agent.taskId = assignments.find((e) => e.agentId === agent._id)
              ?.taskId;
            if (agent.taskId) {
              agent.task = tasks.find((e) => e._id === agent.taskId);
              agent.taskName = agent.task.taskName;
              agent.chunk = chunks.find((e) => e.agentId === agent.agentId);
              if (agent.chunk) {
                agent.chunkId = agent.chunk._id;
              }
            }

            return agent;
          });

          this.setPaginationConfig(this.pageSize, this.currentPage, a.total);
          this.setData(agents);
        }
      );
  }

  loadAssignments(): void {
    this.loading = true;

    const params = { maxResults: this.maxResults };
    const startAt = this.currentPage * this.pageSize;
    const assignParams = {
      maxResults: this.pageSize,
      startsAt: startAt,
      expand: 'agent,task',
      filter: `taskId=${this._taskId}`
    };

    const agentAssign$ = this.service.getAll(SERV.AGENT_ASSIGN, assignParams);
    const chunks$ = this.service.getAll(SERV.CHUNKS, params);
    const users$ = this.service.getAll(SERV.USERS, params);

    forkJoin([users$, agentAssign$, chunks$])
      .pipe(
        catchError(() => of([])),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        ([u, aa, c]: [
          ListResponseWrapper<User>,
          ListResponseWrapper<AgentAssignment>,
          ListResponseWrapper<Chunk>
        ]) => {
          const users: User[] = u.values;
          const assignments: AgentAssignment[] = aa.values;
          const chunks: Chunk[] = c.values;
          const agents: Agent[] = [];

          assignments.forEach((assignment: AgentAssignment) => {
            const task: Task = assignment.task;
            const agent: Agent = assignment.agent;

            agent.task = task;
            agent.user = users.find((e: User) => e._id === agent.userId);
            agent.taskName = agent.task.taskName;
            agent.taskId = agent.task._id;
            agent.chunk = chunks.find((e) => e.agentId === agent.agentId);
            agent.assignmentId = assignments.find(
              (e) => e.agentId === agent._id
            )?.assignmentId;
            if (agent.chunk) {
              agent.chunkId = agent.chunk._id;
            }
            agent.benchmark = assignment.benchmark;

            agents.push(agent);
          });

          this.setPaginationConfig(this.pageSize, this.currentPage, aa.total);
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
