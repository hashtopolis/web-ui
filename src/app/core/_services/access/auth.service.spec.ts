import { Buffer } from 'buffer';

import { Subject, of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthData } from '@models/auth-user.model';
import { Permission } from '@models/global-permission-group.model';

import { AuthService } from '@services/access/auth.service';
import { PermissionService } from '@services/permission/permission.service';
import { ConfigService } from '@services/shared/config.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Create a working mock storage that actually stores/retrieves data
    const storageMock = {
      _store: {} as Record<string, AuthData>,
      getItem(key: string): AuthData | null {
        return this._store[key] || null;
      },
      setItem(key: string, value: AuthData) {
        this._store[key] = value;
      },
      removeItem(key: string) {
        delete this._store[key];
      }
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: ConfigService, useValue: { getEndpoint: () => 'http://localhost' } },
        { provide: LocalStorageService, useValue: storageMock },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: PermissionService, useValue: { loadPermissions: () => of([]), clearPermissionCache: () => {} } }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('encodes non-latin1 password using UTF-8 in Basic Authorization header', () => {
    const username = 'user';
    const password = 'pässwörd';

    service.logIn(username, password).subscribe();

    // Auth request
    const authReq = httpMock.expectOne((req) => req.url.endsWith('/auth/token'));
    expect(authReq.request.method).toBe('POST');

    const expectedBasic = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');

    expect(authReq.request.headers.get('Authorization')).toBe('Basic ' + expectedBasic);

    authReq.flush({
      token: 'eyJhbGciOiJub25lIn0.eyJzdWIiOjF9.',
      expires: Math.floor(Date.now() / 1000) + 3600
    });

    // User fetch request
    const userReq = httpMock.expectOne('http://localhost/ui/users/1');
    expect(userReq.request.method).toBe('GET');

    userReq.flush({ id: 1, name: 'Demo User' });
  });
});

