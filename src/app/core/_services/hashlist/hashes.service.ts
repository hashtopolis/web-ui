import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { setParameter } from '../buildparams';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

import { BaseHashlist } from '../../_models/hashlist';

@Injectable({
  providedIn: 'root'
})
export class HashesService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/hashes';

  constructor(private http: HttpClient) { }

/**
 * Get all the hashes
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns Object
**/
  getAllhashes(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint, {params: queryParams})
  }

/**
 * Get individial hash
 * @param id - hash id
 * @returns Object
**/
  getHash(id: number):Observable<any> {
    return this.http.get(`${this.endpoint}/${id}`)
  }

}
