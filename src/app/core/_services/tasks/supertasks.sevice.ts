import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { setParameter } from '../buildparams';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuperTasksService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/supertasks';

  constructor(private http: HttpClient) { }

/**
 * Get all Supertasks
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns Object
**/
  getAllsupertasks(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint, {params: queryParams})
  }

/**
 * Get supertask by id
 * @param id - id
 * @returns Object
**/
  getSupertask(id:number):Observable<any> {
    return this.http.get(this.endpoint +'/'+ id)
  }

/**
 * Delete supertask
 * @param id - id
 * @returns Object
**/
  deleteSupertask(id:number):Observable<any> {
    return this.http.delete(this.endpoint +'/'+ id);
  }

/**
 * Create new supertask
 * @param arr - fields
 * @returns Object
**/
  createSupertask(arr: any): Observable<any> {
    return this.http.post<any>(this.endpoint, arr)
  }

/**
 * Update supertask
 * @param id - id
 * @param arr - fields to update
 * @returns Object
**/
  updateSupertask(id: number, arr: any): Observable<any> {
    return this.http.patch<number>(this.endpoint + '/' + id, arr)
  }

}
