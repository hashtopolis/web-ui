import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { Params } from '@angular/router';
import { Observable, tap, catchError, throwError, retryWhen, shareReplay, timer, delayWhen, retry, debounce, delay, take } from 'rxjs';

import { IPagedResults } from '../../_models/paged-results';
import { IAgents } from '../../_models/agents';

@Injectable({
  providedIn: 'root'
})
export class AgentsService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/agents';

  constructor(private http: HttpClient) { }

  getAgents(routerParams?: Params):Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
        queryParams = this.setParameter(routerParams);
    }
    return this.http.get(this.endpoint, {params: queryParams})
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getAgent(id: number):Observable<any> {
    return this.http.get(`${this.endpoint}/${id}`)
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteAgent(id: number): Observable<any> {
    return this.http.delete(this.endpoint +'/'+ id)
    .pipe(
      tap(data => console.log(JSON.stringify(data))),
      catchError(this.handleError),
      retryWhen(errors => {
          return errors
                  .pipe(
                    tap(() => console.log("Retrying...")),
                    delay(2000), // Add a delay before retry delete
                    take(3)  // Retry delete Agents
                  );
      } )
    );
  }

  updateAgent(id: number, arr: any): Observable<any> {
    return this.http.patch<number>(this.endpoint + '/' + id, arr)
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data))),
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
