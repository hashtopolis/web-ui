import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { LoginRedirectService } from '@services/access/login-redirect.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

describe('LoginRedirectService', () => {
  let service: LoginRedirectService;
  let router: { navigate: ReturnType<typeof vi.fn> };
  let localStorage: { getItem: ReturnType<typeof vi.fn>; setItem: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    router = { navigate: vi.fn().mockName('Router.navigate') };
    localStorage = {
      getItem: vi.fn().mockName('LocalStorageService.getItem'),
      setItem: vi.fn().mockName('LocalStorageService.setItem')
    };

    TestBed.configureTestingModule({
      providers: [
        LoginRedirectService,
        { provide: Router, useValue: router },
        { provide: LocalStorageService, useValue: localStorage }
      ]
    });
    service = TestBed.inject(LoginRedirectService);
  });

  it('returns the same user to the supplied redirect URL', () => {
    localStorage.getItem.mockReturnValue('user-1');

    service.handlePostLoginRedirect('user-1', '/tasks');

    expect(localStorage.getItem).toHaveBeenCalledWith('lastLoggedInUser');
    expect(localStorage.setItem).toHaveBeenCalledWith('lastLoggedInUser', 'user-1', 0);
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('sends a different user to the dashboard', () => {
    localStorage.getItem.mockReturnValue('user-1');

    service.handlePostLoginRedirect('user-2', '/tasks');

    expect(localStorage.setItem).toHaveBeenCalledWith('lastLoggedInUser', 'user-2', 0);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('sends the same user to the dashboard when no redirect URL is supplied', () => {
    localStorage.getItem.mockReturnValue('user-1');

    service.handlePostLoginRedirect('user-1', '');

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
