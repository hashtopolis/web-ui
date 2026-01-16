import { Observable, of, tap } from 'rxjs';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HttpCacheService } from '@services/shared/http-cache.service';

/**
 * Simple HTTP cache interceptor using session-backed cache.
 * - Caches GET requests with a short TTL to speed up UI renders.
 * - Cache keys include user token hash to isolate data per user (prevents data leakage).
 * - Clears cache on mutating requests to avoid stale data.
 * - Skips caching when the header `X-Cache-Skip` is present.
 */
@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {
  private readonly defaultTtlMs = 30_000;

  constructor(private cache: HttpCacheService) {}

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
      return of(cached);
    }

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.cache.set(req, event, this.defaultTtlMs);
        }
      })
    );
  }

  private isMutation(req: HttpRequest<unknown>): boolean {
    return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase());
  }
}
