import { Observable, catchError, finalize, throwError } from 'rxjs';

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '@services/access/auth.service';
import { AlertService } from '@services/shared/alert.service';
import { LoadingService } from '@services/shared/loading.service';

import { ErrorModalComponent } from '@src/app/shared/alert/error/error.component';

@Injectable()
export class HttpResInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private loadingService = inject(LoadingService);
  private alertService = inject(AlertService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // If request contains this header, don't show modal/snackbar for errors
    const skipDialog: boolean = req.headers.has('X-Skip-Error-Dialog');

    this.loadingService.handleRequest('plus');
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (skipDialog) {
          return throwError(() => error);
        }
        return this.handleError(req, error);
      }),
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
    let showAlert: boolean = false;

    if (error.status === 401) {
      errmsg = 'Invalid credentials. Please try again.';
    } else if (error.status === 403) {
      if (error.error?.title) {
        errmsg = error.error.title;
      } else {
        errmsg = `You don't have permissions. Please contact your Administrator.`;
      }
      showAlert = true;
    } else if (error.status === 404 && !req.url.includes('config.json')) {
      errmsg = `The requested URL was not found.`;
    } else if (error.status === 409 && req.url.includes('crackertypes')) {
      errmsg = error.error.title;
      showAlert = true;
    } else if (error.status === 0) {
      const frontendBaseURL = window.location.href.split('/').slice(0, 3).join('/');
      errmsg = `Network error. Please verify the IP address (${this.extractIpAndPort(
        req.url
      )}) and try again. Also the following options must be set in the .env file: HASHTOPOLIS_APIV2_ENABLE=1 and HASHTOPOLIS_FRONTEND_URLS must include the used Hashtopolis frontend: ${frontendBaseURL} `;
    } else {
      errmsg = error.error?.title || 'An unknown error occurred.';
    }

    if (showAlert) {
      this.alertService.showErrorMessage(errmsg);
    } else {
      this.displayErrorModal(status, errmsg);
    }

    // Re-throw the original HttpErrorResponse so callers/components
    // can inspect the status and perform routing (e.g. navigate to /not-found).
    return throwError(() => error);
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
