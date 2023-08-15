import {
  PipeTransform,
  Pipe
} from '@angular/core';

import { environment } from './../../../environments/environment';
import { GlobalService } from '../_services/main.service';
import { SERV } from '../../core/_services/main.config';
import { firstValueFrom } from 'rxjs';

/**
 * Returns cracked value iteration over chunks
 * @param id - Task Id
**/

@Pipe({
  name: 'tdcracked'
})
export class TaskCrackedPipe implements PipeTransform {

  constructor(
    private gs: GlobalService
  ) { }

  transform(id: number) {

    if (!id) {
      return null;
    }

    const maxResults = 10000;
    // const maxResults = environment.config.prodApiMaxResults;

    const searched = []

    return firstValueFrom(this.gs.getAll(SERV.CHUNKS,{'maxResults': maxResults, 'filter': 'taskId='+id+''}))
    .then((res) => {

    const ch = res.values;

    for(let i=0; i < ch.length; i++){
        searched.push(ch[i].cracked);
    }

    return searched?.reduce((a, i) => a + i,0);

  });
 }
}

