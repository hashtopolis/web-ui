import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { setParameter } from '../buildparams';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { tap} from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class NotifService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/notifications';

  constructor(private http: HttpClient) { }

  getAllnotif(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint, {params: queryParams})
  }

  getNotif(id: number):Observable<any> {
    return this.http.get(`${this.endpoint}/${id}`)
  }

  createNotif(arr: any): Observable<any> {
    return this.http.post<any>(this.endpoint, arr)
  }

  deleteNotif(id: number):Observable<any> {
    return this.http.delete(this.endpoint +'/'+ id);
  }

}
