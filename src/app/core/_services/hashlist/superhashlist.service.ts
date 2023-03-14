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

  getAllsuperhashlists(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint, {params: queryParams})
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }

  getSuperhashlist(id:number):Observable<any> {
    return this.http.get(this.endpoint +'/'+ id)
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }

  deleteSuperhashlist(id:number):Observable<any> {
    return this.http.delete(this.endpoint +'/'+ id);
  }

  createSuperhashlist(arr: any): Observable<any> {
    return this.http.post<any>(this.endpoint, arr)
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }

  updateSuperhashlist(id: number, arr: any): Observable<any> {
    return this.http.patch<number>(this.endpoint + '/' + id, arr)
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }

}

