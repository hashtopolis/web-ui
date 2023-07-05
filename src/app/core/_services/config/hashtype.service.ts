import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Hashtype } from '../../_models/hashtype';
import { setParameter } from '../buildparams';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HashtypeService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/hashtypes';

  constructor(private http: HttpClient) { }

/**
 * Get all HashTypes
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns Object
**/
  getHashTypes(routerParams?: Params): Observable<Hashtype[]> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get<Hashtype[]>(this.endpoint,{params: queryParams})
  }

/**
 * Returns an specific hashtype
 * @param id - agent id
 * @returns  Object
**/
  getHashtype(id: number):Observable<any> {
    return this.http.get(`${this.endpoint}/${id}`)
  }

/**
 * Deletes hashtype by id
 * @param id - id
 * @returns Object
**/
  deleteHashType(id: number):Observable<any> {
    return this.http.delete(this.endpoint +'/'+ id);
  }

/**
 * Create new hashtype
 * @param id - id
 * @returns Object
**/
  createHashType(arr: any): Observable<Hashtype[]> {
    return this.http.post<any>(this.endpoint, arr)
  }

/**
 * Update
 * @param arr - fields to be updated
 * @returns Object
**/
  updateHashType(id:number, arr: any): Observable<any> {
    return this.http.patch<number>(this.endpoint + '/' + id, {description: arr.description, isSalted:arr.isSalted, isSlowHash: arr.isSlowHash})
  }

}

