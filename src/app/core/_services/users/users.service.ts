import { environment } from './../../../../environments/environment';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { setParameter } from '../buildparams';

import { Params } from '@angular/router';
import { tap} from 'rxjs/operators';
import { Observable } from 'rxjs';

import { CreateUser } from '../../_models/user.model';
import { AuthService } from '../access/auth.service';

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/users';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private as:AuthService,
    ) { }

/**
 * Get logged user id
 * @returns  id
**/

  get userId(){
    return this.as.userId;
  }

/**
 * Returns all the users
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns  Object
**/
  getAllusers(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint, {params: queryParams})
  }

/**
 * Returns user information
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns  Object
**/
  getUser(id: number,  routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(`${this.endpoint}/${id}`,{params: routerParams})
  }

/**
 * Create
 * @param item - fields
 * @returns  Object
**/
  createUser(arr: any): Observable<any> {
    return this.http.post<any>(this.endpoint, arr)
  }

/**
 * Update
 * @param item - fields
 * @returns  Object
**/
  updateUser(arr: any, id?: number): Observable<any> {
    return this.http.patch<number>(this.endpoint + '/' + id, arr.updateData)
  }

/**
 * Delete by id
 * @param id - id
 * @returns  Object
**/
  deleteUser(id: number):Observable<any> {
    return this.http.delete(this.endpoint +'/'+ id);
  }

}
