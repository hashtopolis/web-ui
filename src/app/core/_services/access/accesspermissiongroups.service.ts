import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { setParameter } from '../buildparams';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Params } from '@angular/router';

import { AccessGroup } from '../../_models/access-group';

@Injectable({
  providedIn: 'root'
})
export class AccessPermissionGroupsService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/globalpermissiongroups';

  constructor(private http: HttpClient) { }

/**
 * Returns all the access group permissions
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns  Object
**/
  getAccPGroups(routerParams?: Params): Observable<AccessGroup[]> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get<AccessGroup[]>(this.endpoint,{params: routerParams})
  }

/**
 * Returns all the access group permissions
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns  Object
**/
getAccPGroup(id: number, routerParams?: Params): Observable<AccessGroup[]> {
  let queryParams: Params = {};
  if (routerParams) {
      queryParams = setParameter(routerParams);
  }
  return this.http.get<AccessGroup[]>(`${this.endpoint}/${id}`,{params: routerParams})
}

/**
 * Delete by id
 * @param id - id
 * @returns  Object
**/
  deleteAccP(id: number):Observable<any> {
    return this.http.delete(this.endpoint +'/'+ id);
  }

/**
 * Create
 * @param item - fields
 * @returns  Object
**/
  createAccP(item: any): Observable<AccessGroup[]> {
    return this.http.post<any>(this.endpoint, item)
  }

/**
 * Update
 * @param item - fields
 * @returns  Object
**/
  updateAccP(id: number, arr: any): Observable<any> {
    return this.http.patch<number>(this.endpoint + '/' + id, arr)
  }

}

