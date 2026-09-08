import { Observable, Subject, catchError, forkJoin, map, of, switchMap, take, throttle, throwError, timer } from 'rxjs';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HelperEndpoint, ServiceConfig } from '@services/main.config';

import type { RequestParams } from '@src/app/core/_models/request-params.model';
import { ResponseWrapper } from '@src/app/core/_models/response.model';
import { AuthService } from '@src/app/core/_services/access/auth.service';
import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';
import { setParameter } from '@src/app/core/_services/buildparams';
import { ConfigService } from '@src/app/core/_services/shared/config.service';
import { environment } from '@src/environments/environment';

interface JsonApiRelationshipData {
  data: { type: string; id: number }[];
}

// Wraps a debounced request's outcome so it can flow through a plain Subject relay without
// erroring it out (an rxjs error notification would permanently terminate the Subject).
type DebounceEnvelope<T> = { ok: true; value: T } | { ok: false; error: unknown };

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  // Per-key debounce groups for `debounceRequest`, keyed e.g. by resource id. Each key's trigger
  // Subject feeds a throttle pipeline that is subscribed exactly once, permanently, right when the
  // key is first used (see below for why), and relays outcomes into `debounceResults`.
  private readonly debounceTriggers = new Map<string, Subject<() => Observable<unknown>>>();
  private readonly debounceResults = new Map<string, Subject<DebounceEnvelope<unknown>>>();

  constructor(
    private http: HttpClient,
    private as: AuthService,
    private cs: ConfigService
  ) {}

  /**
   * Debounces mutating (or otherwise rate-sensitive) requests that target the same resource.
   *
   * `debounceTime` piped directly onto an HttpClient observable does NOT debounce the request:
   * HttpClient sends the request as soon as it's subscribed, and `debounceTime` only delays
   * *emitting the already-received response* to the subscriber. Repeated calls still fire one
   * HTTP request each, just with delayed delivery.
   *
   * This instead defers *creating* the request (via `requestFactory`) to a leading+trailing
   * throttle per `key`: the first call for a key fires immediately (no artificial delay for a
   * one-off action). Further calls that arrive while that cooldown window is still running don't
   * fire on their own — the latest one is remembered and sent once as a single trailing request
   * when the window ends, which then starts a new cooldown. Every caller for a key receives the
   * result of whichever actual request (leading or trailing) their call ended up part of.
   *
   * The throttle pipeline is subscribed once, permanently, rather than lazily via `share()`. Each
   * individual caller only stays subscribed until *their* result arrives (then unsubscribes), so
   * with `share()`'s default ref-counting, the moment a leading call's lone subscriber got its
   * result there'd be zero subscribers left — tearing down the throttle's internal cooldown timer
   * before a since-then call could ever see it, making every call look like a fresh leading edge.
   */
  private debounceRequest<T>(key: string, requestFactory: () => Observable<T>, time = 2000): Observable<T> {
    if (!this.debounceTriggers.has(key)) {
      const trigger$ = new Subject<() => Observable<T>>();
      const relay$ = new Subject<DebounceEnvelope<T>>();

      trigger$
        .pipe(
          throttle(() => timer(time), { leading: true, trailing: true }),
          switchMap((factory) =>
            factory().pipe(
              map((value): DebounceEnvelope<T> => ({ ok: true, value })),
              catchError((error) => of<DebounceEnvelope<T>>({ ok: false, error }))
            )
          )
        )
        .subscribe((envelope) => relay$.next(envelope));

      this.debounceTriggers.set(key, trigger$ as Subject<() => Observable<unknown>>);
      this.debounceResults.set(key, relay$ as Subject<DebounceEnvelope<unknown>>);
    }

    const trigger$ = this.debounceTriggers.get(key) as Subject<() => Observable<T>>;
    const relay$ = this.debounceResults.get(key) as Subject<DebounceEnvelope<T>>;

    return new Observable<T>((subscriber) => {
      const subscription = relay$.pipe(take(1)).subscribe((envelope) => {
        if (envelope.ok) {
          subscriber.next(envelope.value);
          subscriber.complete();
        } else {
          subscriber.error(envelope.error);
        }
      });
      trigger$.next(requestFactory);
      return () => subscription.unsubscribe();
    });
  }

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
  create(
    serviceConfig: ServiceConfig,
    item: Record<string, unknown>,
    httpOptions?: { headers?: HttpHeaders }
  ): Observable<ResponseWrapper> {
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
    const key = `bulkDelete:${serviceConfig.URL}:${objects
      .map((object) => object.id)
      .sort((a, b) => a - b)
      .join(',')}`;
    return this.debounceRequest(key, () =>
      this.http.delete<object>(this.cs.getEndpoint() + serviceConfig.URL, { body: data })
    );
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
    const key = `update:${serviceConfig.URL}:${id}`;
    return this.debounceRequest(key, () =>
      this.http.patch<object>(this.cs.getEndpoint() + serviceConfig.URL + '/' + id, serializedData)
    );
  }

  /**
   * Bulk update information of object
   * @param serviceConfig the serviceconfig of the API endpoint
   * @param objects the objects that needs to be updated
   * @param attributes the attributes that needs to be changed
   */
  bulkUpdate(
    serviceConfig: ServiceConfig,
    objects: { id: number }[],
    attributes: Record<string, unknown>
  ): Observable<object> {
    const objectdata: { id: number; type: string; attributes: Record<string, unknown> }[] = [];

    for (const object of objects) {
      objectdata.push({
        id: object.id,
        type: serviceConfig.RESOURCE,
        attributes: attributes
      });
    }
    const data = { data: objectdata };
    const key = `bulkUpdate:${serviceConfig.URL}:${objects
      .map((object) => object.id)
      .sort((a, b) => a - b)
      .join(',')}`;
    return this.debounceRequest(key, () => this.http.patch<object>(this.cs.getEndpoint() + serviceConfig.URL, data));
  }

  postRelationships(
    serviceConfig: ServiceConfig,
    id: number,
    relType: string,
    data: JsonApiRelationshipData
  ): Observable<object> {
    const key = `postRelationships:${serviceConfig.URL}:${id}:${relType}`;
    return this.debounceRequest(key, () =>
      this.http.post<object>(this.cs.getEndpoint() + serviceConfig.URL + '/' + id + '/relationships/' + relType, data)
    );
  }

  deleteRelationships(
    serviceConfig: ServiceConfig,
    id: number,
    relType: string,
    data: JsonApiRelationshipData
  ): Observable<object> {
    const key = `deleteRelationships:${serviceConfig.URL}:${id}:${relType}`;
    return this.debounceRequest(key, () =>
      this.http.delete<object>(this.cs.getEndpoint() + serviceConfig.URL + '/' + id + '/relationships/' + relType, {
        body: data
      })
    );
  }

  getRelationships(serviceConfig: ServiceConfig, id: number, relType: string): Observable<ResponseWrapper> {
    const key = `getRelationships:${serviceConfig.URL}:${id}:${relType}`;
    return this.debounceRequest(key, () =>
      this.http.get<ResponseWrapper>(this.cs.getEndpoint() + serviceConfig.URL + '/' + id + '/' + relType)
    );
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
  ghelper(
    serviceConfig: ServiceConfig,
    option: HelperEndpoint,
    params?: Record<string, string | number>
  ): Observable<ResponseWrapper> {
    let httpParams = new HttpParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        httpParams = httpParams.set(key, String(value));
      }
    }
    return this.http.get<ResponseWrapper>(this.cs.getEndpoint() + serviceConfig.URL + '/' + option, {
      params: httpParams
    });
  }

  /**
   * Helper Create function
   * @param serviceConfig the service config of the API endpoint
   * @param option - method used. ie. /abort /reset /importFile
   * @param arr - fields to be updated (optional)
   * @param method - HTTP method: 'POST' (default) or 'GET'
   * @returns Observable<T>
   **/
  chelper<T = ResponseWrapper>(
    serviceConfig: ServiceConfig,
    option: HelperEndpoint,
    arr?: Record<string, unknown>,
    method: 'POST' | 'GET' = 'POST',
    httpOptions?: { headers?: HttpHeaders }
  ): Observable<T> {
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
      const options: { params?: HttpParams; headers?: HttpHeaders } = { params };
      if (httpOptions?.headers) {
        options.headers = httpOptions.headers;
      }
      return this.http.get<T>(url, options);
    }

    // default POST
    return this.http.post<T>(url, arr ?? {}, httpOptions);
  }

  /**
   * Helper Update function
   * @param serviceConfig the serviceconfig of the API endpoint
   * @param option - method used. ie. /abort /reset /importFile
   * @param arr - fields to be updated
   * @returns Object
   **/
  uhelper(
    serviceConfig: ServiceConfig,
    id: number,
    option: HelperEndpoint,
    arr: Record<string, unknown>
  ): Observable<object> {
    const item = { type: serviceConfig.RESOURCE, id: id, ...arr };
    const serializedData = new JsonAPISerializer().serialize({ stuff: item });
    return this.http.patch<object>(this.cs.getEndpoint() + serviceConfig.URL + '/' + option, serializedData);
  }
}
