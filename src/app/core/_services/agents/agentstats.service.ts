import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { setParameter } from '../buildparams';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentStatService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/agentstats';

  constructor(private http: HttpClient) { }

/**
 * Returns all the agent stats
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns Object
**/

  getAstats(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint, {params: queryParams})
  }

}
