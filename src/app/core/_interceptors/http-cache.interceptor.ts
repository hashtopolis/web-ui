import { Observable, of, tap } from 'rxjs';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { HttpCacheService } from '@services/shared/http-cache.service';

/**
 * HTTP cache interceptor implementing a stale-while-revalidate strategy.
 *
 * @remarks
 * - GET responses are cached with a short TTL and a longer stale window.
 * - While the entry is fresh, the cached response is returned immediately.
 * - While the entry is stale (TTL elapsed but within the stale window), the cached
 *   response is returned immediately **and** a background revalidation request is fired
 *   to refresh the cache for subsequent callers.
 * - Cache keys include a user-token hash to isolate data per user.
 * - Mutating requests (POST/PUT/PATCH/DELETE) invalidate the entire cache.
 * - Requests with the `X-Cache-Skip` header bypass caching entirely.
 */
@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {
  private readonly defaultTtlMs = 30_000;
  private readonly defaultStaleWindowMs = 60_000;

  private readonly cache = inject(HttpCacheService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Invalidate cache on any mutation to stay fresh
    if (this.isMutation(req)) {
      this.cache.invalidate();
      return next.handle(req);
    }

    if (req.method !== 'GET' || req.headers.has('X-Cache-Skip')) {
      return next.handle(req);
    }

    const cached = this.cache.get(req);
    if (cached) {
      if (cached.isStale) {
        // Serve stale data immediately; refresh the cache in the background
        this.revalidate(req, next);
      }
      return of(cached.response);
    }

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.cache.set(req, event, this.defaultTtlMs, this.defaultStaleWindowMs);
        }
      })
    );
  }

  /**
   * Fires a background request to refresh the cache entry without blocking the caller.
   *
   * @param req - The original GET request to revalidate
   * @param next - The next handler in the interceptor chain
   */
  private revalidate(req: HttpRequest<unknown>, next: HttpHandler): void {
    next
      .handle(req)
      .pipe(
        tap((event) => {
          if (event instanceof HttpResponse) {
            this.cache.set(req, event, this.defaultTtlMs, this.defaultStaleWindowMs);
          }
        })
      )
      .subscribe();
  }

  private isMutation(req: HttpRequest<unknown>): boolean {
    return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase());
  }
}
