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
import { JAgentErrors } from '../_models/agent-errors.model';
import { JChunk } from '@models/chunk.model';
import { JUser } from '@models/user.model';
import { JsonAPISerializer } from '@services/api/serializer-service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { ResponseWrapper } from '@models/response.model';
import { SERV } from '@services/main.config';

export class AgentErrorDatasource extends BaseDataSource<JAgentErrors> {
  private _agentId = 0;

  setAgentId(agentId: number): void {
    this._agentId = agentId;
  }
  loadAll(): void {
    this.loading = true;
    const agentParams = new RequestParamBuilder().addInitial(this).addInclude('task');
    if (this._agentId) {
      agentParams.addFilter({ field: 'agentId', operator: FilterType.EQUAL, value: this._agentId });
    }
    this.service
      .getAll(SERV.AGENT_ERRORS, agentParams.create())
      .pipe(
        catchError(() => of([])),
        finalize(() => (this.loading = false))
      )
      .subscribe(async (response: ResponseWrapper) => {
        const serializer = new JsonAPISerializer();
        const responseBody = { data: response.data, included: response.included };
        const agents = serializer.deserialize<JAgentErrors[]>({
          data: responseBody.data,
          included: responseBody.included
        });
        const length = response.meta.page.total_elements;

        this.setPaginationConfig(this.pageSize, length, this.pageAfter, this.pageBefore, this.index);
        this.setData(agents);
      });
  }
  reload(): void {
    this.clearSelection();
    this.loadAll();
  }
}
