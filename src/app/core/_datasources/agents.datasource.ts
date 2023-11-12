import { Chunk, ChunkData } from '../_models/chunk.model';
import { catchError, finalize, firstValueFrom, forkJoin, of } from 'rxjs';

import { Agent } from '../_models/agent.model';
import { BaseDataSource } from './base.datasource';
import { ListResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';
import { Task } from '../_models/task.model';
import { User } from '../_models/user.model';
import { environment } from 'src/environments/environment';

export class AgentsDataSource extends BaseDataSource<Agent> {
  loadAll(): void {
    this.loading = true;

    const agentParams = { maxResults: 999999, expand: 'accessGroups' };
    const params = { maxResults: 999999 };
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
          ListResponseWrapper<any>,
          ListResponseWrapper<Task>,
          ListResponseWrapper<Chunk>
        ]) => {
          const agents: Agent[] = a.values;
          const users: User[] = u.values;
          const assignments: any[] = aa.values;
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
              agent.chunkId = agent.chunk._id;
            }

            return agent;
          });

          this.setPaginationConfig(this.pageSize, this.currentPage, a.total);
          this.setData(agents);
        }
      );
  }

  async getChunkData(id: number): Promise<ChunkData> {
    const maxResults = environment.config.prodApiMaxResults;
    const chunktime = this.uiService.getUIsettings('chunktime').value;

    const dispatched: number[] = [];
    const searched: number[] = [];
    const cracked: number[] = [];
    const speed: number[] = [];
    const now = Date.now();

    const params = {
      maxResults: maxResults,
      filter: `agentId=${id}`
    };

    const response: ListResponseWrapper<Chunk> = await firstValueFrom(
      this.service.getAll(SERV.CHUNKS, params)
    );

    for (const chunk of response.values) {
      if (chunk.progress >= 10000) {
        dispatched.push(chunk.length);
      }
      cracked.push(chunk.cracked);
      searched.push(chunk.checkpoint - chunk.skip);
      if (
        now / 1000 - Math.max(chunk.solveTime, chunk.dispatchTime) <
          chunktime &&
        chunk.progress < 10000
      ) {
        speed.push(chunk.speed);
      }
    }

    return {
      dispatched: 0,
      searched: 0,
      cracked: cracked.reduce((a, i) => a + i, 0),
      speed: speed.reduce((a, i) => a + i, 0)
    };
  }

  reload(): void {
    this.reset();
    this.loadAll();
  }
}
