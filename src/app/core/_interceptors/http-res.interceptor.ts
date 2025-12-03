// http-res.interceptor.ts
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AlertService } from '@services/shared/alert.service';

@Injectable()
export class HttpResInterceptor implements HttpInterceptor {
  constructor(private alerts: AlertService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const skipDialog: boolean = req.headers.has('X-Skip-Error-Dialog');

    return next.handle(req).pipe(
      catchError((err: unknown) => {
        if (err instanceof HttpErrorResponse) {
          if (!skipDialog) {
            const msg = this.mapErrorMessage(err);
            this.alerts.showErrorMessage(msg);
          }
        }
        return throwError(() => err);
      })
    );
  }

  private mapErrorMessage(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'Network error. Please check your connection.';
    }

    const backendMessage =
      typeof err.error === 'string'
        ? err.error
        : typeof (err.error as { message?: unknown })?.message === 'string'
          ? String((err.error as { message?: unknown }).message)
          : undefined;

    switch (err.status) {
      case 400:
        return backendMessage ?? 'Bad request.';
      case 401:
        return backendMessage ?? 'Unauthorized. Please sign in again.';
      case 403:
        return backendMessage ?? 'Forbidden. You do not have access.';
      case 404:
        return backendMessage ?? 'The requested resource was not found.';
      case 409:
        return backendMessage ?? 'Conflict. The resource was modified elsewhere.';
      case 422:
        return backendMessage ?? 'Unprocessable entity. Please check your input.';
      default:
        if (err.status >= 500) {
          return backendMessage ?? 'Server error. Please try again later.';
        }
        return backendMessage ?? err.message ?? 'Unexpected error occurred.';
    }
  }
}
