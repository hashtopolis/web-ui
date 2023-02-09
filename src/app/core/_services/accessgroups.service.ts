import { environment } from './../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { setParameter } from './buildparams';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { AccessGroup } from '../_models/access-group';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccessGroupsService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/accessgroups';

  constructor(private http: HttpClient) { }

  getAccessGroups(routerParams?: Params): Observable<AccessGroup[]> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get<AccessGroup[]>(this.endpoint,{params: routerParams})
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }

  deleteAccessGroups(id: number):Observable<any> {
    return this.http.delete(this.endpoint +'/'+ id);
  }

  createAccessGroups(item: any): Observable<AccessGroup[]> {
    return this.http.post<any>(this.endpoint, item)
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }

  updateAccessGroups(item: any): Observable<any> {
    return this.http.patch<number>(this.endpoint + '/' + item.accessGroupId, {groupName: item.groupName})
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }

}

