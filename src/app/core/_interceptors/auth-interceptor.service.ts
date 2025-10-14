import { Observable, switchMap, take } from 'rxjs';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthUser } from '@models/auth-user.model';

import { AuthService } from '@services/access/auth.service';
import { CheckTokenService } from '@services/access/checktoken.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private checkTokenService: CheckTokenService
  ) {}

  /**
   * Intercepts HTTP requests and adds authentication token to the request headers.
   * If the token is expired, logs out immediately.
   * If the token is about to expire, attempts a refresh (if implemented) before sending the request.
   *
   * @param req - The outgoing HTTP request.
   * @param next - The HTTP handler to forward the request to.
   * @returns Observable of the HTTP event stream.
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip token checks for auth requests to avoid loops
    if (req.url.includes('/auth')) {
      return next.handle(req);
    }

    // Check token validity before doing anything else (logs out if expired)
    this.checkTokenService.checkTokenValidity();

    return this.authService.user.pipe(
      take(1),
      switchMap((user: AuthUser) => {
        if (!user) {
          // No logged-in user, forward request without auth
          return next.handle(req);
        } else {
          // Token is valid → just forward request with token
          const modifiedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${user._token}`
            }
          });
          return next.handle(modifiedReq);
        }
      })
    );
  }
}
