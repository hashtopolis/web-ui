import { ChunkState, chunkStates } from '@src/app/core/_constants/chunks.config';
/**
 * Contains data source for agents resource
 * @module
 */
import { catchError, finalize, firstValueFrom, of } from 'rxjs';

import { BaseDataSource } from './base.datasource';
import { FilterType } from '@models/request-params.model';
import { IParamBuilder } from '@services/params/builder-types.service';
import { JAgent } from '../_models/agent.model';
import { JAgentAssignment } from '@models/agent-assignment.model';
import { JChunk } from '@models/chunk.model';
import { JUser } from '@models/user.model';
import { JsonAPISerializer } from '@services/api/serializer-service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { ResponseWrapper } from '@models/response.model';
import { SERV } from '@services/main.config';

export class AgentErrorDatasource extends BaseDataSource<JAgent> {
  private _taskId = 0;

  setTaskId(taskId: number): void {
    this._taskId = taskId;
  }
  loadAll(): void {
    this.loading = true;
    const agentParams = new RequestParamBuilder()
      .addInitial(this)
      .addInclude('agentErrors')
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
        console.log('AgentsDataSource: loadAll deserialized', agents);
        const length = response.meta.page.total_elements;

        this.setPaginationConfig(this.pageSize, length, this.pageAfter, this.pageBefore, this.index);
        this.setData(agents);
      });
  }
  reload(): void {
    this.clearSelection();
    if (this._taskId) {
      //this.loadAssignments();
    } else {
      this.loadAll();
    }
  }
}
