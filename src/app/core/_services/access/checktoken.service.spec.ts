import { of, throwError } from 'rxjs';
import type { MockedObject } from 'vitest';

import { TestBed } from '@angular/core/testing';

import type { AuthData } from '@models/auth-user.model';

import { AuthService } from '@services/access/auth.service';
import { CheckTokenService } from '@services/access/checktoken.service';
import { AlertService } from '@services/shared/alert.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

describe('CheckTokenService', () => {
  let service: CheckTokenService;
  let authService: MockedObject<AuthService>;
  let storage: MockedObject<LocalStorageService<AuthData>>;
  let alertService: MockedObject<AlertService>;

  beforeEach(() => {
    authService = {
      isAccessTokenExpiring: vi.fn().mockName('AuthService.isAccessTokenExpiring'),
      refreshToken: vi.fn().mockName('AuthService.refreshToken'),
      logOut: vi.fn().mockName('AuthService.logOut')
    } as MockedObject<AuthService>;
    storage = { getItem: vi.fn().mockName('LocalStorageService.getItem') } as MockedObject<
      LocalStorageService<AuthData>
    >;
    alertService = { showInfoMessage: vi.fn().mockName('AlertService.showInfoMessage') } as MockedObject<AlertService>;

    TestBed.configureTestingModule({
      providers: [
        CheckTokenService,
        { provide: AuthService, useValue: authService },
        { provide: LocalStorageService, useValue: storage },
        { provide: AlertService, useValue: alertService }
      ]
    });
    service = TestBed.inject(CheckTokenService);
  });

  it('checks token validity when the document becomes visible', () => {
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
    storage.getItem.mockReturnValue(null);

    document.dispatchEvent(new Event('visibilitychange'));

    expect(storage.getItem).toHaveBeenCalledExactlyOnceWith(AuthService.STORAGE_KEY);
  });

  it('does not check token validity while the document is hidden', () => {
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');

    document.dispatchEvent(new Event('visibilitychange'));

    expect(storage.getItem).not.toHaveBeenCalled();
  });

  it('does not check expiry or refresh when there is no stored user', () => {
    storage.getItem.mockReturnValue(null);

    service.checkTokenValidity();

    expect(storage.getItem).toHaveBeenCalledExactlyOnceWith(AuthService.STORAGE_KEY);
    expect(authService.isAccessTokenExpiring).not.toHaveBeenCalled();
    expect(authService.refreshToken).not.toHaveBeenCalled();
  });

  it('does not refresh when the access token is not expiring', () => {
    storage.getItem.mockReturnValue({
      _expires: new Date('2030-01-01T00:00:00Z'),
      _token: 'access-token',
      userId: 1,
      canonicalUsername: 'user'
    });
    authService.isAccessTokenExpiring.mockReturnValue(false);

    service.checkTokenValidity();

    expect(authService.isAccessTokenExpiring).toHaveBeenCalledExactlyOnceWith();
    expect(authService.refreshToken).not.toHaveBeenCalled();
  });

  it('refreshes an expiring token and logs out with an informational alert on failure', () => {
    storage.getItem.mockReturnValue({
      _expires: new Date('2030-01-01T00:00:00Z'),
      _token: 'access-token',
      userId: 1,
      canonicalUsername: 'user'
    });
    authService.isAccessTokenExpiring.mockReturnValue(true);
    authService.refreshToken.mockReturnValue(throwError(() => new Error('refresh failed')));

    service.checkTokenValidity();

    expect(authService.refreshToken).toHaveBeenCalledExactlyOnceWith();
    expect(alertService.showInfoMessage).toHaveBeenCalledExactlyOnceWith('Session expired, please log in again.');
    expect(authService.logOut).toHaveBeenCalledExactlyOnceWith();
  });

  it('does not log out when refresh succeeds', () => {
    const authData: AuthData = {
      _expires: new Date('2030-01-01T00:00:00Z'),
      _token: 'refreshed-token',
      userId: 1,
      canonicalUsername: 'user'
    };
    storage.getItem.mockReturnValue(authData);
    authService.isAccessTokenExpiring.mockReturnValue(true);
    authService.refreshToken.mockReturnValue(of(authData));

    service.checkTokenValidity();

    expect(authService.refreshToken).toHaveBeenCalledExactlyOnceWith();
    expect(alertService.showInfoMessage).not.toHaveBeenCalled();
    expect(authService.logOut).not.toHaveBeenCalled();
  });
});
