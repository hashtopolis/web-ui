import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, Observable, ReplaySubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Buffer } from 'buffer';

import { ConfigService } from "../shared/config.service";
import { UserData } from '../../_models/auth-user.model';
import { LocalStorageService } from "../storage/local-storage.service";

export interface AuthResponseData {
  token: string;
  expires: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  static readonly STORAGE_KEY = 'userData'

  private tokenExpirationTimout: any;
  private endpoint = '/auth';

  userId!: number
  redirectUrl = ''
  isAuthenticated = false;

  authenticationStatus$ = new ReplaySubject<boolean>(1);
  userLoggedIn$ = new Subject<boolean>();
  user$ = new BehaviorSubject<UserData | null>(null);

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private storage: LocalStorageService<UserData>,
  ) {
    this.initUser();
  }

  private initUser() {
    console.log('initUser')
    this.userLoggedIn$.next(false);
    if (this.authenticationStatus$) {
      this.checkAuthenticationStatus();
    }
  }

  public autoLogin(): void {
    if (!this.userData) {
      return;
    }

    const now = new Date().getTime()
    const exp = new Date(this.userData._expires).getTime()

    if (this.userData._expires && now < exp) {
      this.user$.next(this.userData);
      const expirationDuration = new Date(this.userData._expires).getTime() - new Date().getTime();
      this.getRefreshToken(expirationDuration);
    }
  }

  public logIn(username: string, password: string): Observable<any> {
    return this.http.post<AuthResponseData>(
      `${this.configService.getEndpoint()}${this.endpoint}/token`,
      { username, password },
      {
        headers: new HttpHeaders({
          'Authorization': `Basic ${window.btoa(username + ':' + password)}`
        })
      }
    ).pipe(
      catchError(this.handleError),
      tap(response => {
        this.setAuthenticationData(response.token, +response.expires, username);
        this.isAuthenticated = true;
      })
    );
  }

  public get token(): string {
    return this.userData ? this.userData._token : 'notoken';
  }

  private getUserId(token: string): number | undefined {
    if (token == 'notoken') {
      return undefined;
    } else {
      const b64string = Buffer.from(token.split('.')[1], 'base64');
      return parseInt(JSON.parse(b64string.toString()).userId);
    }
  }

  public setUserLoggedIn(userLoggedIn: boolean): void {
    this.userLoggedIn$.next(userLoggedIn);
  }

  public getUserLoggedIn(): Observable<boolean> {
    return this.userLoggedIn$.asObservable();
  }

  public autologOut(timeoutMs: number): void {
    this.tokenExpirationTimout = setTimeout(() => {
      this.clearAuthenticationData();
    }, timeoutMs);
  }

  public getRefreshToken(timeoutMs: number): void {
    this.tokenExpirationTimout = setTimeout(() => {
      if (this.userData) {
        this.requestRefreshToken().subscribe((response: AuthResponseData) => {
          if (response && response.token) {
            const expirationMs = new Date(response.expires * 1000);
            this.storage.setItem('userData', {
              _token: response.token,
              _expires: expirationMs,
              _username: this.userData._username
            }, 0)
          } else {
            this.clearAuthenticationData();
          }
        })
      }
    }, timeoutMs);
  }

  private requestRefreshToken(): Observable<AuthResponseData> {
    const httpHeaders = { headers: new HttpHeaders({ Authorization: `Bearer ${this.userData ? this.userData._token : ''}` }) }
    const apiUrl = `${this.configService.getEndpoint()}${this.endpoint}/refresh`

    return this.http.post<AuthResponseData>(apiUrl, {}, httpHeaders)
  }

  public refreshToken(): Observable<any> {
    return this.requestRefreshToken()
      .pipe(
        tap((response: AuthResponseData) => {
          if (response && response.token) {
            const expirationDate = new Date(response.expires * 1000);
            this.storage.setItem('userData', {
              _token: response.token,
              _expires: expirationDate,
              _username: this.userData._username
            }, 0)
          } else {
            this.clearAuthenticationData();
          }
        }),
        catchError((error) => {
          // Handle the error here
          console.error('An error occurred:', error);
          return throwError(() => error); // Rethrow the error for further handling if needed
        })
      );
  }

  public clearAuthenticationData(): void {
    this.user$.next(null);
    this.isAuthenticated = false;
    this.storage.removeItem('userData');
    if (this.tokenExpirationTimout) {
      clearTimeout(this.tokenExpirationTimout);
    }
    this.tokenExpirationTimout = null;
  }

  get userData(): UserData {
    return this.storage.getItem(AuthService.STORAGE_KEY);
  }

  checkAuthenticationStatus(): void {
    console.log()
    if (this.userData) {
      this.authenticationStatus$.next(true);
      this.userId = this.getUserId(this.userData._token)
    } else {
      this.authenticationStatus$.next(false);
    }
  }

  private setAuthenticationData(token: string, expires: number, username: string): void {
    const userData = {
      _token: token,
      _expires: new Date(expires * 1000),
      _username: username
    };
    this.user$.next(userData);
    this.isAuthenticated = true;
    this.storage.setItem('userData', userData, 0)
    this.userId = this.getUserId(token);
  }

  private handleError(errorRes: HttpErrorResponse): Observable<any> {
    let errorMessage = 'An unknown error occurred!';
    if (errorRes.error && errorRes.error.error) {
      switch (errorRes.error.error.message) {
        case 'INVALID_PASSWORD':
          errorMessage = 'Wrong username/password/OTP!';
          break;
      }
    }
    return throwError(() => errorMessage);
  }
}
