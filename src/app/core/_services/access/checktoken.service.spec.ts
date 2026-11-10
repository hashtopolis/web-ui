import { of, throwError } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { AuthService } from '@services/access/auth.service';
import { CheckTokenService } from '@services/access/checktoken.service';
import { AlertService } from '@services/shared/alert.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

describe('CheckTokenService', () => {
  let service: CheckTokenService;
  let authService: {
    isAccessTokenExpiring: ReturnType<typeof vi.fn>;
    refreshToken: ReturnType<typeof vi.fn>;
    logOut: ReturnType<typeof vi.fn>;
  };
  let localStorage: { getItem: ReturnType<typeof vi.fn> };
  let alertService: { showInfoMessage: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authService = {
      isAccessTokenExpiring: vi.fn().mockName('AuthService.isAccessTokenExpiring'),
      refreshToken: vi.fn().mockName('AuthService.refreshToken'),
      logOut: vi.fn().mockName('AuthService.logOut')
    };
    localStorage = { getItem: vi.fn().mockName('LocalStorageService.getItem') };
    alertService = { showInfoMessage: vi.fn().mockName('AlertService.showInfoMessage') };

    TestBed.configureTestingModule({
      providers: [
        CheckTokenService,
        { provide: AuthService, useValue: authService },
        { provide: LocalStorageService, useValue: localStorage },
        { provide: AlertService, useValue: alertService }
      ]
    });
    service = TestBed.inject(CheckTokenService);
  });

  it('does not check expiry or refresh when there is no stored user', () => {
    localStorage.getItem.mockReturnValue(null);

    service.checkTokenValidity();

    expect(localStorage.getItem).toHaveBeenCalledWith(AuthService.STORAGE_KEY);
    expect(authService.isAccessTokenExpiring).not.toHaveBeenCalled();
    expect(authService.refreshToken).not.toHaveBeenCalled();
  });

  it('does not refresh when the access token is not expiring', () => {
    localStorage.getItem.mockReturnValue({});
    authService.isAccessTokenExpiring.mockReturnValue(false);

    service.checkTokenValidity();

    expect(authService.isAccessTokenExpiring).toHaveBeenCalledOnce();
    expect(authService.refreshToken).not.toHaveBeenCalled();
  });

  it('refreshes an expiring token and logs out with an informational alert on failure', () => {
    localStorage.getItem.mockReturnValue({});
    authService.isAccessTokenExpiring.mockReturnValue(true);
    authService.refreshToken.mockReturnValue(throwError(() => new Error('refresh failed')));

    service.checkTokenValidity();

    expect(authService.refreshToken).toHaveBeenCalledOnce();
    expect(alertService.showInfoMessage).toHaveBeenCalledWith('Session expired, please log in again.');
    expect(authService.logOut).toHaveBeenCalledOnce();
  });

  it('does not log out when refresh succeeds', () => {
    localStorage.getItem.mockReturnValue({});
    authService.isAccessTokenExpiring.mockReturnValue(true);
    authService.refreshToken.mockReturnValue(of(undefined));

    service.checkTokenValidity();

    expect(authService.refreshToken).toHaveBeenCalledOnce();
    expect(alertService.showInfoMessage).not.toHaveBeenCalled();
    expect(authService.logOut).not.toHaveBeenCalled();
  });
});
