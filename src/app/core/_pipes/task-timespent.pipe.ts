import { Pipe, PipeTransform } from '@angular/core';

import { environment } from '../../../environments/environment';
import { GlobalService } from '../_services/main.service';
import { SERV } from '../_services/main.config';
import { firstValueFrom } from 'rxjs';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { FilterType } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JsonAPISerializer } from '@services/api/serializer-service';
import { JChunk } from '@models/chunk.model';

/**
 * Calculates keyspace searched, Time spent and Estimated Time
 * @param id - Task Id or Agent Id
 * @param option - True Keyspace progress, False Timespent
 **/

@Pipe({
    name: 'ttimespent',
    standalone: false
})
export class TaskTimeSpentPipe implements PipeTransform {
  constructor(
    private gs: GlobalService,
    private serializer: JsonAPISerializer
  ) {}

  transform(id: number, option: boolean, type?: boolean) {
    if (!id) {
      return null;
    }

    const maxResults = 10000;
    // const maxResults = environment.config.prodApiMaxResults;
    const cprogress = []; // Keyspace searched
    const timespent = []; // TimeSpent
    const current = 0;
    let params: any;

    if (type) {
      params = new RequestParamBuilder()
        .addFilter({ field: 'agentId', operator: FilterType.EQUAL, value: id })
        .setPageSize(maxResults)
        .create();
    } else {
      params = new RequestParamBuilder()
        .addFilter({ field: 'taskId', operator: FilterType.EQUAL, value: id })
        .setPageSize(maxResults)
        .create();
    }

    return firstValueFrom(this.gs.getAll(SERV.CHUNKS, params)).then((response: ResponseWrapper) => {
      const responseBody = { data: response.data, included: response.included };
      const chunks = this.serializer.deserialize<JChunk[]>(responseBody);

      const ch = chunks;
      for (let i = 0; i < ch.length; i++) {
        cprogress.push(ch[i].checkpoint - ch[i].skip);
        if (ch[i].dispatchTime > current) {
          timespent.push(ch[i].solveTime - ch[i].dispatchTime);
        } else if (ch[i].solveTime > current) {
          timespent.push(ch[i].solveTime - current);
        }
      }
      return option ? cprogress.reduce((a, i) => a + i) : timespent.reduce((a, i) => a + i);
    });
  }
}
