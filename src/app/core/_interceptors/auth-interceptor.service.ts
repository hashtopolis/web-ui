import { HttpStatus } from '@constants/http.config';
import { Observable, switchMap, take, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthData } from '@models/auth-user.model';

import { AuthService } from '@services/access/auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  /**
   * Attaches the access token to outgoing requests and keeps that token usable.
   *
   * The token's expiry is known locally, so a token about to lapse is renewed *before* the request
   * goes out rather than after the backend has rejected it: no wasted round-trip, and no error the
   * user could see. The retry below is the safety net for the cases local expiry cannot predict,
   * such as a session the backend revoked or a clock that disagrees with the server's.
   *
   * @param req - The outgoing HTTP request.
   * @param next - The HTTP handler to forward the request to.
   * @returns Observable of the HTTP event stream.
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip the auth endpoints themselves, otherwise renewing a token would recurse
    if (this.isAuthRequest(req)) {
      return next.handle(req);
    }

    return this.authService.user.pipe(
      take(1),
      switchMap((user: AuthData | null) => {
        if (!user) {
          // No logged-in user, forward request without auth
          return next.handle(req);
        }

        if (this.authService.isAccessTokenExpiring()) {
          return this.refreshAndSend(req, next);
        }

        return next.handle(this.withBearer(req, user._token)).pipe(
          catchError((error: HttpErrorResponse) => {
            if (!this.isAuthFailure(error)) {
              return throwError(() => error);
            }
            return this.refreshAndSend(req, next, error);
          })
        );
      })
    );
  }

  /**
   * Renews the session and sends the request with the token that came back. A failed renewal means
   * the refresh cookie is gone as well, so the session ends here.
   *
   * @param originalError - The failure that triggered the retry, rethrown when the renewal fails so
   *   callers see the error their request actually produced.
   */
  private refreshAndSend(
    req: HttpRequest<unknown>,
    next: HttpHandler,
    originalError?: HttpErrorResponse
  ): Observable<HttpEvent<unknown>> {
    return this.authService.refreshToken().pipe(
      catchError((refreshError) => {
        this.authService.logOut();
        return throwError(() => originalError ?? refreshError);
      }),
      switchMap((refreshed: AuthData) => next.handle(this.withBearer(req, refreshed._token)))
    );
  }

  /**
   * Whether a failed request is worth retrying with a renewed token.
   *
   * A 401 is the explicit signal. The fallback covers the backend answering an expired access token
   * with a status of its own choosing: rather than matching on that status or its message, ask the
   * token whether it could have been accepted at all.
   */
  private isAuthFailure(error: HttpErrorResponse): boolean {
    return error.status === HttpStatus.UNAUTHORIZED || this.authService.isAccessTokenExpired();
  }

  private isAuthRequest(req: HttpRequest<unknown>): boolean {
    return req.url.includes('/auth');
  }

  private withBearer(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
