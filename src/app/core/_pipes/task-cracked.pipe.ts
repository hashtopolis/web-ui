import { firstValueFrom } from 'rxjs';

import { Pipe, PipeTransform } from '@angular/core';

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

  transform(id: number, type?: boolean) {
    if (!id) {
      return null;
    }

    const maxResults = 10000;
    // const maxResults = environment.config.prodApiMaxResults;
    const searched: number[] = [];
    let params: any;

    if (type) {
      params = { maxResults: maxResults, filter: 'agentId=' + id + '' };
    } else {
      params = { maxResults: maxResults, filter: 'taskId=' + id + '' };
    }

    return firstValueFrom(this.gs.getAll(SERV.CHUNKS, params)).then((res) => {
      const ch = res.values;

      for (let i = 0; i < ch.length; i++) {
        searched.push(ch[i].cracked);
      }

      return searched?.reduce((a, i) => a + i, 0);
    });
  }
}
