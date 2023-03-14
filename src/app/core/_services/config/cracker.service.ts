import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { setParameter } from '../buildparams';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrackerService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/crackers';
  private endpoint_types = environment.config.prodApiEndpoint + '/ui/crackertypes';

  constructor(private http: HttpClient) { }

/**
 * Get all Cracker Binaries
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns Object
**/
  getCrackerBinaries(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint, {params: queryParams})
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }

/**
 * Get individual cracker binary
 * @param id - id number
 * @returns Object
**/
  getCrackerBinary(id:number):Observable<any> {
    return this.http.get(this.endpoint +'/'+ id)
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }

/**
 * Create cracker binary
 * @param id - id number
 * @param arr - fields
 * @returns Object
**/
  createCrackerBinary(id:number, arr: any): Observable<any> {
    return this.http.post<any>(this.endpoint, arr)
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }

/**
 * Delete
 * @param id - id number
 * @returns Object
**/
  deleteCrackerBinary(id:number):Observable<any> {
    return this.http.delete(this.endpoint +'/'+ id);
  }

/**
 * Update cracker
 * @param id - id number
 * @param arr - fields to update
 * @returns Object
**/
  updateCrackerBinary(id: number, arr: any): Observable<any> {
    return this.http.patch<number>(this.endpoint + '/' + id, arr)
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }

/**
 * Get cracker type
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns Object
**/
  getCrackerType(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint_types, {params: queryParams})
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }

/**
 * Delete cracker type
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns Object
**/
  deleteCrackerType(id:number):Observable<any> {
    return this.http.delete(this.endpoint_types +'/'+ id);
  }

}
