import { Observable, catchError, debounceTime, forkJoin, of, switchMap, throwError } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

import { ServiceConfig } from '@services/main.config';

import type { RequestParams } from '@src/app/core/_models/request-params.model';
import { AuthService } from '@src/app/core/_services/access/auth.service';
import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';
import { setParameter } from '@src/app/core/_services/buildparams';
import { ConfigService } from '@src/app/core/_services/shared/config.service';
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
   * @param serviceConfig Service config for the requested endpoint (URL and resource type)
   * @param routerParams  Optional request parameters (e.g. filters, includes)
   * @param httpOptions   Optional HTTP options (e.g., custom headers)
   * @returns An observable that emits the API response.
   */
  getAll(
    serviceConfig: ServiceConfig,
    routerParams?: RequestParams,
    httpOptions?: { headers?: HttpHeaders }
  ): Observable<any> {
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

    const options: { params?: Params; headers?: HttpHeaders } = { params: queryParams };
    if (httpOptions?.headers) {
      options.headers = httpOptions.headers;
    }

    return this.http.get(this.cs.getEndpoint() + serviceConfig.URL, options).pipe(
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
            const partialParams = setParameter({
              ...queryParams,
              page: { after: startsAt }
            });
            const partialOptions: { params?: Params; headers?: HttpHeaders } = { params: partialParams };
            if (httpOptions?.headers) {
              partialOptions.headers = httpOptions.headers;
            }
            requests.push(this.http.get(this.cs.getEndpoint() + serviceConfig.URL, partialOptions));
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
        // Re-throw the error so downstream handlers (datasource) can catch it
        // Don't silently convert to empty response
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a single object from backend by its ID
   * Overloads keep backwards compatibility and allow passing custom headers.
   */
  // Overload 1 (compat)
  get(serviceConfig: ServiceConfig, id: number, routerParams?: RequestParams): Observable<any>;
  // Overload 2 (with headers)
  get(
    serviceConfig: ServiceConfig,
    id: number,
    routerParams: RequestParams | undefined,
    httpOptions: { headers?: HttpHeaders }
  ): Observable<any>;
  // Implementation
  get(
    serviceConfig: ServiceConfig,
    id: number,
    routerParams?: RequestParams,
    httpOptions?: { headers?: HttpHeaders }
  ): Observable<any> {
    let queryParams: Params = {};
    if (routerParams) {
      queryParams = setParameter(routerParams);
    }

    const options: { params?: Params; headers?: HttpHeaders } = {};
    if (Object.keys(queryParams).length) {
      options.params = queryParams;
    }
    if (httpOptions?.headers) {
      options.headers = httpOptions.headers;
    }

    return this.http.get(`${this.cs.getEndpoint() + serviceConfig.URL}/${id}`, options);
  }

  /**
   * Download a file from the backend
   * @param serviceConfig Service config for the requested endpoint (URL and resource type)
   * @param id            ID of file to get
   * @param filename      Filname to use for the downloaded file
   */
  getFile(serviceConfig: ServiceConfig, id: number, filename: string): void {
    this.http
      .get(`${this.cs.getEndpoint() + serviceConfig.URL}?file=${id}`, {
        responseType: 'blob'
      })
      .subscribe({
        next: (response: Blob) => {
          // Generate Blob-URL
          const blob = new Blob([response], { type: response.type });
          const url = window.URL.createObjectURL(blob);

          // Create a temporary ‘a’ element for download
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();

          // Release the URL of the blob again
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Fehler beim Download der Datei:', error);
        }
      });
  }

  /**
   * Create an object
   * @param serviceConfig Service config for the requested endpoint (URL and resource type)
   * @param item          Data of item to create
   */
  create(serviceConfig: ServiceConfig, item: any): Observable<any> {
    const data = { type: serviceConfig.RESOURCE, ...item };
    const serializedData = new JsonAPISerializer().serialize({ stuff: data });
    return this.http.post<any>(this.cs.getEndpoint() + serviceConfig.URL, serializedData);
  }

  /**
   * Delete an object
   * @param serviceConfig Service config for the requested endpoint (URL and resource type)
   * @param id            ID of object to delete
   */
  delete(serviceConfig: ServiceConfig, id: number): Observable<any> {
    return this.http.delete(this.cs.getEndpoint() + serviceConfig.URL + '/' + id);
    /*
    .pipe(
      tap(data => console.log(JSON.stringify(data))),
      retryWhen(errors => {
          return errors
                  .pipe(
                    tap(() => console.log("Retrying..."))),
                    delay(2000), // Add a delay before retry delete
                    take(3)  // Retry max 3 times
                  );
      } )
    );
    */
  }

  bulkDelete(serviceConfig: ServiceConfig, objects: any): Observable<any> {
    const objectdata = [];

    for (const object of objects) {
      objectdata.push({ id: object.id, type: serviceConfig.RESOURCE });
    }
    const data = { data: objectdata };
    return this.http.delete<number>(this.cs.getEndpoint() + serviceConfig.URL, { body: data }).pipe(debounceTime(2000));
  }

  /**
   * Update element information
   * @param serviceConfig
   * @param id - element id
   * @param arr - fields to be updated
   * @returns Object
   **/
  update(serviceConfig: ServiceConfig, id: number, arr: any): Observable<any> {
    let data = { type: serviceConfig.RESOURCE, id: id, ...arr };
    data = new JsonAPISerializer().serialize({ stuff: data });
    return this.http.patch<number>(this.cs.getEndpoint() + serviceConfig.URL + '/' + id, data).pipe(debounceTime(2000));
  }

  bulkUpdate(serviceConfig: ServiceConfig, objects: any, attributes: any) {
    /**
     * Bulk update information of object
     * @param serviceConfig the serviceconfig of the API endpoint
     * @param objects the objects that needs to be updated
     * @param attributes the attributes that needs to be changed
     */
    const objectdata = [];

    for (const object of objects) {
      objectdata.push({
        id: object.id,
        type: serviceConfig.RESOURCE,
        attributes: attributes
      });
    }
    const data = { data: objectdata };
    return this.http.patch<number>(this.cs.getEndpoint() + serviceConfig.URL, data).pipe(debounceTime(2000));
  }

  postRelationships(serviceConfig: ServiceConfig, id: number, relType: string, data: any): Observable<any> {
    return this.http
      .post<number>(this.cs.getEndpoint() + serviceConfig.URL + '/' + id + '/relationships/' + relType, data)
      .pipe(debounceTime(2000));
  }

  deleteRelationships(serviceConfig: ServiceConfig, id: number, relType: string, data: any): Observable<any> {
    return this.http
      .delete<number>(this.cs.getEndpoint() + serviceConfig.URL + '/' + id + '/relationships/' + relType, {
        body: data
      })
      .pipe(debounceTime(2000));
  }

  /**
   * Update agent information
   * @param serviceConfig the serviceconfig of the API endpoint
   * @param id - agent id
   * @returns Object
   **/
  archive(serviceConfig: ServiceConfig, id: number): Observable<any> {
    return this.http.patch<number>(this.cs.getEndpoint() + serviceConfig.URL + '/' + id, { isArchived: true });
  }

  /**
   * Helper get function
   * @param serviceConfig the serviceconfig of the API endpoint
   * @param option        Method used, i.e. getUserPermission
   */
  ghelper(serviceConfig: ServiceConfig, option: string): Observable<any> {
    return this.http.get(this.cs.getEndpoint() + serviceConfig.URL + '/' + option);
  }

  /**
   * Helper Create function
   * @param serviceConfig the serviceconfig of the API endpoint
   * @param option - method used. ie. /abort /reset /importFile
   * @param arr - fields to be updated
   * @returns Object
   **/
  chelper(serviceConfig: ServiceConfig, option: string, arr: any): Observable<any> {
    return this.http.post(this.cs.getEndpoint() + serviceConfig.URL + '/' + option, arr);
  }

  /**
   * Helper Update function
   * @param serviceConfig the serviceconfig of the API endpoint
   * @param option - method used. ie. /abort /reset /importFile
   * @param arr - fields to be updated
   * @returns Object
   **/
  uhelper(serviceConfig: ServiceConfig, option: string, arr: any): Observable<any> {
    return this.http.patch(this.cs.getEndpoint() + serviceConfig.URL + '/' + option, arr);
  }
}
