import { catchError, finalize, forkJoin, of } from 'rxjs';

import { Agent } from '../_models/agent.model';
import { BaseDataSource } from './base.datasource';
import { Chunk } from '../_models/chunk.model';
import { ListResponseWrapper } from '../_models/response.model';
import { SERV } from '../_services/main.config';

export class ChunksDataSource extends BaseDataSource<Chunk> {
  loadAll(): void {
    this.loadingSubject.next(true);

    const agentParams = { maxResults: 999999 };
    const chunkParams = { maxResults: 1000, expand: 'task' };
    const chunks$ = this.service.getAll(SERV.CHUNKS, chunkParams);
    const agents$ = this.service.getAll(SERV.AGENTS, agentParams);

    forkJoin([chunks$, agents$])
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(
        ([c, a]: [ListResponseWrapper<Chunk>, ListResponseWrapper<Agent>]) => {
          const assignedChunks: Chunk[] = c.values;

          assignedChunks.map((chunk: Chunk) => {
            console.log(chunk._id);
            chunk.agent = a.values.find((e: Agent) => e._id === chunk.agentId);
            if (chunk.agent) {
              chunk.agentName = chunk.agent.agentName;
            }
            if (chunk.task) {
              chunk.taskName = chunk.task.taskName;
            }

            return chunk;
          });

          this.setData(assignedChunks);
        }
      );
  }

  reload(): void {
    this.reset();
    this.loadAll();
  }
}
