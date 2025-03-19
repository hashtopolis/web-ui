import { ChunkDataNew } from '../_models/chunk.model';
import { catchError, finalize, firstValueFrom, forkJoin, of } from 'rxjs';

import { AgentData } from '../_models/agent.model';
import { AgentAssignmentData } from '../_models/agent-assignment.model';
import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';
import { TaskData } from '../_models/task.model';
import { UserData } from '../_models/user.model';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class AgentsStatusDataSource extends BaseDataSource<AgentData> {
  loadAll(): void {
    this.loading = true;
    const agentParams = new RequestParamBuilder().addInitial(this).addInclude('accessGroups').addInclude('agentstats').create();
    const params = new RequestParamBuilder().setPageSize(this.maxResults).create();

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

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
