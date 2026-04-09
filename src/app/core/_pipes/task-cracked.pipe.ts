import { firstValueFrom } from 'rxjs';

import { Pipe, PipeTransform } from '@angular/core';

import { FilterType, type RequestParams } from '@models/request-params.model';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';


/**
 * Returns cracks when iterating over the chunks filtering by id
 * @param id - Task Id or agent Id
 * @param type - True check speed for Agent False for Task
 * Usage:
 *   object | tdcracked:true
 * Example:
 *   {{ number | tdcracked:'1' }}
 * @returns number
 **/

@Pipe({
  name: 'tdcracked',
  standalone: false
})
export class TaskCrackedPipe implements PipeTransform {
  constructor(private gs: GlobalService) {}

  transform(id: number, type?: boolean): Promise<number> | null {
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
      const ch: { cracked: number }[] = res.values;

      return ch.reduce((a, i) => a + i.cracked, 0);
    });
  }
}
