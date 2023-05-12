import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { setParameter } from '../buildparams';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { BaseChunk } from '../../_models/chunk';

@Injectable({
  providedIn: 'root'
})
export class ChunkService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/chunks';

  constructor(private http: HttpClient) { }

/**
 * Returns all the Chunks
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns  Object
**/
  getChunks(routerParams?: Params): Observable<BaseChunk[]> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get<BaseChunk[]>(this.endpoint,{params: routerParams})
  }

/**
 * Returns chunk by id
 * @param id - id
 * @returns  Object
**/
  getChunk(id: number):Observable<any> {
    return this.http.get(`${this.endpoint}/${id}`)
  }

/**
 * Update chunk
 * @param id - to include multiple options such as Max number of results or filtering
 * @param arr - fields to update
 * @returns  Object
**/
  updateChunk(id:number, arr: any): Observable<any> {
    console.log(arr);
    return this.http.patch<number>(this.endpoint + '/' + id, arr)
  }

}

