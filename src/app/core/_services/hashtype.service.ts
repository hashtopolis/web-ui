import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Observable, tap, catchError, throwError } from 'rxjs';

import { Hashtype } from '../_models/hashtype';

@Injectable({
  providedIn: 'root'
})
export class HashtypeService {

  private endpoint = environment.config.prodApiEndpoint + '/ui/hashtypes';

  constructor(private http: HttpClient) { }

  private handleError ( err : HttpErrorResponse ) {
    if (err.error instanceof ErrorEvent){
      console.log('Client Side Error: ', err.error.message);
    }else{
      console.log('Server Side Error: ', err);
    }
    return throwError(() => err);
  }

  getHashTypes(): Observable<Hashtype[]> {
    return this.http.get<Hashtype[]>(this.endpoint,{params: new HttpParams().set('maxResults', 3000)})
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteHashType(id: number):Observable<any> {
    return this.http.delete(this.endpoint +'/'+ id)
    .pipe(
      catchError(this.handleError)
    );
  }

  createHashType(hash: any): Observable<Hashtype[]> {
    return this.http.post<any>(this.endpoint, hash) //HashtypeId only supports integer
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  updateHashType(hash: any): Observable<any> {
    console.log(hash);
    return this.http.patch<number>(this.endpoint + '/' + hash.hashTypeId, {description: hash.description, isSalted:hash.isSalted, isSlowHash: hash.isSlowHash})
    .pipe(
      tap(data => console.log('All: ', JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

}

