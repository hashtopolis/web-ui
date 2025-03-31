import { Observable, catchError, debounceTime, forkJoin, of, switchMap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

import type { RequestParams } from '@src/app/core/_models/request-params.model';

import { AuthService } from '@src/app/core/_services/access/auth.service';
import { ConfigService } from '@src/app/core/_services/shared/config.service';
import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';
import { setParameter } from '@src/app/core/_services/buildparams';

import { environment } from '@src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  constructor(
    private http: HttpClient,
    private as: AuthService,
    private cs: ConfigService
  ) {}

  /**
   * Get logged user id
   * @returns  id
   **/

  get userId() {
    return this.as.userId;
  }

  /**
   * Gets the maximum number of results from the environment configuration.
   * @returns {number} The maximum number of results.
   */
  get maxResults(): number {
    return Number(environment.config.prodApiMaxResults);
  }

  /**
   * Service method to retrieve data from the API.
   * If a value is specified for maxResults, it will be utilized; otherwise, the system will default to the maxResults defined in the configuration and load the data in chunks of the specified maxResults.
   * @param methodUrl - The API endpoint URL.
   * @param routerParams - Parameters for the API request, including options such as Max number of results or filtering.
   * @returns An observable that emits the API response.
   */
  getAll(methodUrl: string, routerParams?: RequestParams): Observable<any> {
    let queryParams: Params = {};
    let fixedMaxResults: boolean;

    // Check if routerParams exist
    if (routerParams) {
      queryParams = setParameter(routerParams);
      // Check if 'page[size]' is not present in routerParams
      if (!routerParams?.page?.size) {
        fixedMaxResults = true;
      }
    } else {
      fixedMaxResults = true;
    }

    return this.http.get(this.cs.getEndpoint() + methodUrl, { params: queryParams }).pipe(
      switchMap((response: any) => {
        const total = response.total || 0;
        const maxResults = this.maxResults;

        // Check if total is greater than maxResults and fixedMaxResults is true
        if (total > maxResults && fixedMaxResults) {
          const requests: Observable<any>[] = [];
          const numRequests = Math.ceil(total / maxResults);

          // Create multiple requests based on the total number of items
          for (let i = 0; i < numRequests; i++) {
            const startsAt = i * maxResults;
            const partialParams = setParameter({ ...queryParams, page: { after: startsAt } });
            requests.push(
              this.http.get(this.cs.getEndpoint() + methodUrl, {
                params: partialParams
              })
            );
          }

          // Use forkJoin to combine the original response with additional responses
          return forkJoin([of(response), ...requests]).pipe(
            catchError((error) => {
              console.error('Error in forkJoin:', error);
              return of(response); // Return the original response in case of an error
            })
          );
        } else {
          return of(response);
        }
      }),
      catchError((error) => {
        console.error('Error in switchMap:', error);
        return of({ values: [] }); // Handle errors in switchMap and return a default response
      })
    );
  }

  /**
   * Returns an specific element
   * @param id - element id
   * @returns  Object
   **/
  get(methodUrl: string, id: number, routerParams?: RequestParams): Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
      queryParams = setParameter(routerParams);
    }
    return this.http.get(`${this.cs.getEndpoint() + methodUrl}/${id}`, {
      params: queryParams
    });
  }

  /**
   * Create
   * @param item - fields
   * @returns  Object
   **/
  create(methodUrl: string, item: any, type=''): Observable<any> {
    const data = { type: type, ...item };
    const serializedData = new JsonAPISerializer().serialize({ stuff: data });
    return this.http.post<any>(this.cs.getEndpoint() + methodUrl, serializedData);
  }

  /**
   * Deletes a element
   * @param id - element id
   * @returns Object
   **/
  delete(methodUrl: string, id: number): Observable<any> {
    return this.http.delete(this.cs.getEndpoint() + methodUrl + '/' + id);
    /*
    .pipe(
      tap(data => console.log(JSON.stringify(data))),
      retryWhen(errors => {
          return errors
                  .pipe(
                    tap(() => console.log("Retrying...")),
                    delay(2000), // Add a delay before retry delete
                    take(3)  // Retry max 3 times
                  );
      } )
    );
    */
  }

  /**
   * Update element information
   * @param id - element id
   * @param arr - fields to be updated
   * @param type resource type (json:api standard)
   * @returns Object
   **/
  update(methodUrl: string, id: number, arr: any, type = ''): Observable<any> {
    let data = { type: type, id: id, ...arr };
    data = new JsonAPISerializer().serialize({ stuff: data });
    return this.http.patch<number>(this.cs.getEndpoint() + methodUrl + '/' + id, data).pipe(debounceTime(2000));
  }

  /**
   * Update agent information
   * @param id - agent id
   * @param arr - fields to be updated
   * @returns Object
   **/
  archive(methodUrl: string, id: number): Observable<any> {
    return this.http.patch<number>(this.cs.getEndpoint() + methodUrl + '/' + id, { isArchived: true });
  }

  /**
   * Helper Create function
   * @param option - method used. ie. /abort /reset /importFile
   * @param arr - fields to be updated
   * @returns Object
   **/
  chelper(methodUrl: string, option: string, arr: any): Observable<any> {
    return this.http.post(this.cs.getEndpoint() + methodUrl + '/' + option, arr);
  }

  /**
   * Helper Update function
   * @param option - method used. ie. /abort /reset /importFile
   * @param arr - fields to be updated
   * @returns Object
   **/
  uhelper(methodUrl: string, option: string, arr: any): Observable<any> {
    return this.http.patch(this.cs.getEndpoint() + methodUrl + '/' + option, arr);
  }
}
