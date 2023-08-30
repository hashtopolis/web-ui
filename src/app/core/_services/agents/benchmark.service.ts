import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { setParameter } from '../buildparams';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BenchmarkService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/benchmarks';

  constructor(private http: HttpClient) { }

/**
 * Returns all the benchmarks
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns  Object
**/
  getAllbenchmarks(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint, {params: queryParams})
  }


/**
 * Deletes a benchmark
 * @param id - task id
 * @returns Object
**/
  deleteBenchmark(id:number):Observable<any> {
    return this.http.delete(this.endpoint +'/'+ id);
  }

}