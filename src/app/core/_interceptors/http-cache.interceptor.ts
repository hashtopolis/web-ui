import { Observable, of, tap } from 'rxjs';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { HttpCacheService } from '@services/shared/http-cache.service';

export const DEFAULT_TTL_MS = 1;
export const DEFAULT_STALE_TIME_MS = 1_800_000; // 30min

/**
 * HTTP cache interceptor implementing a stale-while-revalidate strategy.
 *
 * @remarks
 * - GET responses are cached using TTL and stale window values sourced from the
 *   response `Cache-Control` header (`max-age`, `stale-while-revalidate` per RFC 5861).
 *   When these directives are absent, hardcoded defaults are used.
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
  private readonly defaultTtlMs = DEFAULT_TTL_MS;
  private readonly defaultStaleWindowMs = DEFAULT_STALE_TIME_MS;

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
          const ttl = this.resolveCacheTtl(event);
          if (ttl) this.cache.set(req, event, ttl.ttlMs, ttl.staleWindowMs);
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
            const ttl = this.resolveCacheTtl(event);
            if (ttl) this.cache.set(req, event, ttl.ttlMs, ttl.staleWindowMs);
          }
        })
      )
      .subscribe();
  }

  /**
   * Resolves TTL and stale window from the response `Cache-Control` header.
   * Reads `max-age` and `stale-while-revalidate` directives (RFC 5861) when present,
   * otherwise falls back to the configured defaults.
   * Returns `null` when the server signals the response must not be cached
   * (`no-store`, `no-cache`, or `private`).
   *
   * @param res - The HTTP response to inspect
   * @returns TTL and stale window in milliseconds, or `null` if caching is disallowed
   */
  private resolveCacheTtl(res: HttpResponse<unknown>): { ttlMs: number; staleWindowMs: number } | null {
    const header = res.headers.get('Cache-Control') ?? '';

    if (
      this.hasDirective(header, 'no-store') ||
      this.hasDirective(header, 'no-cache') ||
      this.hasDirective(header, 'private')
    ) {
      return null;
    }

    const maxAge = this.parseDirectiveSeconds(header, 'max-age');
    const staleWhileRevalidate = this.parseDirectiveSeconds(header, 'stale-while-revalidate');

    return {
      ttlMs: maxAge !== null ? maxAge * 1000 : this.defaultTtlMs,
      staleWindowMs: staleWhileRevalidate !== null ? staleWhileRevalidate * 1000 : this.defaultStaleWindowMs
    };
  }

  /**
   * Returns true when a flag directive (no value) is present in a `Cache-Control` header.
   *
   * @param header - Raw `Cache-Control` header value
   * @param directive - Directive name to look up (e.g. `'no-store'`)
   * @returns Whether the directive is present
   */
  private hasDirective(header: string, directive: string): boolean {
    return new RegExp(`(?:^|,)\\s*${directive}\\s*(?:,|$)`).test(header);
  }

  /**
   * Parses a numeric directive value from a `Cache-Control` header string.
   *
   * @param header - Raw `Cache-Control` header value
   * @param directive - Directive name to look up (e.g. `'max-age'`)
   * @returns The directive value in seconds, or `null` if absent or non-numeric
   */
  private parseDirectiveSeconds(header: string, directive: string): number | null {
    const match = new RegExp(`(?:^|,)\\s*${directive}=(\\d+)`).exec(header);
    if (!match) return null;
    const value = parseInt(match[1], 10);
    return isNaN(value) ? null : value;
  }

  private isMutation(req: HttpRequest<unknown>): boolean {
    return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase());
  }
}
