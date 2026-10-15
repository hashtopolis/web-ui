import { BehaviorSubject, of, throwError } from 'rxjs';

import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AuthData } from '@models/auth-user.model';

import { AuthInterceptorService } from '@interceptors/auth-interceptor.service';
import { AuthService } from '@services/access/auth.service';

describe('AuthInterceptorService', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;
  let currentUser: BehaviorSubject<AuthData | null>;

  const RESOURCE_URL = 'http://localhost/ui/agents';

  const session = (token: string): AuthData => ({
    _token: token,
    _expires: new Date(Date.now() + 3_600_000),
    userId: 1,
    canonicalUsername: 'testuser'
  });

  /**
   * @param isExpiring - what the service reports for the *current* token
   */
  const configure = (isExpiring: boolean) => {
    currentUser = new BehaviorSubject<AuthData | null>(session('current-token'));
    const spy = jasmine.createSpyObj<AuthService>(
      'AuthService',
      ['refreshToken', 'logOut', 'isAccessTokenExpiring', 'isAccessTokenExpired'],
      { user: currentUser }
    );
    spy.isAccessTokenExpiring.and.returnValue(isExpiring);
    spy.isAccessTokenExpired.and.returnValue(isExpiring);
    spy.refreshToken.and.returnValue(of(session('renewed-token')));

    TestBed.configureTestingModule({
      providers: [
        // DI-registered interceptors only run when they are explicitly wired in
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: spy },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    authService = spy;
  };

  afterEach(() => {
    httpMock.verify();
  });

  it('attaches the current token while it is still good', () => {
    configure(false);

    http.get(RESOURCE_URL).subscribe();

    const req = httpMock.expectOne(RESOURCE_URL);
    expect(req.request.headers.get('Authorization')).toBe('Bearer current-token');
    expect(authService.refreshToken).not.toHaveBeenCalled();

    req.flush({});
  });

  it('renews before sending when the token is about to expire', () => {
    configure(true);

    http.get(RESOURCE_URL).subscribe();

    expect(authService.refreshToken).toHaveBeenCalledTimes(1);

    const req = httpMock.expectOne(RESOURCE_URL);
    expect(req.request.headers.get('Authorization')).toBe('Bearer renewed-token');

    req.flush({});
  });

  it('renews and resends once when the backend rejects the token anyway', () => {
    configure(false);
    // The backend rejected it even though the token looked valid here, as happens on clock skew
    authService.isAccessTokenExpired.and.returnValue(true);

    let body: unknown = null;
    http.get(RESOURCE_URL).subscribe((res) => (body = res));

    httpMock.expectOne(RESOURCE_URL).flush({ title: 'Expired token' }, { status: 400, statusText: 'Bad Request' });

    const retried = httpMock.expectOne(RESOURCE_URL);
    expect(retried.request.headers.get('Authorization')).toBe('Bearer renewed-token');
    retried.flush({ ok: true });

    expect(body).toEqual({ ok: true });
    expect(authService.refreshToken).toHaveBeenCalledTimes(1);
  });

  it('does not retry a failure that has nothing to do with the token', () => {
    configure(false);

    let status = 0;
    http.get(RESOURCE_URL).subscribe({ error: (err) => (status = err.status) });

    httpMock.expectOne(RESOURCE_URL).flush({ title: 'Nope' }, { status: 403, statusText: 'Forbidden' });

    expect(status).toBe(403);
    expect(authService.refreshToken).not.toHaveBeenCalled();
  });

  it('logs out when the session can no longer be renewed', () => {
    configure(true);
    authService.refreshToken.and.returnValue(throwError(() => new Error('refresh cookie gone')));

    http.get(RESOURCE_URL).subscribe({ error: () => undefined });

    expect(authService.logOut).toHaveBeenCalledTimes(1);
    httpMock.expectNone(RESOURCE_URL);
  });

  it('does not retry the retried request a second time', () => {
    configure(false);
    authService.isAccessTokenExpired.and.returnValue(true);

    let status = 0;
    http.get(RESOURCE_URL).subscribe({ error: (err) => (status = err.status) });

    httpMock.expectOne(RESOURCE_URL).flush({}, { status: 401, statusText: 'Unauthorized' });
    httpMock.expectOne(RESOURCE_URL).flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(status).toBe(401);
    expect(authService.refreshToken).toHaveBeenCalledTimes(1);
  });

  it('leaves the auth endpoints alone so renewing cannot recurse', () => {
    configure(true);

    http.post('http://localhost/auth/refresh', null).subscribe();

    const req = httpMock.expectOne('http://localhost/auth/refresh');
    expect(req.request.headers.has('Authorization')).toBe(false);
    expect(authService.refreshToken).not.toHaveBeenCalled();

    req.flush({});
  });

  it('forwards the request untouched when nobody is logged in', () => {
    configure(false);
    currentUser.next(null);

    http.get(RESOURCE_URL).subscribe();

    const req = httpMock.expectOne(RESOURCE_URL);
    expect(req.request.headers.has('Authorization')).toBe(false);

    req.flush({});
  });
});
