import { BehaviorSubject, Observable, catchError, finalize, throwError } from 'rxjs';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { AuthService } from '../_services/access/auth.service';
import { ErrorModalComponent } from '../../shared/alert/error/error.component';
import { Injectable } from '@angular/core';
import { LoadingService } from '../_services/shared/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Injectable()
export class HttpResInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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
   * @param {HttpRequest<any>} req - The HTTP request that resulted in an error.
   * @param {HttpErrorResponse} error - The HTTP error response received.
   * @returns {Observable<never>} - An observable that errors out with the error message.
   */
  private handleError(req: HttpRequest<any>, error: HttpErrorResponse): Observable<never> {
    let errmsg = '';
    const status = error?.status || 0;

    if (error.status === 401) {
      errmsg = this.handleUnauthorizedError(req);
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
   * Handles unauthorized errors by checking if the token needs to be refreshed
   * or if the credentials need to be checked.
   *
   * @param {HttpRequest<any>} req - The HTTP request that resulted in an unauthorized error.
   * @returns {string} - A message indicating the action taken or needed.
   */
  private handleUnauthorizedError(req: HttpRequest<any>): string {
    if (!req.url.includes('/auth')) {
      const token = this.authService.token;
      const userData: { _expires: string } = JSON.parse(localStorage.getItem('userData') || '{}');
      if (token !== 'notoken' && new Date(userData._expires) < new Date(Date.now() - 60000)) {
        this.refreshToken(req);
        return 'Refreshing token...';
      } else {
        return `Check credentials.`;
      }
    } else {
      return `Token expired. Please log in again.`;
    }
  }

  /**
   * Refresh token
   *
   * @param {any} request -token request
   */
  private refreshToken(request: HttpRequest<any>): void {
    console.log('Refreshing token...');
    this.authService.refreshToken();
    window.location.reload();
  }

  /**
   * Extracts the IP address and port from a URL.
   *
   * @param {string} url - The URL to extract the IP address and port from.
   * @returns {string} - The extracted IP address and port in the format "hostname:port".
   */
  private extractIpAndPort(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${urlObj.hostname}:${urlObj.port}`;
    } catch (e) {
      return 'unknown IP and port';
    }
  }

  /**
   * Displays an error modal with the given status and message.
   *
   * @param {number} status - The HTTP status code of the error.
   * @param {string} message - The error message to display.
   */
  private displayErrorModal(status: number, message: string): void {
    this.dialog.open(ErrorModalComponent, {
      data: { status, message }
    });
  }
}
