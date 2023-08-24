import {
  PipeTransform,
  Pipe
} from '@angular/core';

import { environment } from '../../../environments/environment';
import { GlobalService } from '../_services/main.service';
import { SERV } from '../_services/main.config';
import { firstValueFrom } from 'rxjs';

/**
 * Calculates keyspace searched, Time spent and Estimated Time
 * @param id - Task Id or Agent Id
 * @param option - True Keyspace progress, False Timespent
**/

@Pipe({
  name: 'ttimespent'
})
export class TaskTimeSpentPipe implements PipeTransform {

  constructor(
    private gs: GlobalService
  ) { }

  transform(id: number, option: boolean, type?:boolean) {

    if (!id) {
      return null;
    }

    const maxResults = 10000;
    // const maxResults = environment.config.prodApiMaxResults;
    const cprogress = []; // Keyspace searched
    const timespent = []; // TimeSpent
    const current = 0;
    let params: any;

    if(type){
      params = {'maxResults': maxResults, 'filter': 'agentId='+id+''};
    }else{
      params = {'maxResults': maxResults, 'filter': 'taskId='+id+''};
    }

    return firstValueFrom(this.gs.getAll(SERV.CHUNKS,params))
    .then((res) => {

      const ch = res.values;
      for(let i=0; i < ch.length; i++){
        cprogress.push(ch[i].checkpoint - ch[i].skip);
        if(ch[i].dispatchTime > current){
          timespent.push(ch[i].solveTime - ch[i].dispatchTime);
        } else if (ch[i].solveTime > current) {
          timespent.push(ch[i].solveTime- current);
        }
      }
      return option ? cprogress.reduce((a, i) => a + i):timespent.reduce((a, i) => a + i)
    });
  }

}

