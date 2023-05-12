import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { setParameter } from '../buildparams';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { tap} from 'rxjs/operators';
import { Observable } from 'rxjs';

import { HealthCheck, HealthCheckedAgents } from '../../_models/healthcheck';

@Injectable({
  providedIn: 'root'
})
export class HealthcheckService {

  private endpoint = environment.config.prodApiEndpoint;

  constructor(private http: HttpClient) { }

/**
 * Get all Health Checks
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns Object
**/
  getHealthChecks(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint + '/ui/healthchecks', {params: queryParams})
  }

/**
 * Get individial Health check by id
 * @param id - Health check id
 * @returns Object
**/
  getHealthCheck(id: number):Observable<any> {
    return this.http.get(`${this.endpoint + '/ui/healthchecks'}/${id}`)
  }
/**
 * Delete individial Health check by id
 * @param id - Health check id
 * @returns Object
**/
deleteHealthCheck(id: number):Observable<any> {
  return this.http.delete(this.endpoint + '/ui/healthchecks' +'/'+ id);
}

/**
* Create individial Health check
* @param arr - Fields
* @returns Object
* FIXME
**/
createHealthCheck(arr: any): Observable<HealthCheck[]> {
  return this.http.post<any>(this.endpoint + '/ui/healthchecks', arr)
}

/**
 * Get all Health Checks
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns Object
**/
   getHealthCheckedAgents(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint + '/ui/healthcheckagents', {params: queryParams})
  }

/**
 * Get healtch check Agent
 * @param id - Health check id
 * @returns Object
**/
  getHealthCheckedAgent(id: number):Observable<any> {
    return this.http.get(`${this.endpoint + '/ui/healthcheckagents'}/${id}`)
  }



}
