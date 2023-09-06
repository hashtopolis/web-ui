import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, retry, throwError, catchError, finalize } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ErrorModalComponent } from '../../shared/alert/error/error.component';
import { LoadingService } from '../_services/shared/loading.service';

@Injectable()
export class HttpResInterceptor implements HttpInterceptor{

  constructor(
    private modalService: NgbModal,
    public ls: LoadingService,
    private router: Router,
    ) {}

    modalRef = null;
    intercept(req: HttpRequest<any>, next: HttpHandler):
      Observable<HttpEvent<any>> {
        this.ls.handleRequest('plus');
        return next.handle(req)
          .pipe(
            retry(1),
            finalize(this.finalize.bind(this)),
            catchError((error: HttpErrorResponse) => {
              let errmsg= '';
              if (error.error instanceof ErrorEvent) {
                const err = error?.error.message || 'Unknown API error';
                errmsg = `Client Side Error: ${err}`;
              }
              else {
                if(error.status === 0){
                   alert(`Unable to Connect to the Server: `+error.message);
                }
                if(error.status === 401){
                  errmsg = `${error.error.title}`;
                }
                if(error.status === 403){
                  errmsg = `You don't have permissions. Please contact your Administrator.`;
                }
                if(error.status === 404){
                  errmsg = `The requested URL was not found.`;
                }
                // if(error.status !== 404 && error.status !== 403 && error.status !== 401 && error.status >= 300){
                //   this.router.navigate(['error']);
                // }
                else{
                  errmsg = error.error.exception[0].message;
                }
              }
              this.modalRef = this.modalService.open(ErrorModalComponent);
              this.modalRef.componentInstance.status = error?.status;
              this.modalRef.componentInstance.message = errmsg;
              return throwError(() => errmsg);
            })
        )
    }

    finalize = (): void => this.ls.handleRequest();

    isNetworkError(errorObject) {
      return errorObject.message === "net::ERR_INTERNET_DISCONNECTED" ||
          errorObject.message === "net::ERR_PROXY_CONNECTION_FAILED" ||
          errorObject.message === "net::ERR_PROXY_CONNECTION_FAILED" ||
          errorObject.message === "net::ERR_CONNECTION_TIMED_OUT" ||
          errorObject.message === "net::ERR_CONNECTION_RESET" ||
          errorObject.message === "net::ERR_CONNECTION_CLOSE" ||
          errorObject.message === "net::ERR_UNKNOWN_PROTOCOL" ||
          errorObject.message === "net::ERR_SLOW_CONNECTION" ||
          errorObject.message === "net::ERR_NAME_NOT_RESOLVED" ;
    }
}
