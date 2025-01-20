import { ChunkDataNew } from '../_models/chunk.model';
import { catchError, finalize, forkJoin, of } from 'rxjs';

import { AgentData } from '../_models/agent.model';
import { AgentAssignmentData } from '../_models/agent-assignment.model';
import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { RequestParams } from '../_models/request-params.model';
import { SERV } from '../_services/main.config';
import { TaskData } from '../_models/task.model';
import { UserData } from '../_models/user.model';


export class AgentsDataSource extends BaseDataSource<AgentData> {
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
      include: 'accessGroups'
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
          ListResponseWrapper<AgentData>,
          ListResponseWrapper<UserData>,
          ListResponseWrapper<AgentAssignmentData>,
          ListResponseWrapper<TaskData>,
          ListResponseWrapper<ChunkDataNew>
        ]) => {
          const agents: AgentData[] = a.data;
          const users: UserData[] = u.data;
          const assignments: AgentAssignmentData[] = aa.data;
          const tasks: TaskData[] = t.data;
          const chunks: ChunkDataNew[] = c.data;

          agents.map((agent: AgentData) => {
            agent.attributes.user = users.find((e: UserData) => e.id === agent.attributes.userId);

            let accessGroupId:number = agent.relationships?.accessGroups?.data[0]?.id;
            agent.attributes.accessGroup = a.included.find((e) => e.type === "accessGroup" && e.id === accessGroupId)?.attributes.groupName;

            agent.attributes.taskId = assignments.find((e) => e.attributes.agentId === agent.id)?.attributes.taskId;
            if (agent.attributes.taskId) {
              agent.attributes.task = tasks.find((e) => e.id === agent.attributes.taskId);
              agent.attributes.taskName = agent.attributes.task.attributes.taskName;
              agent.attributes.chunk = chunks.find((e) => e.attributes.agentId === agent.id);
              if (agent.attributes.chunk) {
                agent.attributes.chunkId = agent.attributes.chunk.id;
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
          ListResponseWrapper<UserData>,
          ListResponseWrapper<AgentAssignmentData>,
          ListResponseWrapper<ChunkDataNew>
        ]) => {
          const users: UserData[] = u.values;
          const assignments: AgentAssignmentData[] = aa.values;
          const chunks: ChunkDataNew[] = c.values;
          const agents: AgentData[] = [];

          assignments.forEach((assignment: AgentAssignmentData) => {
            const task: TaskData = assignment.attributes.task;
            const agent: AgentData = assignment.attributes.agent;

            agent.attributes.task = task;
            agent.attributes.user = users.find((e: UserData) => e.id === agent.attributes.userId);
            agent.attributes.taskName = agent.attributes.task.attributes.taskName;
            agent.attributes.taskId = agent.attributes.task.id;
            agent.attributes.chunk = chunks.find((e) => e.attributes.agentId === agent.id);
            agent.attributes.assignmentId = assignments.find(
              (e) => e.attributes.agentId === agent.id
            )?.id;
            if (agent.attributes.chunk) {
              agent.attributes.chunkId = agent.attributes.chunk.id;
            }
            agent.attributes.benchmark = assignment.attributes.benchmark;

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
