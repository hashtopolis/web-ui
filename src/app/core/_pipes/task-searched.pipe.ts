import { firstValueFrom } from 'rxjs';

import { Pipe, PipeTransform } from '@angular/core';

import { FilterType, type RequestParams } from '@models/request-params.model';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';


/**
 * Returns search value over chunks
 * @param id - Task Id
 * @param keyspace - Keyspace
 **/

@Pipe({
  name: 'tdsearched',
  standalone: false
})
export class TaskSearchedPipe implements PipeTransform {
  constructor(private gs: GlobalService) {}

  transform(id: number, keyspace: number, type?: boolean): Promise<number> | null {
    if (!id) {
      return null;
    }

    const params: RequestParams = {
      filter: [{
        field: type ? 'agentId' : 'taskId',
        operator: FilterType.EQUAL,
        value: id
      }]
    };

    return firstValueFrom(this.gs.getAll(SERV.CHUNKS, params)).then((res) => {
      const ch: { checkpoint: number; skip: number }[] = res.values;

      return ch.reduce((a, i) => a + (i.checkpoint - i.skip), 0) / keyspace;
    });
  }
}
