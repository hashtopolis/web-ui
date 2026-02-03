import { Buffer } from 'buffer';

import { BehaviorSubject, Observable, ReplaySubject, Subject, switchMap, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, map, tap } from 'rxjs/operators';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Injector, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AuthData, AuthUser } from '@models/auth-user.model';
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
  private tokenExpiration: ReturnType<typeof setTimeout> | null = null;
  private endpoint = '/auth';

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
  autoLogin() {
    const raw = this.storage.getItem(AuthService.STORAGE_KEY);
    if (!raw) return;

    const userData = raw as StoredAuthData;

    const token: string = userData._token;
    const expires: Date = userData._expires instanceof Date ? userData._expires : new Date(userData._expires);

    const userId = typeof userData.userId === 'number' ? userData.userId : (this.getUserId(token) ?? 0);

    const canonicalUsername: string = userData.canonicalUsername ?? this.getCanonicalUsernameFromJwt(token) ?? '';

    const loadedUser = new AuthUser(token, expires, userId, canonicalUsername);

    if (loadedUser._token && expires > new Date()) {
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

      const tokenExpiration = expires.getTime() - Date.now();
      this.autologOut(tokenExpiration);

      const permissionService = this.injector.get(PermissionService);
      permissionService.loadPermissions().subscribe({
        next: () => {},
        error: (err) => console.error('Failed to load permissions on autoLogin:', err)
      });
    } else {
      this.logOut();
    }
  }

  logIn(username: string, password: string) {
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
          })
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
        })
      );
  }

  get token(): string {
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

  private getUserId(token: string): number | null {
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

  private fetchCanonicalUsername(userId: number, token: string) {
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

  // With autologOut we use only the expiration date of the bearer token, approx. 2 hours
  autologOut(expirationDuration: number) {
    this.tokenExpiration = setTimeout(() => {
      this.logOut();
    }, expirationDuration);
  }

  logOut() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    this.storage.removeItem(AuthService.STORAGE_KEY);
    if (this.tokenExpiration) {
      clearTimeout(this.tokenExpiration);
    }
    this.tokenExpiration = null;

    // Delete cached permissions from storage
    const permissionService = this.injector.get(PermissionService);
    permissionService.clearPermissionCache();
  }

  checkStatus() {
    const userData: AuthData = this.storage.getItem(AuthService.STORAGE_KEY);
    if (userData) {
      this.logged.next(true);
    } else {
      this.logged.next(false);
    }
  }

  private userAuthChanged(status: boolean) {
    this.authChanged.emit(status);
  }

  private handleAuthentication(token: string, expiresEpochSec: number, usernameFromForm: string) {
    const expires = new Date(expiresEpochSec * 1000);

    const userId = this.getUserId(token) ?? 0;
    const canonicalUsername = this.getCanonicalUsernameFromJwt(token) ?? usernameFromForm;
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

    const tokenExpiration = expires.getTime() - Date.now();
    this.autologOut(tokenExpiration);
  }

  private handleError(errorRes: HttpErrorResponse) {
    return throwError(() => errorRes.message);
  }
}
