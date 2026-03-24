import { HttpCacheInterceptor } from '@interceptors/http-cache.interceptor';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CacheGetResult, HttpCacheService } from '@services/shared/http-cache.service';
import { SessionStorageService } from '@services/storage/session-storage.service';

describe('HttpCacheInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
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
    firstReq.flush(testData);

    // Second request - should come from cache
    httpClient.get(testUrl).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    // No new request should be made
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
    const secondGetReq = httpMock.expectOne(getUrl);
    secondGetReq.flush({ id: 3, name: 'Updated' });
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
    const secondGetReq = httpMock.expectOne(getUrl);
    secondGetReq.flush({ id: 1, name: 'Updated' });
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
    const secondGetReq = httpMock.expectOne(getUrl);
    secondGetReq.flush({ id: 1, name: 'Test' }); // Or 404 if deleted
  });

  it('should skip caching when X-Cache-Skip header is present', () => {
    const testUrl = 'https://api.test.com/data';
    const testData = { id: 1, name: 'Test Data' };

    // First request with X-Cache-Skip
    httpClient.get(testUrl, { headers: { 'X-Cache-Skip': 'true' } }).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const firstReq = httpMock.expectOne(testUrl);
    firstReq.flush(testData);

    // Second request should also hit the network (not cached)
    httpClient.get(testUrl, { headers: { 'X-Cache-Skip': 'true' } }).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const secondReq = httpMock.expectOne(testUrl);
    secondReq.flush(testData);
  });

  it('should return cached response synchronously', (done) => {
    const testUrl = 'https://api.test.com/data';
    const testData = { id: 1, name: 'Test Data' };

    // First request - populate cache
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
      done();
    });

    const firstReq = httpMock.expectOne(testUrl);
    firstReq.flush(testData);
  });

  describe('Cache-Control header (RFC 5861)', () => {
    let cacheService: HttpCacheService;

    beforeEach(() => {
      cacheService = TestBed.inject(HttpCacheService);
    });

    it('should use max-age and stale-while-revalidate from response headers', () => {
      const testUrl = 'https://api.test.com/data';
      const setSpy = spyOn(cacheService, 'set').and.callThrough();

      httpClient.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      req.flush({ ok: true }, { headers: { 'Cache-Control': 'max-age=10, stale-while-revalidate=20' } });

      expect(setSpy).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), 10_000, 20_000);
    });

    it('should fall back to defaults when Cache-Control header is absent', () => {
      const testUrl = 'https://api.test.com/data';
      const setSpy = spyOn(cacheService, 'set').and.callThrough();

      httpClient.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      req.flush({ ok: true });

      expect(setSpy).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), 30_000, 60_000);
    });

    it('should not cache when Cache-Control: no-store is present', () => {
      const testUrl = 'https://api.test.com/data';
      const setSpy = spyOn(cacheService, 'set');

      httpClient.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      req.flush({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });

      expect(setSpy).not.toHaveBeenCalled();
    });

    it('should not cache when Cache-Control: no-cache is present', () => {
      const testUrl = 'https://api.test.com/data';
      const setSpy = spyOn(cacheService, 'set');

      httpClient.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      req.flush({ ok: true }, { headers: { 'Cache-Control': 'no-cache' } });

      expect(setSpy).not.toHaveBeenCalled();
    });

    it('should not cache when Cache-Control: private is present', () => {
      const testUrl = 'https://api.test.com/data';
      const setSpy = spyOn(cacheService, 'set');

      httpClient.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      req.flush({ ok: true }, { headers: { 'Cache-Control': 'private' } });

      expect(setSpy).not.toHaveBeenCalled();
    });

    it('should fall back to default stale window when only max-age is present', () => {
      const testUrl = 'https://api.test.com/data';
      const setSpy = spyOn(cacheService, 'set').and.callThrough();

      httpClient.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      req.flush({ ok: true }, { headers: { 'Cache-Control': 'max-age=5' } });

      expect(setSpy).toHaveBeenCalledWith(jasmine.anything(), jasmine.anything(), 5_000, 60_000);
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
      spyOn(cacheService, 'get').and.returnValue(staleResult);
      const setSpy = spyOn(cacheService, 'set').and.callThrough();

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
      spyOn(cacheService, 'get').and.returnValue(freshResult);

      httpClient.get(testUrl).subscribe();

      // No network request should be made for a fresh hit
      httpMock.expectNone(testUrl);
    });
  });
});
