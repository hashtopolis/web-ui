import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { setParameter } from '../buildparams';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { BaseHashlist} from '../../_models/hashlist';

@Injectable({
  providedIn: 'root'
})
export class SuperHashlistService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/superhashlist';

  constructor(private http: HttpClient) { }

/**
 * Returns all the superhashlists
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns  Object
**/
  getAllsuperhashlists(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint, {params: queryParams})
  }

/**
 * Get superhashlist by id
 * @param id - id
 * @returns  Object
**/
  getSuperhashlist(id:number):Observable<any> {
    return this.http.get(this.endpoint +'/'+ id)
  }

/**
 * Delete by id
 * @param id - id
 * @returns  Object
**/
  deleteSuperhashlist(id:number):Observable<any> {
    return this.http.delete(this.endpoint +'/'+ id);
  }

/**
 * Create
 * @param item - fields
 * @returns  Object
**/
  createSuperhashlist(arr: any): Observable<any> {
    return this.http.post<any>(this.endpoint, arr)
  }

/**
 * Update
 * @param item - fields
 * @returns  Object
**/
  updateSuperhashlist(id: number, arr: any): Observable<any> {
    return this.http.patch<number>(this.endpoint + '/' + id, arr)
  }

}

