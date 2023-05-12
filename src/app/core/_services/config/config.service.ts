import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { debounceTime, tap} from 'rxjs/operators';
import { setParameter } from '../buildparams';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/configs';

  constructor(private http: HttpClient) { }

/**
 * Get all Configuration
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns Object
**/
  getAllconfig(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint, {params: queryParams})
  }

/**
 * Update Configuration fields
 * @param id - config id number
 * @param arr - field to update
 * @returns Object
**/
  updateConfig(id: number, arr: any): Observable<any> {
    return this.http.patch<number>(this.endpoint + '/' + id, arr)
    .pipe(
      debounceTime(2000)
    );
  }

}
