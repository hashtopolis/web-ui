import { Buffer } from 'buffer';

import { BehaviorSubject, Observable, ReplaySubject, Subject, switchMap, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Injector, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AuthData, AuthUser } from '@models/auth-user.model';

import { LoginRedirectService } from '@services/access/login-redirect.service';
import { PermissionService } from '@services/permission/permission.service';
import { ConfigService } from '@services/shared/config.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

export interface AuthResponseData {
  token: string;
  expires: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  static readonly STORAGE_KEY = 'userData';

  user = new BehaviorSubject<AuthData>(null);
  userId!: string;

  @Output() authChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  isAuthenticated = false;
  private logged = new ReplaySubject<boolean>(1);
  isLogged = this.logged.asObservable();
  redirectUrl = '';
  private userLoggedIn = new Subject<boolean>();
  private tokenExpiration: NodeJS.Timeout | null;
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
    const userData: AuthData = this.storage.getItem(AuthService.STORAGE_KEY);
    if (!userData) {
      return;
    }

    const loadedUser = new AuthUser(userData._token, new Date(userData._expires), userData._username);
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const tokenExpiration = new Date(userData._expires).getTime() - new Date().getTime();
      // this.autologOut(tokenExpiration);
      this.getRefreshToken(tokenExpiration);

      // Load permissions after restoring user
      const permissionService = this.injector.get(PermissionService);
      permissionService.loadPermissions().subscribe({
        next: () => {},
        error: (err) => {
          console.error('Failed to load permissions on autoLogin:', err);
        }
      });
    }
  }

  logIn(username: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        this.cs.getEndpoint() + this.endpoint + '/token',
        { username: username, password: password },
        {
          headers: new HttpHeaders({
            Authorization: 'Basic ' + window.btoa(username + ':' + password)
          })
        }
      )
      .pipe(
        catchError(this.handleError),
        switchMap((resData) => {
          this.handleAuthentication(resData.token, +resData.expires, username);
          this.isAuthenticated = true;
          this.userAuthChanged(true);
          const permissionService = this.injector.get(PermissionService);
          return permissionService.loadPermissions();
        }),
        tap(() => {
          const redirectService = this.injector.get(LoginRedirectService);
          const redirectUrl = this.redirectUrl;
          redirectService.handlePostLoginRedirect(this.userId, redirectUrl);
          this.redirectUrl = '';
        })
      );
  }

  get token(): string {
    const userData: AuthData = this.storage.getItem(AuthService.STORAGE_KEY);
    return userData ? userData._token : 'notoken';
  }

  private getUserId(token: string) {
    if (token == 'notoken') {
      return false;
    } else {
      const b64string = Buffer.from(token.split('.')[1], 'base64');
      return JSON.parse(b64string.toString()).userId;
    }
  }

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

  getRefreshToken(expirationDuration: number) {
    this.tokenExpiration = setTimeout(() => {
      const userData: AuthData = this.storage.getItem(AuthService.STORAGE_KEY);
      return this.http
        .post<AuthResponseData>(this.cs.getEndpoint() + this.endpoint + '/refresh', {
          headers: new HttpHeaders({
            Authorization: `Bearer ${userData._token}`
          })
        })
        .pipe(
          tap((response: AuthResponseData) => {
            if (response && response.token) {
              userData._token = response.token;
              userData._expires = new Date(response.expires * 1000);

              this.storage.setItem(AuthService.STORAGE_KEY, userData, 0);
            } else {
              this.logOut();
            }
          })
        );
    }, expirationDuration);
  }

  refreshToken() {
    const userData: AuthData = this.storage.getItem(AuthService.STORAGE_KEY);

    return this.http
      .post<AuthResponseData>(this.cs.getEndpoint() + this.endpoint + '/refresh', null, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${userData._token}`
        })
      })
      .pipe(
        tap((response: AuthResponseData) => {
          if (response && response.token) {
            const updatedUser: AuthData = {
              _token: response.token,
              _expires: new Date(response.expires * 1000),
              _username: userData._username
            };

            // Update BOTH in-memory and local storage
            this.user.next(updatedUser);
            this.storage.setItem(AuthService.STORAGE_KEY, updatedUser, 0);
          } else {
            this.logOut();
          }
        }),
        catchError((error) => {
          console.error('An error occurred:', error);
          return throwError(() => error);
        })
      );
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
    this.authChanged.emit(status); // Raise changed event
  }

  handleAuthentication(token: string, expires: number, username: string) {
    const userData = {
      _token: token,
      _expires: new Date(expires * 1000),
      _username: username
    };

    this.user.next(userData);
    this.logged.next(true);
    this.isAuthenticated = true;

    this.storage.setItem(AuthService.STORAGE_KEY, userData, 0);
    this.userId = this.getUserId(token);

    this.autologOut(expires); // Epoch time

    this.storage.setItem(AuthService.STORAGE_KEY, userData, 0);
    this.userId = this.getUserId(token);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error ocurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'INVALID_PASSWORD': //We can add easily more common errors but for security better dont give more hints
        errorMessage = 'Wrong username/password/OTP!';
        break;
    }
    return throwError(() => errorMessage);
  }
}
