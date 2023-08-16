import {
  PipeTransform,
  Pipe
} from '@angular/core';

import { UIConfigService } from '../_services/shared/storage.service';
import { environment } from './../../../environments/environment';
import { GlobalService } from '../_services/main.service';
import { SERV } from '../../core/_services/main.config';
import { firstValueFrom } from 'rxjs';

/**
 * This function calculates the agent current speed
 * @param id - Task Id
 * Usage:
 *   object | aspeed:'id'
 * Example:
 *   {{ number | aspeed:'1' }}
 * @returns number
**/

@Pipe({
  name: 'aspeed'
})
export class AgentsSpeedPipe implements PipeTransform {

  constructor(
    private uiService:UIConfigService,
    private gs: GlobalService
  ) { }

  currenspeed = 0;
  isactive = false;

  transform(id: number ){

      // const maxResults = environment.config.prodApiMaxResults;
      const maxResults = 60000;
      const chunktime = this.uiService.getUIsettings('chunktime').value;
      const cspeed = [];

      let currenspeed: any;

      return firstValueFrom(this.gs.getAll(SERV.CHUNKS,{'maxResults': maxResults, 'filter': 'taskId='+id+''}))
        .then((res) => {
        for(let i=0; i < res.values.length; i++){
          if(Date.now()/1000 - Math.max(res.values[i].solveTime, res.values[i].dispatchTime) < chunktime && res.values[i].progress < 10000){
            cspeed.push(res.values[i].speed);
          }
        }
        currenspeed = cspeed.reduce((a, i) => a + i, 0);
        if(currenspeed > 0){
          return currenspeed;
        }else{
          return 0;
        }
      });
    }
}
