import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  retry,
  throwError
} from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ErrorModalComponent } from '../../shared/alert/error/error.component';
import { LoadingService } from '../_services/shared/loading.service';
import { AuthService } from '../_services/access/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class HttpResInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    public authService: AuthService,
    private dialog: MatDialog,
    public ls: LoadingService,
    private router: Router
  ) {}

  modalRef = null;
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.ls.handleRequest('plus');
    return next.handle(req).pipe(
      retry(1),
      finalize(this.finalize.bind(this)),
      catchError((error: HttpErrorResponse) => {
        // Inside the catchError block
        let errmsg = '';
        let status = 0;

        if (error.status === 401) {
          if (!req.url.includes('/auth')) {
            const token = this.authService.token;
            console.log(token);
            const userData: { _expires: string } = JSON.parse(
              localStorage.getItem('userData')
            );
            console.log('Token expired' + userData);
            if (
              token !== 'notoken' &&
              new Date(userData._expires) < new Date(Date.now() - 60000)
            ) {
              this.isRefresh(req);
            } else {
              errmsg = `${error.error.title}`;
              status = error?.status || 0;
            }
          } else {
            errmsg = `${error.error.title}`;
            status = error?.status || 0;
          }
        } else if (error.status === 403) {
          errmsg = `You don't have permissions. Please contact your Administrator.`;
          status = error?.status || 0;
        } else if (error.status === 404 && !req.url.includes('config.json')) {
          errmsg = `The requested URL was not found.`;
          status = error?.status || 0;
        } else {
          errmsg = error.error.exception[0].message;
          status = error?.status || 0;
        }
        console.log(errmsg);
        if (errmsg.toLowerCase().includes('token not')) {
          // Redirect to the login page
          console.log('should be reloading page');
          // this.router.navigate(['/login']); // Adjust the route accordingly
          window.location.reload();
        } else {
          // Display error modal for other cases
          this.modalRef = this.dialog.open(ErrorModalComponent, {
            data: { status, message: errmsg }
          });
        }

        return throwError(() => errmsg);
      })
    );
  }

  finalize = (): void => this.ls.handleRequest();

  isNetworkError(errorObject) {
    return (
      errorObject.message === 'net::ERR_INTERNET_DISCONNECTED' ||
      errorObject.message === 'net::ERR_PROXY_CONNECTION_FAILED' ||
      errorObject.message === 'net::ERR_PROXY_CONNECTION_FAILED' ||
      errorObject.message === 'net::ERR_CONNECTION_TIMED_OUT' ||
      errorObject.message === 'net::ERR_CONNECTION_RESET' ||
      errorObject.message === 'net::ERR_CONNECTION_CLOSE' ||
      errorObject.message === 'net::ERR_UNKNOWN_PROTOCOL' ||
      errorObject.message === 'net::ERR_SLOW_CONNECTION' ||
      errorObject.message === 'net::ERR_FAILED' ||
      errorObject.message === 'net::ERR_NAME_NOT_RESOLVED'
    );
  }

  isRefresh(request: HttpRequest<any>) {
    console.log('Refreshing token...');
    this.authService.refreshToken();
    // this.router.navigate([request]);
    window.location.reload();
  }
}
