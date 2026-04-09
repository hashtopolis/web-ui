import { Observable, catchError, debounceTime, forkJoin, of, switchMap, throwError } from 'rxjs';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ServiceConfig } from '@services/main.config';

import type { RequestParams } from '@src/app/core/_models/request-params.model';
import { ResponseWrapper } from '@src/app/core/_models/response.model';
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
  ): Observable<ResponseWrapper> {
    let queryParams = new HttpParams();
    let fixedMaxResults = false;

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

    const options: { params?: HttpParams; headers?: HttpHeaders } = { params: queryParams };
    if (httpOptions?.headers) {
      options.headers = httpOptions.headers;
    }

    return this.http.get<ResponseWrapper>(this.cs.getEndpoint() + serviceConfig.URL, options).pipe(
      switchMap((response: ResponseWrapper) => {
        // TODO: ResponseWrapper has no 'total' field — should be response.meta?.page?.total_elements.
        // This means the pagination branch below has likely never executed.
        const total = (response as ResponseWrapper & { total?: number }).total || 0;
        const maxResults = this.maxResults;

        // Check if total is greater than maxResults and fixedMaxResults is true
        if (total > maxResults && fixedMaxResults) {
          const requests: Observable<ResponseWrapper>[] = [];
          const numRequests = Math.ceil(total / maxResults);

          // Create multiple requests based on the total number of items
          for (let i = 0; i < numRequests; i++) {
            const startsAt = i * maxResults;
            const partialParams = setParameter({
              ...(routerParams ?? {}),
              page: { after: startsAt }
            });
            const partialOptions: { params?: HttpParams; headers?: HttpHeaders } = { params: partialParams };
            if (httpOptions?.headers) {
              partialOptions.headers = httpOptions.headers;
            }
            requests.push(this.http.get<ResponseWrapper>(this.cs.getEndpoint() + serviceConfig.URL, partialOptions));
          }

          // Use forkJoin to combine the original response with additional responses
          // Note: forkJoin returns ResponseWrapper[] on success — callers expect a single ResponseWrapper.
          // This branch has never executed (see TODO above), so this cast preserves existing behavior.
          return forkJoin([of(response), ...requests]).pipe(
            catchError((error) => {
              console.error('Error in forkJoin:', error);
              return of(response); // Return the original response in case of an error
            })
          ) as unknown as Observable<ResponseWrapper>;
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
  get(serviceConfig: ServiceConfig, id: number, routerParams?: RequestParams): Observable<ResponseWrapper>;
  // Overload 2 (with headers)
  get(
    serviceConfig: ServiceConfig,
    id: number,
    routerParams: RequestParams | undefined,
    httpOptions: { headers?: HttpHeaders }
  ): Observable<ResponseWrapper>;
  // Implementation
  get(
    serviceConfig: ServiceConfig,
    id: number,
    routerParams?: RequestParams,
    httpOptions?: { headers?: HttpHeaders }
  ): Observable<ResponseWrapper> {
    let queryParams = new HttpParams();
    if (routerParams) {
      queryParams = setParameter(routerParams);
    }

    const options: { params?: HttpParams; headers?: HttpHeaders } = {};
    if (queryParams.keys().length) {
      options.params = queryParams;
    }
    if (httpOptions?.headers) {
      options.headers = httpOptions.headers;
    }

    return this.http.get<ResponseWrapper>(`${this.cs.getEndpoint() + serviceConfig.URL}/${id}`, options);
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
  create(serviceConfig: ServiceConfig, item: Record<string, unknown>, httpOptions?: { headers?: HttpHeaders }): Observable<ResponseWrapper> {
    const data = { type: serviceConfig.RESOURCE, ...item };
    const serializedData = new JsonAPISerializer().serialize({ stuff: data });
    return this.http.post<ResponseWrapper>(this.cs.getEndpoint() + serviceConfig.URL, serializedData, httpOptions);
  }

  /**
   * Delete an object
   * @param serviceConfig Service config for the requested endpoint (URL and resource type)
   * @param id            ID of object to delete
   */
  delete(serviceConfig: ServiceConfig, id: number): Observable<object> {
    return this.http.delete<object>(this.cs.getEndpoint() + serviceConfig.URL + '/' + id);
  }

  bulkDelete(serviceConfig: ServiceConfig, objects: { id: number }[]): Observable<object> {
    const objectdata: { id: number; type: string }[] = [];

    for (const object of objects) {
      objectdata.push({ id: object.id, type: serviceConfig.RESOURCE });
    }
    const data = { data: objectdata };
    return this.http.delete<object>(this.cs.getEndpoint() + serviceConfig.URL, { body: data }).pipe(debounceTime(2000));
  }

  /**
   * Update element information
   * @param serviceConfig
   * @param id - element id
   * @param arr - fields to be updated
   * @returns Object
   **/
  update(serviceConfig: ServiceConfig, id: number, arr: Record<string, unknown>): Observable<object> {
    const item = { type: serviceConfig.RESOURCE, id: id, ...arr };
    const serializedData = new JsonAPISerializer().serialize({ stuff: item });
    return this.http.patch<object>(this.cs.getEndpoint() + serviceConfig.URL + '/' + id, serializedData).pipe(debounceTime(2000));
  }

  /**
   * Bulk update information of object
   * @param serviceConfig the serviceconfig of the API endpoint
   * @param objects the objects that needs to be updated
   * @param attributes the attributes that needs to be changed
   */
  bulkUpdate(serviceConfig: ServiceConfig, objects: { id: number }[], attributes: Record<string, unknown>): Observable<object> {
    const objectdata: { id: number; type: string; attributes: Record<string, unknown> }[] = [];

    for (const object of objects) {
      objectdata.push({
        id: object.id,
        type: serviceConfig.RESOURCE,
        attributes: attributes
      });
    }
    const data = { data: objectdata };
    return this.http.patch<object>(this.cs.getEndpoint() + serviceConfig.URL, data).pipe(debounceTime(2000));
  }

  postRelationships(serviceConfig: ServiceConfig, id: number, relType: string, data: Record<string, unknown>): Observable<object> {
    return this.http
      .post<object>(this.cs.getEndpoint() + serviceConfig.URL + '/' + id + '/relationships/' + relType, data)
      .pipe(debounceTime(2000));
  }

  deleteRelationships(serviceConfig: ServiceConfig, id: number, relType: string, data: Record<string, unknown>): Observable<object> {
    return this.http
      .delete<object>(this.cs.getEndpoint() + serviceConfig.URL + '/' + id + '/relationships/' + relType, {
        body: data
      })
      .pipe(debounceTime(2000));
  }

  getRelationships(serviceConfig: ServiceConfig, id: number, relType: string): Observable<ResponseWrapper> {
    return this.http
      .get<ResponseWrapper>(this.cs.getEndpoint() + serviceConfig.URL + '/' + id + '/' + relType)
      .pipe(debounceTime(2000));
  }

  /**
   * Update agent information
   * @param serviceConfig the serviceconfig of the API endpoint
   * @param id - agent id
   * @returns Object
   **/
  archive(serviceConfig: ServiceConfig, id: number): Observable<object> {
    return this.http.patch<object>(this.cs.getEndpoint() + serviceConfig.URL + '/' + id, { isArchived: true });
  }

  /**
   * Helper get function
   * @param serviceConfig the serviceconfig of the API endpoint
   * @param option        Method used, i.e. getUserPermission
   */
  ghelper(serviceConfig: ServiceConfig, option: string): Observable<ResponseWrapper> {
    return this.http.get<ResponseWrapper>(this.cs.getEndpoint() + serviceConfig.URL + '/' + option);
  }

  /**
   * Helper Create function
   * @param serviceConfig the service config of the API endpoint
   * @param option - method used. ie. /abort /reset /importFile
   * @param arr - fields to be updated (optional)
   * @param method - HTTP method: 'POST' (default) or 'GET'
   * @returns Observable<T>
   **/
  chelper<T = ResponseWrapper>(serviceConfig: ServiceConfig, option: string, arr?: Record<string, unknown>, method: 'POST' | 'GET' = 'POST'): Observable<T> {
    const url = `${this.cs.getEndpoint()}${serviceConfig.URL}/${option}`;

    if (method === 'GET') {
      let params = new HttpParams();
      if (arr) {
        for (const [key, value] of Object.entries(arr)) {
          if (value != null) {
            params = params.set(key, String(value));
          }
        }
      }
      return this.http.get<T>(url, { params });
    }

    // default POST
    return this.http.post<T>(url, arr ?? {});
  }

  /**
   * Helper Update function
   * @param serviceConfig the serviceconfig of the API endpoint
   * @param option - method used. ie. /abort /reset /importFile
   * @param arr - fields to be updated
   * @returns Object
   **/
  uhelper(serviceConfig: ServiceConfig, id: number, option: string, arr: Record<string, unknown>): Observable<object> {
    const item = { type: serviceConfig.RESOURCE, id: id, ...arr };
    const serializedData = new JsonAPISerializer().serialize({ stuff: item });
    return this.http.patch<object>(this.cs.getEndpoint() + serviceConfig.URL + '/' + option, serializedData);
  }
}
