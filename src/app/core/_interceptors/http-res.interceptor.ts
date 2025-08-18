import { Observable, catchError, finalize, throwError } from 'rxjs';

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '@services/access/auth.service';
import { LoadingService } from '@services/shared/loading.service';

import { ErrorModalComponent } from '@src/app/shared/alert/error/error.component';

@Injectable()
export class HttpResInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private loadingService: LoadingService
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loadingService.handleRequest('plus');
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(req, error)),
      finalize(() => this.loadingService.handleRequest())
    );
  }

  /**
   * Handles HTTP errors by categorizing them and setting appropriate error messages.
   * Displays an error modal with the message and status code.
   *
   * @param req The HTTP request that resulted in an error.
   * @param error The HTTP error response received.
   * @returns An observable that errors out with the error message.
   */
  private handleError(req: HttpRequest<unknown>, error: HttpErrorResponse): Observable<never> {
    let errmsg = '';
    const status = error?.status || 0;

    if (error.status === 401) {
      errmsg = 'Invalid credentials. Please try again.';
    } else if (error.status === 403) {
      errmsg = `You don't have permissions. Please contact your Administrator.`;
    } else if (error.status === 404 && !req.url.includes('config.json')) {
      errmsg = `The requested URL was not found.`;
    } else if (error.status === 0) {
      errmsg = `Network error. Please verify the IP address (${this.extractIpAndPort(
        req.url
      )}) and try again. Note: APIv2 HASHTOPOLIS_APIV2_ENABLE=1 needs to be enabled. `;
    } else {
      errmsg = error.error?.title || 'An unknown error occurred.';
    }

    this.displayErrorModal(status, errmsg);
    return throwError(() => new Error(errmsg));
  }

  /**
   * Extracts the IP address and port from a URL.
   *
   * @param url The URL to extract the IP address and port from.
   * @returns The extracted IP address and port in the format "hostname:port".
   */
  private extractIpAndPort(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${urlObj.hostname}:${urlObj.port}`;
    } catch {
      return 'unknown IP and port';
    }
  }

  /**
   * Displays an error modal with the given status and message.
   *
   * @param status  The HTTP status code of the error.
   * @param message The error message to display.
   */
  private displayErrorModal(status: number, message: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: { status, message }
    });
  }
}
