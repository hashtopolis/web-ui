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
  updateHashType(hash: any): Observable<any> {
    console.log(hash);
    return this.http.patch<number>(this.endpoint + '/' + hash.hashTypeId, {description: hash.description, isSalted:hash.isSalted, isSlowHash: hash.isSlowHash})
  }

}

