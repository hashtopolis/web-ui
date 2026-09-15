import { Buffer } from 'buffer';

import { BehaviorSubject, Observable, ReplaySubject, Subject, of, switchMap, take, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, finalize, map, shareReplay, tap } from 'rxjs/operators';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Injector, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AuthData, AuthUser } from '@models/auth-user.model';
import { Permission } from '@models/global-permission-group.model';
import { UserId } from '@models/id.types';
import { JwtPayload } from '@models/jwt-payload.model';

import { LoginRedirectService } from '@services/access/login-redirect.service';
import { PermissionService } from '@services/permission/permission.service';
import { ConfigService } from '@services/shared/config.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

export interface AuthResponseData {
  token: string;
  expires: number;
}

type StoredAuthData = Omit<AuthData, '_expires'> & { _expires: string | Date };

@Injectable({ providedIn: 'root' })
export class AuthService {
  static readonly STORAGE_KEY = 'userData';

  user = new BehaviorSubject<AuthData | null>(null);
  userId: number | null = null;

  @Output() authChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  isAuthenticated = false;
  private logged = new ReplaySubject<boolean>(1);
  isLogged = this.logged.asObservable();
  redirectUrl = '';
  private userLoggedIn = new Subject<boolean>();
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private endpoint = '/auth';

  /**
   * How long before the access token expires the session is renewed. Wide enough to absorb a slow
   * request and modest clock skew, short enough that a renewal is rare.
   */
  private static readonly REFRESH_LEAD_TIME_MS = 60_000;

