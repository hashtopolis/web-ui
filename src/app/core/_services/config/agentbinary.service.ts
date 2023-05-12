import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { setParameter } from '../buildparams';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { tap} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgentBinService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/agentbinaries';

  constructor(private http: HttpClient) { }

/**
 * Get all the Agent Binaries
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns Object
**/
  getAgentBins(routerParams?: Params):Observable<any> {
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
  getAgentBin(id: number):Observable<any> {
    return this.http.get(`${this.endpoint}/${id}`)
  }

/**
 * Delete Agent Binary
 * @param id - Agent binary id
 * @returns Object
**/
  deleteAgentBin(id: number):Observable<any> {
    return this.http.delete(this.endpoint + '/' + id);
  }

/**
 * Create Agent Binary
 * @param arr - variables
 * @returns Object
**/
  createAgentBin(arr: any):Observable<any> {
    return this.http.post(this.endpoint, arr);
  }

/**
 * Update Agent Binary
 * @param id -  id
 * @param arr - fields to be updated
 * @returns Object
**/
  updateAgentBin(id: number, arr: any): Observable<any> {
    return this.http.patch<number>(this.endpoint + '/' + id, arr)
  }

}
