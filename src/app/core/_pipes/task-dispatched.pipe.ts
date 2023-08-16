import {
  PipeTransform,
  Pipe
} from '@angular/core';

import { environment } from './../../../environments/environment';
import { GlobalService } from '../_services/main.service';
import { SERV } from '../../core/_services/main.config';
import { firstValueFrom } from 'rxjs';

/**
 * Returns dispatched
 * @param id - Task Id
 * @param keyspace - Keyspace
**/

@Pipe({
  name: 'tdispatched'
})
export class TaskDispatchedPipe implements PipeTransform {

  constructor(
    private gs: GlobalService
  ) { }

  transform(id: number, keyspace: number) {

    if (!id) {
      return null;
    }

    const maxResults = 10000;
    // const maxResults = environment.config.prodApiMaxResults;

    const dispatched = [];

    return firstValueFrom(this.gs.getAll(SERV.CHUNKS,{'maxResults': maxResults, 'filter': 'taskId='+id+''}))
    .then((res) => {
      const ch = res.values;
      for(let i=0; i < ch.length; i++){
        if(ch[i].progress >= 10000){
          dispatched.push(ch[i]['length']);
        }else{
          dispatched.push(ch[i]['length']);
        }
      }
      return dispatched?.reduce((a, i) => a + i,0)/keyspace;
    });
  }

}