  /**
   * The renewal currently in flight, shared by every caller so that a burst of requests hitting an
   * expiring token produces one call rather than one per request. Rotation makes that matter: each
   * call consumes the refresh cookie and issues a new one.
   */
  private refreshInFlight$: Observable<AuthData> | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cs: ConfigService,
    private storage: LocalStorageService<AuthData>,
    private injector: Injector // Use injector to delay injection of PermissionService to avoid circular dependency
  ) {
    this.userLoggedIn.next(false);
    if (this.logged) {
      this.userId = this.getUserId(this.token);
    }
  }

  /**
   * Auto-login user, if there is a token in localStorage
   */
  autoLogin(): Observable<Permission | null> {
    const raw = this.storage.getItem(AuthService.STORAGE_KEY);
    if (!raw) return of(null);

    const userData = raw as StoredAuthData;

    const token: string = userData._token;
    const expires: Date = userData._expires instanceof Date ? userData._expires : new Date(userData._expires);

    const userId = typeof userData.userId === 'number' ? userData.userId : (this.getUserId(token) ?? 0);

    const canonicalUsername: string = userData.canonicalUsername ?? this.getCanonicalUsernameFromJwt(token) ?? '';

    const loadedUser = new AuthUser(token, expires, userId, canonicalUsername);

    if (!loadedUser._token) {
      this.logOut();
      return of(null);
    }

    /* The access token lives hours while the refresh cookie lives days, so finding an expired token
       on startup is the normal case rather than a reason to send the user back to the login form. */
    if (expires <= new Date()) {
      return this.refreshToken().pipe(
        switchMap(() => this.loadPermissions()),
        catchError(() => {
          this.logOut();
          return of(null);
        })
      );
    }

    this.user.next(loadedUser);
    this._authUser$.next(loadedUser);

    if (!loadedUser.canonicalUsername && loadedUser.userId) {
      this.fetchCanonicalUsername(loadedUser.userId, loadedUser._token).subscribe({
        next: (canonicalFromApi) => {
          const canonical = canonicalFromApi ?? '';

          const updated: AuthData = {
            _token: loadedUser._token,
            _expires: loadedUser._expires,
            userId: loadedUser.userId,
            canonicalUsername: canonical
          };

          this.storage.setItem(AuthService.STORAGE_KEY, updated, 0);
          this.user.next(updated);
          this._authUser$.next(
            new AuthUser(
              updated._token,
              updated._expires instanceof Date ? updated._expires : new Date(updated._expires),
              updated.userId,
              updated.canonicalUsername
            )
          );
        },
        error: (err) => {
          console.warn('Failed to fetch canonical username on autoLogin', err);
        }
      });
    }

    this.scheduleTokenRefresh(expires);

    return this.loadPermissions();
  }

  /**
   * Loads the permissions of the current session, degrading to `null` instead of failing the caller:
   * a session that is valid but whose permissions could not be fetched is still a session.
   */
  private loadPermissions(): Observable<Permission | null> {
    return this.injector
      .get(PermissionService)
      .loadPermissions()
      .pipe(
        take(1),
        catchError((err) => {
          console.error('Failed to load permissions:', err);
          return of(null);
        })
      );
  }

  logIn(username: string, password: string): Observable<void> {
    // Send credentials via basic authorization header. Encode using Buffer with 'utf8' to correctly
    // handle non-Latin characters and to produce a correctly padded base64 string.
    const basic = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');

    return this.http
      .post<AuthResponseData>(
        this.cs.getEndpoint() + this.endpoint + '/token',
        null, // credentials are sent via Authorization header only
        {
          headers: new HttpHeaders({
            Authorization: 'Basic ' + basic
          }),
          // The response sets the HttpOnly refresh cookie, which the browser drops on a
          // cross-origin response unless the request asked for credentials
          withCredentials: true
        }
      )
      .pipe(
        catchError(this.handleError),
        switchMap((resData) => {
          const token = resData.token;
          const expires = +resData.expires;

          const canonicalFromJwt = this.getCanonicalUsernameFromJwt(token);
          if (canonicalFromJwt) {
            this.handleAuthentication(token, expires, canonicalFromJwt);
            this.isAuthenticated = true;
            this.userAuthChanged(true);
            return this.injector.get(PermissionService).loadPermissions();
          }

          const payload = this.decodeJwt(token);
          const rawUid = payload?.userId ?? payload?.sub;
          const uid = typeof rawUid === 'string' ? Number(rawUid) : typeof rawUid === 'number' ? rawUid : null;

          if (uid == null || !Number.isFinite(uid)) {
            console.warn('Could not extract userId from token. Falling back to form username.');
            this.handleAuthentication(token, expires, username);
            this.isAuthenticated = true;
            this.userAuthChanged(true);
            return this.injector.get(PermissionService).loadPermissions();
          }

          return this.fetchCanonicalUsername(uid, token).pipe(
            tap((canonicalFromApi /* string | null */) => {
              const canonical = canonicalFromApi ?? username;
              this.handleAuthentication(token, expires, canonical);
              this.isAuthenticated = true;
              this.userAuthChanged(true);
            }),
            switchMap(() => this.injector.get(PermissionService).loadPermissions()),
            catchError((err) => {
              console.warn('Failed to fetch canonical username from /ui/users/{id}, using form value', err);
              this.handleAuthentication(token, expires, username);
              this.isAuthenticated = true;
              this.userAuthChanged(true);
              return this.injector.get(PermissionService).loadPermissions();
            })
          );
        }),
        tap(() => {
          const redirectService = this.injector.get(LoginRedirectService);
          const redirectUrl = this.redirectUrl;
          const uid = this.getUserId(this.token);
          if (uid != null) {
            redirectService.handlePostLoginRedirect(String(uid), redirectUrl);
          } else {
            console.warn('No userId available for post-login redirect');
          }
          this.redirectUrl = '';
        }),
        map(() => void 0)
      );
  }

  get token(): string | null {
    const userData: AuthData | null = this.storage.getItem(AuthService.STORAGE_KEY);
    return userData ? userData._token : null;
  }

  private _authUser$ = new BehaviorSubject<AuthUser | null>(null);
  authUser$ = this._authUser$.asObservable();

  private decodeJwt<T = JwtPayload>(token: string): T | null {
    if (!token) return null;
    try {
      const b64 = token.split('.')[1];
      const norm = b64.replace(/-/g, '+').replace(/_/g, '/');
      const json = Buffer.from(norm, 'base64').toString('utf8');
      return JSON.parse(json) as T;
    } catch {
      return null;
    }
  }

  private getUserId(token: string | null): number | null {
    if (!token) return null;
    const p = this.decodeJwt<JwtPayload>(token);
    if (!p) return null;

    let id: number | null = null;

    if (typeof p.userId === 'number') {
      id = p.userId;
    } else if (typeof p.sub === 'number') {
      id = p.sub;
    } else if (typeof p.sub === 'string') {
      const n = Number(p.sub);
      id = Number.isFinite(n) ? n : null;
    }

    return id;
  }

  private getCanonicalUsernameFromJwt(token: string): string | null {
    const p = this.decodeJwt<JwtPayload>(token);
    return p?.username ?? p?.name ?? p?.user ?? null;
  }

  private fetchCanonicalUsername(userId: number, token: string): Observable<string | null> {
    const base = this.cs.getEndpoint();
    const url = `${base}/ui/users/${userId}`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    });

    return this.http
      .get<{
        data: {
          id: number | string;
          attributes: { name: string };
        };
      }>(url, { headers })
      .pipe(map((resp) => resp?.data?.attributes?.name ?? null));
  }

  get canonicalUsername(): string | null {
    const u = this._authUser$.value;
    if (u?.canonicalUsername) return u.canonicalUsername;

    const stored: AuthData | null = this.storage.getItem(AuthService.STORAGE_KEY);
    if (stored?._token) return this.getCanonicalUsernameFromJwt(stored._token);
    return null;
  }

  canonicalUsername$ = this.authUser$.pipe(
    map((u) => u?.canonicalUsername ?? this.canonicalUsername),
    distinctUntilChanged()
  );

  setUserLoggedIn(userLoggedIn: boolean) {
    this.userLoggedIn.next(userLoggedIn);
  }

  getUserLoggedIn(): Observable<boolean> {
    return this.userLoggedIn.asObservable();
  }

  /**
   * Exchanges the refresh cookie for a new access token.
   *
   * The cookie is HttpOnly and scoped to this one path, so it is never read here: the browser
   * attaches it and the backend answers with a rotated one. Calls share a single request, because
   * rotation makes each one consume the cookie it was sent with.
   *
   * @returns The refreshed session data.
   */
  refreshToken(): Observable<AuthData> {
    if (this.refreshInFlight$) {
      return this.refreshInFlight$;
    }

    this.refreshInFlight$ = this.http
      .post<AuthResponseData>(this.cs.getEndpoint() + this.endpoint + '/refresh', null, {
        withCredentials: true
      })
      .pipe(
        map((resData) => this.storeRefreshedSession(resData.token, +resData.expires)),
        finalize(() => {
          this.refreshInFlight$ = null;
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );

    return this.refreshInFlight$;
  }

  /**
   * Whether the stored access token is already past its expiry. A session with no token at all
   * counts as expired.
   */
  isAccessTokenExpired(): boolean {
    return this.millisecondsUntilExpiry() <= 0;
  }

  /**
   * Whether the stored access token expires soon enough that it should be renewed before being used
   * for another request.
   */
  isAccessTokenExpiring(): boolean {
    return this.millisecondsUntilExpiry() <= AuthService.REFRESH_LEAD_TIME_MS;
  }

  private millisecondsUntilExpiry(): number {
    const userData: AuthData | null = this.storage.getItem(AuthService.STORAGE_KEY);
    if (!userData?._token) {
      return 0;
    }
    return new Date(userData._expires).getTime() - Date.now();
  }

  /**
   * Renews the session shortly before the access token expires, so an active user never carries a
   * token the backend would reject. A failed renewal means the refresh cookie is gone too, which
   * only ends in logging out.
   *
   * @param expires - When the current access token stops being accepted.
   */
  private scheduleTokenRefresh(expires: Date): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const delay = Math.max(0, expires.getTime() - Date.now() - AuthService.REFRESH_LEAD_TIME_MS);
    this.refreshTimer = setTimeout(() => {
      this.refreshToken().subscribe({
        error: () => this.logOut()
      });
    }, delay);
  }

  logOut() {
    // The refresh cookie is HttpOnly, so only the backend can retire the session behind it
    this.revokeRefreshToken();

    this.user.next(null);
    this._authUser$.next(null);
    this.userId = null;
    this.isAuthenticated = false;
    this.logged.next(false);
    this.router.navigate(['/auth']);
    this.storage.removeItem(AuthService.STORAGE_KEY);
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    this.refreshTimer = null;
    this.refreshInFlight$ = null;

    // Delete cached permissions from storage
    const permissionService = this.injector.get(PermissionService);
    permissionService.clearPermissionCache();
  }

  /**
   * Asks the backend to end the session the refresh cookie belongs to. Sessions on other devices are
   * untouched. Failure is not surfaced: the local session is being torn down either way.
   */
  private revokeRefreshToken(): void {
    // logOut() also runs on paths where no session was ever established
    if (!this.storage.getItem(AuthService.STORAGE_KEY)) {
      return;
    }

    this.http.delete<void>(this.cs.getEndpoint() + this.endpoint + '/refresh', { withCredentials: true }).subscribe({
      error: (err) => console.warn('Failed to revoke the refresh token on the server', err)
    });
  }

  checkStatus() {
    const userData: AuthData | null = this.storage.getItem(AuthService.STORAGE_KEY);
    if (userData) {
      this.logged.next(true);
    } else {
      this.logged.next(false);
    }
  }

  private userAuthChanged(status: boolean): void {
    this.authChanged.emit(status);
  }

  private handleAuthentication(token: string, expiresEpochSec: number, usernameFromForm: string): void {
    const userId = this.getUserId(token) ?? 0;
    const canonicalUsername = this.getCanonicalUsernameFromJwt(token) ?? usernameFromForm;

    this.storeSession(token, new Date(expiresEpochSec * 1000), userId, canonicalUsername);
  }

  /**
   * Stores a renewed access token against the session it belongs to.
   *
   * A refreshed token carries no username claim, so the identity established at login is carried
   * over rather than rediscovered; only the token and its expiry actually change.
   *
   * @param token - The renewed access token.
   * @param expiresEpochSec - When the renewed token stops being accepted, in epoch seconds.
   * @returns The updated session data.
   */
  private storeRefreshedSession(token: string, expiresEpochSec: number): AuthData {
    const previous: AuthData | null = this.storage.getItem(AuthService.STORAGE_KEY);
    const userId = this.getUserId(token) ?? previous?.userId ?? 0;
    const canonicalUsername = this.getCanonicalUsernameFromJwt(token) ?? previous?.canonicalUsername ?? '';

    return this.storeSession(token, new Date(expiresEpochSec * 1000), userId, canonicalUsername);
  }

  /**
   * Publishes a session to every consumer: the observables components subscribe to, local storage,
   * and the timer that renews it before it lapses.
   *
   * @returns The stored session data.
   */
  private storeSession(token: string, expires: Date, userId: UserId, canonicalUsername: string): AuthData {
    this.userId = userId;

    const loadedUser = new AuthUser(token, expires, userId, canonicalUsername);
    this.user.next(loadedUser);
    this._authUser$.next(loadedUser);
    this.logged.next(true);
    this.isAuthenticated = true;

    const userData: AuthData = {
      _token: token,
      _expires: expires,
      userId,
      canonicalUsername
    };

    this.storage.setItem(AuthService.STORAGE_KEY, userData, 0);
    this.scheduleTokenRefresh(expires);

    return userData;
  }

  private handleError(errorRes: HttpErrorResponse): Observable<never> {
    return throwError(() => errorRes.message);
  }
}
