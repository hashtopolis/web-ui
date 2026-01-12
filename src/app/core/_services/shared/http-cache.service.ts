import { HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SessionStorageService } from '@services/storage/session-storage.service';

interface SerializedHttpResponse {
  body: unknown;
  status: number;
  statusText: string;
  url: string | null;
  headers: Record<string, string[]>;
}

interface CacheEntry {
  expires: number;
  response: SerializedHttpResponse;
}

const DEFAULT_TTL_MS = 30_000; // Safe default to avoid stale data
const CACHE_PREFIX = 'htp-cache:'; // 'htp' = hashtopolis

@Injectable({
  providedIn: 'root'
})
export class HttpCacheService {
  private readonly memoryCache = new Map<string, CacheEntry>();

  constructor(private sessionStorage: SessionStorageService<CacheEntry>) {}

  get(req: HttpRequest<unknown>): HttpResponse<unknown> | null {
    const key = this.getKey(req);

    const entry = this.memoryCache.get(key) ?? this.sessionStorage.getItem(key);
    if (!entry) {
      return null;
    }

    if (entry.expires && entry.expires <= Date.now()) {
      this.delete(key);
      return null;
    }

    this.memoryCache.set(key, entry);
    return this.deserialize(entry.response);
  }

  set(req: HttpRequest<unknown>, res: HttpResponse<unknown>, ttlMs: number = DEFAULT_TTL_MS): void {
    if (ttlMs <= 0) {
      return; // Do not cache
    }

    // Cache JSON-ish responses only to avoid large binaries
    if (!this.isLikelyJson(res)) {
      return;
    }

    const key = this.getKey(req);
    const entry: CacheEntry = {
      expires: ttlMs ? Date.now() + ttlMs : 0,
      response: this.serialize(res)
    };

    this.memoryCache.set(key, entry);
    this.sessionStorage.setItem(key, entry, ttlMs);
  }

  /**
   * Invalidate cache entries. If no prefix provided, clears all.
   */
  invalidate(prefix?: string): void {
    const targetPrefix = prefix ? `${CACHE_PREFIX}${prefix}` : CACHE_PREFIX;

    for (const key of Array.from(this.memoryCache.keys())) {
      if (key.startsWith(targetPrefix)) {
        this.memoryCache.delete(key);
      }
    }

    Object.keys(sessionStorage)
      .filter((k) => k.startsWith(targetPrefix))
      .forEach((k) => sessionStorage.removeItem(k));
  }

  private delete(key: string): void {
    this.memoryCache.delete(key);
    this.sessionStorage.removeItem(key);
  }

  private getKey(req: HttpRequest<unknown>): string {
    const token = req.headers.get('Authorization') ?? 'anonymous';
    const tokenHash = this.simpleHash(token);
    return `${CACHE_PREFIX}user=${tokenHash}|${req.urlWithParams}`;
  }

  /**
   * Simple non-cryptographic hash to anonymize tokens in cache keys.
   * Ensures each user's token produces a unique key without exposing the token itself.
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash = hash & hash; // convert to 32bit integer
    }
    return Math.abs(hash).toString(36).substring(0, 8);
  }

  private serialize(res: HttpResponse<unknown>): SerializedHttpResponse {
    const headers: Record<string, string[]> = {};
    res.headers.keys().forEach((k) => {
      headers[k] = res.headers.getAll(k) ?? [];
    });

    return {
      body: res.body,
      status: res.status,
      statusText: res.statusText,
      url: res.url ?? null,
      headers
    };
  }

  private deserialize(serialized: SerializedHttpResponse): HttpResponse<unknown> {
    return new HttpResponse({
      body: serialized.body,
      status: serialized.status,
      statusText: serialized.statusText,
      url: serialized.url ?? undefined,
      headers: new HttpHeaders(serialized.headers)
    });
  }

  private isLikelyJson(res: HttpResponse<unknown>): boolean {
    const contentType = res.headers.get('content-type')?.toLowerCase() ?? '';
    if (contentType.includes('application/json')) {
      return true;
    }

    // Fallback heuristic: body is object or array
    return typeof res.body === 'object' && res.body !== null;
  }
}