describe('AuthService.autoLogin', () => {
  let service: AuthService;
  let permSubject: Subject<Permission>;

  beforeEach(() => {
    permSubject = new Subject<Permission>();

    const storageMock = {
      _store: {
        userData: {
          _token: 'dummy-token',
          _expires: new Date(Date.now() + 3_600_000),
          userId: 1,
          canonicalUsername: 'testuser'
        }
      } as Record<string, unknown>,
      getItem(key: string) {
        return this._store[key] ?? null;
      },
      setItem(key: string, value: unknown) {
        this._store[key] = value;
      },
      removeItem(key: string) {
        delete this._store[key];
      }
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: ConfigService, useValue: { getEndpoint: () => 'http://localhost' } },
        { provide: LocalStorageService, useValue: storageMock },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        {
          provide: PermissionService,
          useValue: {
            loadPermissions: () => permSubject.asObservable(),
            clearPermissionCache: () => {}
          }
        }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('does not complete until loadPermissions() emits', () => {
    // `provideAppInitializer` waits for completion (`subscribe({ complete: resolve })`),
    // so the initializer contract is: autoLogin() must complete only after permissions
    // are populated.
    let completed = false;
    service.autoLogin().subscribe({ complete: () => (completed = true) });

    expect(completed).toBe(false);

    permSubject.next({});

    expect(completed).toBe(true);
  });

  it('still completes even if loadPermissions() only emits (never completes)', () => {
    // Guards against the bug where loadPermissions()'s cache-hit branch returns a
    // BehaviorSubject that emits but never completes — autoLogin's `take(1)` must
    // still yield a completing observable.
    let completed = false;
    service.autoLogin().subscribe({ complete: () => (completed = true) });

    permSubject.next({}); // emit without completing

    expect(completed).toBe(true);
  });

  it('completes synchronously when no userData is present', () => {
    const storage = TestBed.inject(LocalStorageService) as unknown as { _store: Record<string, unknown> };
    storage._store = {};

    let completed = false;
    service.autoLogin().subscribe({ complete: () => (completed = true) });

    expect(completed).toBe(true);
  });
});

describe('AuthService refresh token', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let storage: { _store: Record<string, AuthData> };

  const REFRESH_URL = 'http://localhost/auth/refresh';

  /** A token whose payload decodes to userId 1 and carries no username claim, like a refreshed one. */
  const tokenForUser1 = () => {
    // The browser's Buffer polyfill has no 'base64url' encoding, so url-safe it by hand
    const payload = Buffer.from(JSON.stringify({ userId: 1 }), 'utf8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return `eyJhbGciOiJub25lIn0.${payload}.`;
  };

  const storedSession = (expiresInMs: number): AuthData => ({
    _token: 'stale-token',
    _expires: new Date(Date.now() + expiresInMs),
    userId: 1,
    canonicalUsername: 'testuser'
  });

  /**
   * The renewal now runs inside a Web Lock, so the request leaves on a microtask rather than on the
   * call itself. Specs have to let that turn happen before asserting on the mock backend.
   */
  const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

  let originalLocks: PropertyDescriptor | undefined;
  let lockRequests: string[];

  beforeEach(() => {
    /* A real Web Lock is shared by everything on the page, so one spec that leaves a request
       unflushed would hold it and hang the next. Stub it with a pass-through that still runs the
       callback, and record the names so the locking itself can be asserted. */
    lockRequests = [];
    originalLocks = Object.getOwnPropertyDescriptor(navigator, 'locks');
    Object.defineProperty(navigator, 'locks', {
      configurable: true,
      value: {
        request: async (name: string, callback: () => Promise<unknown>) => {
          lockRequests.push(name);
          return callback();
        }
      }
    });
  });

  afterEach(() => {
    if (originalLocks) {
      Object.defineProperty(navigator, 'locks', originalLocks);
    } else {
      delete (navigator as unknown as Record<string, unknown>)['locks'];
    }
  });

  beforeEach(() => {
    const storageMock = {
      _store: {} as Record<string, AuthData>,
      getItem(key: string): AuthData | null {
        return this._store[key] || null;
      },
      setItem(key: string, value: AuthData) {
        this._store[key] = value;
      },
      removeItem(key: string) {
        delete this._store[key];
      }
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: ConfigService, useValue: { getEndpoint: () => 'http://localhost' } },
        { provide: LocalStorageService, useValue: storageMock },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: PermissionService, useValue: { loadPermissions: () => of([]), clearPermissionCache: () => {} } }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    storage = storageMock;
    // Every caller of refreshToken() checks first, so an expiring session is the real precondition
    storage._store[AuthService.STORAGE_KEY] = storedSession(-1000);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('sends the refresh request with credentials so the browser attaches the cookie', async () => {
    service.refreshToken().subscribe();
    await settle();

    const req = httpMock.expectOne(REFRESH_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBe(true);

    req.flush({ token: tokenForUser1(), expires: Math.floor(Date.now() / 1000) + 3600 });
  });

  it('stores the renewed token and its expiry', async () => {
    const expires = Math.floor(Date.now() / 1000) + 3600;
    const token = tokenForUser1();

    service.refreshToken().subscribe();
    await settle();
    httpMock.expectOne(REFRESH_URL).flush({ token, expires });

    const stored = storage._store[AuthService.STORAGE_KEY];
    expect(stored._token).toBe(token);
    expect(new Date(stored._expires).getTime()).toBe(expires * 1000);
  });

  it('keeps the username, which a refreshed token does not carry', async () => {
    service.refreshToken().subscribe();
    await settle();
    httpMock.expectOne(REFRESH_URL).flush({ token: tokenForUser1(), expires: Math.floor(Date.now() / 1000) + 3600 });

    expect(storage._store[AuthService.STORAGE_KEY].canonicalUsername).toBe('testuser');
    expect(storage._store[AuthService.STORAGE_KEY].userId).toBe(1);
  });

  it('issues a single request for concurrent callers', async () => {
    // Rotation consumes the cookie per call, so parallel callers must share one request
    service.refreshToken().subscribe();
    service.refreshToken().subscribe();
    service.refreshToken().subscribe();
    await settle();

    const requests = httpMock.match(REFRESH_URL);
    expect(requests.length).toBe(1);

    requests[0].flush({ token: tokenForUser1(), expires: Math.floor(Date.now() / 1000) + 3600 });
  });

  it('allows a new request once the previous one settled', async () => {
    service.refreshToken().subscribe();
    await settle();
    httpMock.expectOne(REFRESH_URL).flush({ token: tokenForUser1(), expires: Math.floor(Date.now() / 1000) + 3600 });
    await settle();

    // The stored token is fresh now, so age it back out to force a second exchange
    storage._store[AuthService.STORAGE_KEY] = storedSession(-1000);

    service.refreshToken().subscribe();
    await settle();
    httpMock.expectOne(REFRESH_URL).flush({ token: tokenForUser1(), expires: Math.floor(Date.now() / 1000) + 3600 });
  });

  it('reports a failed refresh to the caller', async () => {
    let failed = false;
    service.refreshToken().subscribe({ error: () => (failed = true) });
    await settle();

    httpMock
      .expectOne(REFRESH_URL)
      .flush({ title: 'Refresh token has expired' }, { status: 401, statusText: 'Unauthorized' });
    await settle();

    expect(failed).toBe(true);
  });

  it('renews under a lock, so two tabs cannot spend the same single-use cookie', async () => {
    service.refreshToken().subscribe();
    await settle();

    expect(lockRequests).toEqual(['hashtopolis-refresh-token']);

    httpMock.expectOne(REFRESH_URL).flush({ token: tokenForUser1(), expires: Math.floor(Date.now() / 1000) + 3600 });
  });

  it('adopts what another tab renewed instead of spending the cookie again', async () => {
    // Stand in for a tab that held the lock first and wrote its result to the shared storage
    const fresh: AuthData = {
      _token: tokenForUser1(),
      _expires: new Date(Date.now() + 3_600_000),
      userId: 1,
      canonicalUsername: 'testuser'
    };
    storage._store[AuthService.STORAGE_KEY] = fresh;

    let received: AuthData | null = null;
    service.refreshToken().subscribe((data) => (received = data));
    await settle();

    httpMock.expectNone(REFRESH_URL);
    expect(received!._token).toBe(fresh._token);
  });

  it('falls back to renewing directly where Web Locks is unavailable', async () => {
    // Blank rather than delete: deleting the stub would uncover the browser's real implementation
    Object.defineProperty(navigator, 'locks', { configurable: true, value: undefined });

    service.refreshToken().subscribe();
    await settle();

    httpMock.expectOne(REFRESH_URL).flush({ token: tokenForUser1(), expires: Math.floor(Date.now() / 1000) + 3600 });
  });

  it('treats a token past its expiry as expired and one near it as expiring', () => {
    storage._store[AuthService.STORAGE_KEY] = storedSession(-1000);
    expect(service.isAccessTokenExpired()).toBe(true);
    expect(service.isAccessTokenExpiring()).toBe(true);

    storage._store[AuthService.STORAGE_KEY] = storedSession(30_000);
    expect(service.isAccessTokenExpired()).toBe(false);
    expect(service.isAccessTokenExpiring()).toBe(true);

    storage._store[AuthService.STORAGE_KEY] = storedSession(3_600_000);
    expect(service.isAccessTokenExpired()).toBe(false);
    expect(service.isAccessTokenExpiring()).toBe(false);
  });

  it('treats a missing session as expired', () => {
    storage._store = {};
    expect(service.isAccessTokenExpired()).toBe(true);
  });

  it('revokes the session on the server when logging out', () => {
    service.logOut();

    const req = httpMock.expectOne(REFRESH_URL);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBe(true);
    req.flush(null, { status: 204, statusText: 'No Content' });

    expect(storage._store[AuthService.STORAGE_KEY]).toBeUndefined();
  });

  it('clears the local session even when the server could not be reached', () => {
    service.logOut();

    httpMock.expectOne(REFRESH_URL).error(new ProgressEvent('network error'));

    expect(storage._store[AuthService.STORAGE_KEY]).toBeUndefined();
    expect(service.token).toBeNull();
  });

  it('does not call the server when there is no session to revoke', () => {
    storage._store = {};

    service.logOut();

    httpMock.expectNone(REFRESH_URL);
    expect(service.token).toBeNull();
  });
});
