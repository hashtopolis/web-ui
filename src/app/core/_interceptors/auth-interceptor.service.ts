import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, take } from 'rxjs';

import { AuthService } from '../_services/access/auth.service';
import { User, UserData } from '../_models/auth-user.model';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user: User) => {
        if (!user) {
          return next.handle(req);
        }
        const now = new Date().getTime();
        const exp = new Date(user._expires).getTime();
        const modifiedReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${
              user._expires && now < exp ? user._token : ''
            }`
          }
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
