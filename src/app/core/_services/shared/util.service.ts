import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SERV } from '../main.config';
import { Observable, firstValueFrom, from, map } from 'rxjs';
import { UIConfigService } from './storage.service';
import { GlobalService } from '../main.service';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor(
    private uiService: UIConfigService,
    private gs: GlobalService
  ) {}

  calculateSpeed(id: number, type?: boolean): Observable<number> {
    const maxResults = environment.config.prodApiMaxResults;
    const chunktime = this.uiService.getUIsettings('chunktime').value;
    const cspeed = [];
    let params: any;
    let currenspeed: any;

    if (type) {
      params = { maxResults: maxResults, filter: 'agentId=' + id + '' };
    } else {
      params = { maxResults: maxResults, filter: 'taskId=' + id + '' };
    }

    return from(firstValueFrom(this.gs.getAll(SERV.CHUNKS, params))).pipe(
      map((res) => {
        for (let i = 0; i < res.data.length; i++) {
          if (
            Date.now() / 1000 -
              Math.max(res.data[i].attributes.solveTime, res.data[i].attributes.dispatchTime) <
              chunktime &&
            res.data[i].attributes.progress < 10000
          ) {
            cspeed.push(res.data[i].attributes.speed);
          }
        }

        currenspeed = cspeed.reduce((a, i) => a + i, 0);

        return currenspeed > 0 ? currenspeed : 0;
      })
    );
  }
}
