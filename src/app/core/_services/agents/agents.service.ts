import { environment } from './../../../../environments/environment';
import { Observable, tap, retryWhen, delay, take } from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { setParameter } from '../buildparams';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

import { IPagedResults } from '../../_models/paged-results';
import { IAgents } from '../../_models/agents';

@Injectable({
  providedIn: 'root'
})
export class AgentsService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/agents';

  constructor(private http: HttpClient) { }

/**
 * Returns all the agents
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns  Object
**/
  getAgents(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint, {params: queryParams})
  }

/**
 * Returns an specific agent
 * @param id - agent id
 * @returns  Object
**/
  getAgent(id: number):Observable<any> {
    return this.http.get(`${this.endpoint}/${id}`)
  }

/**
 * Deletes an agent
 * @param id - agent id
 * @returns Object
**/
  deleteAgent(id: number): Observable<any> {
    return this.http.delete(this.endpoint +'/'+ id)
    .pipe(
      tap(data => console.log(JSON.stringify(data))),
      retryWhen(errors => {
          return errors
                  .pipe(
                    tap(() => console.log("Retrying...")),
                    delay(2000), // Add a delay before retry delete
                    take(3)  // Retry delete Agents
                  );
      } )
    );
  }

/**
 * Update agent information
 * @param id - agent id
 * @param arr - fields to be updated
 * @returns Object
**/
  updateAgent(id: number, arr: any): Observable<any> {
    return this.http.patch<number>(this.endpoint + '/' + id, arr)
  }

}
