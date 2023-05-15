import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, tap } from 'rxjs';
import { setParameter } from '../buildparams';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

import { Pretask } from '../../_models/pretask';

@Injectable({
  providedIn: 'root'
})
export class PreTasksService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/pretasks';
  startedEditing = new Subject<number>();

  constructor(private http: HttpClient) { }

/**
 * Returns all the pretasks
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns  Object
**/
  getAllPretasks(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint, {params: queryParams})
  }

/**
 * Get Pretask by id
 * @param id - id
 * @returns  Object
**/
  getPretask(id:number) {
    return this.http.get(this.endpoint +'/'+ id)
  }

/**
 * Delete by id
 * @param id - id
 * @returns  Object
**/
  deletePretask(id:number):Observable<any> {
    return this.http.delete(this.endpoint +'/'+ id);
  }

/**
 * Create
 * @param item - fields
 * @returns  Object
**/
  createPretask(arr: any): Observable<any> {
    return this.http.post<any>(this.endpoint, arr)
  }

/**
 * Update
 * @param item - fields
 * @returns  Object
**/
  updatePretask(id: number, arr: any): Observable<any> {
    return this.http.patch<number>(this.endpoint + '/' + id, arr)
  }

}
