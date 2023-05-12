import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { setParameter } from '../buildparams';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { map, Observable } from 'rxjs';
import { tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LogentryService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/logentries';

  constructor(private http: HttpClient) { }

/**
 * Get all Log entries
 * @param routerParams - to include multiple options such as Max number of results or filtering
 * @returns Object
**/
  getLogs(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = setParameter(routerParams);
    }
    return this.http.get(this.endpoint,{params: queryParams})
  }


}
