import { environment } from './../../../../environments/environment';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { setParameter } from '../buildparams';
import { Params } from '@angular/router';
import { tap} from 'rxjs/operators';
import { Observable } from 'rxjs';

import { CreateUser } from '../../_models/user.model';

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/users';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
    ) { }

  getAllusers(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint, {params: queryParams})
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }

  getUser(id: number):Observable<any> {
    return this.http.get(`${this.endpoint}/${id}`)
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }

  getCurrentUserID():Observable<any> {
    const user_id = isPlatformBrowser(this.platformId)
      ? JSON.parse(localStorage.getItem('userData'))._username //Change username for id
      : null;
    let queryParams: Params = {'filter': 'username='+user_id+''}; // Temporary until we get id
    return this.http.get(this.endpoint, {params: queryParams})
    .pipe(
      tap(data => console.log('All: ',JSON.stringify(data))),
    );
  }

  createUser(arr: any): Observable<any> {
    return this.http.post<any>(this.endpoint, arr)
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }

  updateUser(arr: any, id?: number): Observable<any> {
    return this.http.patch<number>(this.endpoint + '/' + id, arr)
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data)))
    );
  }

  deleteUser(id: number):Observable<any> {
    return this.http.delete(this.endpoint +'/'+ id);
  }

}
