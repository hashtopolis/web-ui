import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, take } from 'rxjs';

import { AuthService } from '../_services/access/auth.service';
import { AuthUser } from '../_models/auth-user.model';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  /**
   * Intercepts HTTP requests and adds authentication token to the request headers.
   * If the token is expired, it triggers a token refresh before proceeding with the request.
   *
   * @param {HttpRequest<any>} req - The outgoing HTTP request.
   * @param {HttpHandler} next - The HTTP handler to forward the request to.
   * @returns {Observable<HttpEvent<any>>} - An observable of the HTTP event stream.
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      switchMap((user: AuthUser) => {
        if (!user) {
          // If no user is logged in, just forward the request as is.
          return next.handle(req);
        }

        const now = new Date().getTime();
        const exp = new Date(user._expires).getTime();

        if (now >= exp) {
          // If the token is expired, refresh it before proceeding with the request.
          return this.authService.refreshToken().pipe(
            switchMap(() => {
              // After refreshing the token, clone the request with the updated token.
              const updatedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${this.authService.token}`
                }
              });
              return next.handle(updatedReq);
            })
          );
        } else {
          // If the token is still valid, just include it in the request headers.
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
