import { Injectable } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { take, exhaustMap } from 'rxjs';
import { AuthService } from '../_services/access/auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
    constructor(private authService: AuthService){}
    intercept(req: HttpRequest<any>, next: HttpHandler){
        return this.authService.user.pipe(
            take(1),
            exhaustMap(user => {
                if(!user){
                    return next.handle(req);
                }
                const modifiedReq = req.clone({
                  // // Interceptor using Params instead of header authentification
                  //const modifiedReq = req.clone({
                  //   params: new HttpParams().set('auth', user.token)
                  //});
                  setHeaders: {
                    Authorization: `Bearer ${user.token}`  //Use this one as soon as token is fixed
                  }
                });
                return next.handle(modifiedReq);
            }));
    }
}

