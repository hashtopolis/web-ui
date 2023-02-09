import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, tap} from 'rxjs/operators';
import { environment } from './../../../../environments/environment';
import { map, Observable, throwError } from 'rxjs';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AgentBinService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/agentbinaries';

  constructor(private http: HttpClient) { }

  getAgentBin(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = this.setParameter(routerParams);
    }
    return this.http.get(this.endpoint)
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteAgentBin(id: number):Observable<any> {
    return this.http.delete(this.endpoint + '/' + id)
    .pipe(
      catchError(this.handleError)
    );
  }

  createAgentBin(arr: string):Observable<any> {
    return this.http.post(this.endpoint, arr)
    .pipe(
      catchError(this.handleError)
    );
  }

  private handleError ( err : HttpErrorResponse ) {
    if (err.error instanceof ErrorEvent){
      console.log('Client Side Error: ', err.error.message);
    }else{
      console.log('Server Side Error: ', err);
    }
    return throwError(() => err);
  }

  private setParameter(routerParams: Params): HttpParams {
    let queryParams = new HttpParams();
    for (const key in routerParams) {
        if (routerParams.hasOwnProperty(key)) {
            queryParams = queryParams.set(key, routerParams[key]);
        }
    }
    return queryParams;
  }




}
