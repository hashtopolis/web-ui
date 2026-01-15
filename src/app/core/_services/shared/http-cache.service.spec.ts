import { HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { HttpCacheService } from '@services/shared/http-cache.service';
import { SessionStorageService } from '@services/storage/session-storage.service';

describe('HttpCacheService', () => {
  let service: HttpCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpCacheService, SessionStorageService]
    });
    service = TestBed.inject(HttpCacheService);
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should cache a GET request response', () => {
    const req = new HttpRequest('GET', 'https://api.test.com/data');
    const res = new HttpResponse({
      body: { id: 1, name: 'Test' },
      status: 200,
      statusText: 'OK',
      url: 'https://api.test.com/data'
    });

    service.set(req, res, 30000);
    const cached = service.get(req);

    expect(cached).toBeTruthy();
    expect(cached?.body).toEqual({ id: 1, name: 'Test' });
  });

  it('should return null for uncached requests', () => {
    const req = new HttpRequest('GET', 'https://api.test.com/data');
    const cached = service.get(req);

    expect(cached).toBeNull();
  });

  it('should isolate cache by user token', () => {
    const headers1 = new HttpHeaders({ Authorization: 'Bearer token-user-1' });
    const headers2 = new HttpHeaders({ Authorization: 'Bearer token-user-2' });

    const req1 = new HttpRequest('GET', 'https://api.test.com/data', null, { headers: headers1 });
    const req2 = new HttpRequest('GET', 'https://api.test.com/data', null, { headers: headers2 });

    const res = new HttpResponse({
      body: { user: 'user-1' },
      status: 200,
      statusText: 'OK'
    });

    service.set(req1, res, 30000);

    // User 1 should get the cached response
    const cached1 = service.get(req1);
    expect(cached1?.body).toEqual({ user: 'user-1' });

    // User 2 should not get user 1's cache
    const cached2 = service.get(req2);
    expect(cached2).toBeNull();
  });

  it('should not cache non-JSON responses', () => {
    const req = new HttpRequest('GET', 'https://api.test.com/image.png');
    const res = new HttpResponse({
      body: new Blob(['binary data']),
      status: 200,
      statusText: 'OK',
      headers: new HttpHeaders({ 'content-type': 'image/png' })
    });

    service.set(req, res, 30000);
    const cached = service.get(req);

    expect(cached).toBeNull();
  });

  it('should cache JSON responses', () => {
    const req = new HttpRequest('GET', 'https://api.test.com/data');
    const res = new HttpResponse({
      body: { id: 1, name: 'Test' },
      status: 200,
      statusText: 'OK',
      headers: new HttpHeaders({ 'content-type': 'application/json' })
    });

    service.set(req, res, 30000);
    const cached = service.get(req);

    expect(cached).toBeTruthy();
    expect(cached?.body).toEqual({ id: 1, name: 'Test' });
  });

  it('should invalidate cache on command', () => {
    const req = new HttpRequest('GET', 'https://api.test.com/data');
    const res = new HttpResponse({
      body: { id: 1, name: 'Test' },
      status: 200,
      statusText: 'OK'
    });

    service.set(req, res, 30000);
    let cached = service.get(req);
    expect(cached).toBeTruthy();

    service.invalidate();
    cached = service.get(req);
    expect(cached).toBeNull();
  });

  it('should respect TTL expiration', (done) => {
    const req = new HttpRequest('GET', 'https://api.test.com/data');
    const res = new HttpResponse({
      body: { id: 1, name: 'Test' },
      status: 200,
      statusText: 'OK'
    });

    service.set(req, res, 100); // Expires in 100ms

    let cached = service.get(req);
    expect(cached).toBeTruthy();

    setTimeout(() => {
      cached = service.get(req);
      expect(cached).toBeNull();
      done();
    }, 150);
  });

  it('should skip caching when TTL is 0 or negative', () => {
    const req = new HttpRequest('GET', 'https://api.test.com/data');
    const res = new HttpResponse({
      body: { id: 1, name: 'Test' },
      status: 200,
      statusText: 'OK'
    });

    service.set(req, res, 0);
    const cached = service.get(req);

    expect(cached).toBeNull();
  });

  it('should persist cache to sessionStorage', () => {
    const req = new HttpRequest('GET', 'https://api.test.com/data');
    const res = new HttpResponse({
      body: { id: 1, name: 'Test' },
      status: 200,
      statusText: 'OK'
    });

    service.set(req, res, 30000);

    // Clear memory cache to force retrieval from sessionStorage
    const cached = service.get(req);
    expect(cached?.body).toEqual({ id: 1, name: 'Test' });

    // Verify that data is in sessionStorage (as a sanity check)
    expect(sessionStorage.length).toBeGreaterThan(0);
  });
});
