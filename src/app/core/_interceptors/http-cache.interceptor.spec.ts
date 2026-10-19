import { HTTP_SKIP_CACHE_HEADER_CONFIG } from '@constants/http.config';
import { DEFAULT_STALE_TIME_MS, DEFAULT_TTL_MS, HttpCacheInterceptor } from '@interceptors/http-cache.interceptor';
import { lastValueFrom } from 'rxjs';

import { HttpClient, HttpResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CacheGetResult, HttpCacheService } from '@services/shared/http-cache.service';
import { SessionStorageService } from '@services/storage/session-storage.service';

describe('HttpCacheInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        SessionStorageService,
        HttpCacheService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpCacheInterceptor,
          multi: true
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);

    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should cache GET requests', () => {
    const testUrl = 'https://api.test.com/data';
    const testData = { id: 1, name: 'Test Data' };

    // First request - should hit the network
    httpClient.get(testUrl).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const firstReq = httpMock.expectOne(testUrl);
    firstReq.flush(testData, { headers: { 'Cache-Control': 'max-age=60' } });

    // Second request - served from a fresh cache entry, no network call
    httpClient.get(testUrl).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    httpMock.expectNone(testUrl);
  });

  it('should not cache POST requests', () => {
    const testUrl = 'https://api.test.com/data';
    const postData = { name: 'New Item' };
    const response = { id: 1, ...postData };

    httpClient.post(testUrl, postData).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toBe('POST');
    req.flush(response);
  });

  it('should invalidate cache on POST', () => {
    const getUrl = 'https://api.test.com/data';
    const postUrl = 'https://api.test.com/data';

    // Cache a GET request
    httpClient.get(getUrl).subscribe();
    const getReq = httpMock.expectOne(getUrl);
    getReq.flush({ id: 1, name: 'Test' });

    // POST should invalidate the cache
    httpClient.post(postUrl, {}).subscribe();
    const postReq = httpMock.expectOne(postUrl);
    postReq.flush({ id: 2 });

    // Next GET should hit the network again
    httpClient.get(getUrl).subscribe();
    expect(() => httpMock.expectOne(getUrl).flush({ id: 3, name: 'Updated' })).not.toThrow();
  });

  it('should invalidate cache on PUT', () => {
    const getUrl = 'https://api.test.com/data/1';
    const putUrl = 'https://api.test.com/data/1';

    // Cache a GET request
    httpClient.get(getUrl).subscribe();
    const getReq = httpMock.expectOne(getUrl);
    getReq.flush({ id: 1, name: 'Test' });

    // PUT should invalidate the cache
    httpClient.put(putUrl, { name: 'Updated' }).subscribe();
    const putReq = httpMock.expectOne(putUrl);
    putReq.flush({ id: 1, name: 'Updated' });

    // Next GET should hit the network again
    httpClient.get(getUrl).subscribe();
    expect(() => httpMock.expectOne(getUrl).flush({ id: 1, name: 'Updated' })).not.toThrow();
  });

  it('should invalidate cache on DELETE', () => {
    const getUrl = 'https://api.test.com/data/1';
    const deleteUrl = 'https://api.test.com/data/1';

    // Cache a GET request
    httpClient.get(getUrl).subscribe();
    const getReq = httpMock.expectOne(getUrl);
    getReq.flush({ id: 1, name: 'Test' });

    // DELETE should invalidate the cache
    httpClient.delete(deleteUrl).subscribe();
    const deleteReq = httpMock.expectOne(deleteUrl);
    deleteReq.flush({});

    // Next GET should hit the network again
    httpClient.get(getUrl).subscribe();
    expect(() => httpMock.expectOne(getUrl).flush({ id: 1, name: 'Test' })).not.toThrow(); // Or 404 if deleted
  });

  it('should skip caching when X-Cache-Skip header is present', () => {
    const testUrl = 'https://api.test.com/data';
    const testData = { id: 1, name: 'Test Data' };

    // First request with X-Cache-Skip
    httpClient.get(testUrl, { headers: HTTP_SKIP_CACHE_HEADER_CONFIG }).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const firstReq = httpMock.expectOne(testUrl);
    firstReq.flush(testData);

    // Second request should also hit the network (not cached)
    httpClient.get(testUrl, { headers: HTTP_SKIP_CACHE_HEADER_CONFIG }).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const secondReq = httpMock.expectOne(testUrl);
    secondReq.flush(testData);
  });

  it('should return cached response synchronously', async () => {
    const testUrl = 'https://api.test.com/data';
    const testData = { id: 1, name: 'Test Data' };

    // First request - populate cache
    let done!: () => void;
    const finished = new Promise<void>((resolve) => (done = resolve));
    httpClient.get(testUrl).subscribe((data) => {
      expect(data).toEqual(testData);

      // After first request is cached, second request should be instant
      let subscribeFinished = false;

      httpClient.get(testUrl).subscribe((cachedData) => {
        expect(cachedData).toEqual(testData);
        subscribeFinished = true;
      });

      // Due to synchronous response from cache (via of()), subscription completes immediately
      expect(subscribeFinished).toBe(true);

      // The entry may already be stale (TTL is 1 ms), so the interceptor
      // could have fired a background revalidation request. Flush it so
      // that httpMock.verify() in afterEach does not fail.
      httpMock.match(testUrl).forEach((req) => req.flush(testData));
      done();
    });

    const firstReq = httpMock.expectOne(testUrl);
    firstReq.flush(testData);
    await finished;
  });

  describe('Cache-Control header (RFC 5861)', () => {
    let cacheService: HttpCacheService;

    beforeEach(() => {
      cacheService = TestBed.inject(HttpCacheService);
    });

    it('should use max-age and stale-while-revalidate from response headers', () => {
      const testUrl = 'https://api.test.com/data';
      const setSpy = vi.spyOn(cacheService, 'set');

      httpClient.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      req.flush({ ok: true }, { headers: { 'Cache-Control': 'max-age=10, stale-while-revalidate=20' } });

      expect(setSpy).toHaveBeenCalledWith(expect.anything(), expect.anything(), 10000, 20000);
    });

    it('should fall back to defaults when Cache-Control header is absent', () => {
      const testUrl = 'https://api.test.com/data';
      const setSpy = vi.spyOn(cacheService, 'set');

      httpClient.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      req.flush({ ok: true });

      expect(setSpy).toHaveBeenCalledWith(expect.anything(), expect.anything(), DEFAULT_TTL_MS, DEFAULT_STALE_TIME_MS);
    });

    it('should not cache when Cache-Control: no-store is present', () => {
      const testUrl = 'https://api.test.com/data';
      const setSpy = vi.spyOn(cacheService, 'set').mockReturnValue(undefined);

      httpClient.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      req.flush({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });

      expect(setSpy).not.toHaveBeenCalled();
    });

    it('should not cache when Cache-Control: no-cache is present', () => {
      const testUrl = 'https://api.test.com/data';
      const setSpy = vi.spyOn(cacheService, 'set').mockReturnValue(undefined);

      httpClient.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      req.flush({ ok: true }, { headers: { 'Cache-Control': 'no-cache' } });

      expect(setSpy).not.toHaveBeenCalled();
    });

    it('should not cache when Cache-Control: private is present', () => {
      const testUrl = 'https://api.test.com/data';
      const setSpy = vi.spyOn(cacheService, 'set').mockReturnValue(undefined);

      httpClient.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      req.flush({ ok: true }, { headers: { 'Cache-Control': 'private' } });

      expect(setSpy).not.toHaveBeenCalled();
    });

    it('should fall back to default stale window when only max-age is present', () => {
      const testUrl = 'https://api.test.com/data';
      const setSpy = vi.spyOn(cacheService, 'set');

      httpClient.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      req.flush({ ok: true }, { headers: { 'Cache-Control': 'max-age=5' } });

      expect(setSpy).toHaveBeenCalledWith(expect.anything(), expect.anything(), 5000, DEFAULT_STALE_TIME_MS);
    });
  });

  describe('stale-while-revalidate', () => {
    let cacheService: HttpCacheService;

    beforeEach(() => {
      cacheService = TestBed.inject(HttpCacheService);
    });

    it('should serve a stale response immediately and trigger a background revalidation', () => {
      const testUrl = 'https://api.test.com/data';
      const staleData = { id: 1, name: 'Stale' };
      const freshData = { id: 1, name: 'Fresh' };

      // Seed the cache with a stale entry by manipulating the service directly
      const staleResult: CacheGetResult = {
        response: new HttpResponse({
          body: staleData,
          status: 200,
          statusText: 'OK'
        }),
        isStale: true
      };
      vi.spyOn(cacheService, 'get').mockReturnValue(staleResult);
      const setSpy = vi.spyOn(cacheService, 'set');

      let receivedData: unknown;
      httpClient.get(testUrl).subscribe((data) => {
        receivedData = data;
      });

      // The stale response should be returned synchronously without any network request for the caller
      expect(receivedData).toEqual(staleData);

      // A background revalidation request must have been fired
      const revalidationReq = httpMock.expectOne(testUrl);
      revalidationReq.flush(freshData);

      // The background response should update the cache
      expect(setSpy).toHaveBeenCalled();
    });

    it('delivers stale then fresh to one subscriber, so lastValueFrom resolves to the fresh value', async () => {
      // Guards the volatile-detail cache fix: those reads use lastValueFrom to get the
      // revalidated value on a stale hit. firstValueFrom would resolve to staleData here
      // and cancel the revalidation, which is the frozen-data bug this replaces.
      const testUrl = 'https://api.test.com/data';
      const staleData = { id: 1, name: 'Stale' };
      const freshData = { id: 1, name: 'Fresh' };

      vi.spyOn(cacheService, 'get').mockReturnValue({
        response: new HttpResponse({ body: staleData, status: 200, statusText: 'OK' }),
        isStale: true
      } as CacheGetResult);

      const result = lastValueFrom(httpClient.get(testUrl));

      // Stale is served synchronously; the background revalidation fires — answer it with fresh data.
      httpMock.expectOne(testUrl).flush(freshData);

      await expect(result).resolves.toEqual(freshData);
    });

    it('should not trigger a background revalidation for a fresh cache hit', () => {
      const testUrl = 'https://api.test.com/data';
      const cachedData = { id: 1, name: 'Fresh' };

      const freshResult: CacheGetResult = {
        response: new HttpResponse({
          body: cachedData,
          status: 200,
          statusText: 'OK'
        }),
        isStale: false
      };
      vi.spyOn(cacheService, 'get').mockReturnValue(freshResult);

      httpClient.get(testUrl).subscribe();

      // No network request should be made for a fresh hit
      expect(() => httpMock.expectNone(testUrl)).not.toThrow();
    });

    it('should serve stale data and refresh the cache end-to-end when TTL elapses within the stale window', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date());
      try {
        const testUrl = 'https://api.test.com/data';
        const staleData = { id: 1, name: 'v1' };
        const freshData = { id: 1, name: 'v2' };

        // Seed the cache with a 1s TTL and a 60s stale window
        httpClient.get(testUrl).subscribe();
        const first = httpMock.expectOne(testUrl);
        first.flush(staleData, { headers: { 'Cache-Control': 'max-age=1, stale-while-revalidate=60' } });

        // Advance past the TTL but stay inside the stale window
        vi.advanceTimersByTime(5000);

        // Second GET: stale entry is served immediately, background revalidation fires
        let firstRead: unknown;
        httpClient.get(testUrl).subscribe((data) => {
          firstRead = data;
        });
        expect(firstRead).toEqual(staleData);

        const revalidation = httpMock.expectOne(testUrl);
        revalidation.flush(freshData, { headers: { 'Cache-Control': 'max-age=60, stale-while-revalidate=60' } });

        // Third GET: cache is fresh again with the revalidated data, no network call
        let secondRead: unknown;
        httpClient.get(testUrl).subscribe((data) => {
          secondRead = data;
        });
        expect(secondRead).toEqual(freshData);
        httpMock.expectNone(testUrl);
      } finally {
        vi.useRealTimers();
      }
    });
  });
});
