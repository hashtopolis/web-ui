import { HttpHeaderName } from '@constants/http.config';
import { firstValueFrom, of, throwError } from 'rxjs';

import { HttpErrorResponse, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '@services/access/auth.service';
import { AlertService } from '@services/shared/alert.service';

import { HttpResInterceptor } from '@src/app/core/_interceptors/http-res.interceptor';
import { ErrorModalComponent } from '@src/app/shared/alert/error/error.component';

describe('HttpResInterceptor', () => {
  let interceptor: HttpResInterceptor;
  let auth: { token: string | null; isAccessTokenExpired: ReturnType<typeof vi.fn> };
  let open: ReturnType<typeof vi.fn>;
  let showErrorMessage: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    auth = { token: null, isAccessTokenExpired: vi.fn().mockName('isAccessTokenExpired').mockReturnValue(false) };
    open = vi.fn().mockName('open');
    showErrorMessage = vi.fn().mockName('showErrorMessage');
    TestBed.configureTestingModule({
      providers: [
        HttpResInterceptor,
        { provide: AuthService, useValue: auth },
        { provide: MatDialog, useValue: { open } },
        { provide: AlertService, useValue: { showErrorMessage } }
      ]
    });
    interceptor = TestBed.inject(HttpResInterceptor);
  });

  async function fail(status: number, url: string, body: unknown = {}, skip = false): Promise<void> {
    const error = new HttpErrorResponse({ status, error: body });
    const request = new HttpRequest('GET', url);
    const actualRequest = skip
      ? request.clone({ setHeaders: { [HttpHeaderName.SKIP_ERROR_DIALOG]: 'true' } })
      : request;
    const handler: HttpHandler = {
      handle: vi
        .fn()
        .mockName('handle')
        .mockReturnValue(throwError(() => error))
    };
    await expect(firstValueFrom(interceptor.intercept(actualRequest, handler))).rejects.toBe(error);
    expect(handler.handle).toHaveBeenCalledExactlyOnceWith(actualRequest);
  }

  it('passes successful responses through', async () => {
    const response = new HttpResponse({ body: { ok: true } });
    const request = new HttpRequest('GET', '/data');
    const handler: HttpHandler = { handle: vi.fn().mockName('handle').mockReturnValue(of(response)) };
    await expect(firstValueFrom(interceptor.intercept(request, handler))).resolves.toBe(response);
    expect(handler.handle).toHaveBeenCalledExactlyOnceWith(request);
    expect(open).not.toHaveBeenCalled();
  });

  it('suppresses errors when the skip header is present', async () => {
    await fail(500, '/data', {}, true);
    expect(open).not.toHaveBeenCalled();
    expect(showErrorMessage).not.toHaveBeenCalled();
  });

  it.each([401, 500])('suppresses recoverable status %s with a stored token', async (status) => {
    auth.token = 'token';
    auth.isAccessTokenExpired.mockReturnValue(true);
    await fail(status, '/data');
    expect(open).not.toHaveBeenCalled();
    expect(showErrorMessage).not.toHaveBeenCalled();
  });

  it('reports a non-auth error with a valid stored token', async () => {
    auth.token = 'token';
    await fail(500, '/data');
    expect(open).toHaveBeenCalledExactlyOnceWith(ErrorModalComponent, {
      data: { status: 500, message: 'An unknown error occurred.' }
    });
  });

  it.each([
    [401, '/data', {}, 'Invalid credentials. Please try again.'],
    [404, '/data', {}, 'The requested URL was not found.'],
    [404, '/config.json', { title: 'Missing configuration' }, 'Missing configuration'],
    [500, '/data', { title: 'Server failure' }, 'Server failure'],
    [500, '/data', {}, 'An unknown error occurred.'],
    [
      0,
      'http://127.0.0.1:8080/data',
      {},
      'Network error. Please verify the IP address (127.0.0.1:8080) and try again.'
    ],
    [0, '/data', {}, 'Network error. Please verify the IP address (unknown IP and port) and try again.']
  ])('opens a modal for status %s and URL %s', async (status, url, body, message) => {
    await fail(status, url, body);
    expect(open).toHaveBeenCalledExactlyOnceWith(ErrorModalComponent, { data: { status, message } });
    expect(showErrorMessage).not.toHaveBeenCalled();
  });

  it.each([
    [403, '/data', { title: 'Denied' }, 'Denied'],
    [403, '/data', {}, "You don't have permissions. Please contact your Administrator."],
    [409, '/crackertypes', { title: 'Already exists' }, 'Already exists']
  ])('shows an alert for status %s and URL %s', async (status, url, body, message) => {
    await fail(status, url, body);
    expect(showErrorMessage).toHaveBeenCalledExactlyOnceWith(message);
    expect(open).not.toHaveBeenCalled();
  });
});
