import { catchError, finalize, forkJoin, of } from 'rxjs';

import { BaseDataSource } from '@src/app/core/_datasources/base.datasource';
import { JAgentAssignment } from '@src/app/core/_models/agent-assignment.model';
import { JAgent } from '@src/app/core/_models/agent.model';
import { JChunk } from '@src/app/core/_models/chunk.model';
import { ResponseWrapper } from '@src/app/core/_models/response.model';
import { JTask } from '@src/app/core/_models/task.model';
import { JUser } from '@src/app/core/_models/user.model';
import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';
import { SERV } from '@src/app/core/_services/main.config';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';

export class AgentsStatusDataSource extends BaseDataSource<JAgent> {
  private chunktime = this.uiService.getUIsettings('chunktime').value;

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

  loadAll(): void {
    this.loading = true;
    const agentParams = new RequestParamBuilder()
      .addInitial(this)
      .addInclude('accessGroups')
      .addInclude('agentStats')
      .create();
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
        async ([agentResponse, userResponse, assignmentResponse, taskResponse, chunkResponse]: [
          ResponseWrapper,
          ResponseWrapper,
          ResponseWrapper,
          ResponseWrapper,
          ResponseWrapper
        ]) => {
          const agents: JAgent[] = serializer.deserialize({
            data: agentResponse.data,
            included: agentResponse.included
          });
          const users: JUser[] = serializer.deserialize({ data: userResponse.data, included: userResponse.included });
          const assignments: JAgentAssignment[] = serializer.deserialize({
            data: assignmentResponse.data,
            included: assignmentResponse.included
          });
          const tasks: JTask[] = serializer.deserialize({ data: taskResponse.data, included: taskResponse.included });
          const chunks: JChunk[] = serializer.deserialize({
            data: chunkResponse.data,
            included: chunkResponse.included
          });

          agents.map((agent: JAgent) => {
            agent.user = users.find((user: JUser) => user.id === agent.userId);

            agent.taskId = assignments.find((assignment) => assignment.agentId === agent.id)?.taskId;
            if (agent.taskId) {
              agent.task = tasks.find((task) => task.id === agent.taskId);
              agent.taskName = agent.task.taskName;
              agent.chunk = chunks.find((chunk) => chunk.agentId === agent.id);
              if (agent.chunk) {
                agent.chunkId = agent.chunk.id;
                agent.agentSpeed = this.getAgentSpeed(agent, chunks);
              }
            }

            return agent;
          });

          this.setPaginationConfig(this.pageSize, this.currentPage, agents.length);
          this.setData(agents);
        }
      );
  }

  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
