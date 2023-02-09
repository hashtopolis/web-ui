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

  getAllPretasks(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint, {params: queryParams})
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }

  getPretask(id:number) {
    return this.http.get(this.endpoint +'/'+ id)
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }

  deletePretask(id:number):Observable<any> {
    return this.http.delete(this.endpoint +'/'+ id);
  }

  createPretask(arr: any): Observable<any> {
    return this.http.post<any>(this.endpoint, arr)
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }

  updatePretask(id: number, arr: any): Observable<any> {
    return this.http.patch<number>(this.endpoint + '/' + id, arr)
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }

}
