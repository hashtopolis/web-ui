import type { MockedObject } from 'vitest';

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { LoginRedirectService } from '@services/access/login-redirect.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

describe('LoginRedirectService', () => {
  let service: LoginRedirectService;
  let router: MockedObject<Router>;
  let storage: MockedObject<LocalStorageService<string>>;

  beforeEach(() => {
    router = { navigate: vi.fn().mockName('Router.navigate').mockResolvedValue(true) } as MockedObject<Router>;
    storage = {
      getItem: vi.fn().mockName('LocalStorageService.getItem'),
      setItem: vi.fn().mockName('LocalStorageService.setItem')
    } as MockedObject<LocalStorageService<string>>;

    TestBed.configureTestingModule({
      providers: [
        LoginRedirectService,
        { provide: Router, useValue: router },
        { provide: LocalStorageService, useValue: storage }
      ]
    });
    service = TestBed.inject(LoginRedirectService);
  });

  it('returns the same user to the supplied redirect URL', () => {
    storage.getItem.mockReturnValue('user-1');

    service.handlePostLoginRedirect('user-1', '/tasks');

    expect(storage.getItem).toHaveBeenCalledExactlyOnceWith('lastLoggedInUser');
    expect(storage.setItem).toHaveBeenCalledExactlyOnceWith('lastLoggedInUser', 'user-1', 0);
    expect(storage.getItem.mock.invocationCallOrder[0]).toBeLessThan(storage.setItem.mock.invocationCallOrder[0]);
    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['/tasks']);
  });

  it('sends a different user to the dashboard', () => {
    storage.getItem.mockReturnValue('user-1');

    service.handlePostLoginRedirect('user-2', '/tasks');

    expect(storage.getItem).toHaveBeenCalledExactlyOnceWith('lastLoggedInUser');
    expect(storage.setItem).toHaveBeenCalledExactlyOnceWith('lastLoggedInUser', 'user-2', 0);
    expect(storage.getItem.mock.invocationCallOrder[0]).toBeLessThan(storage.setItem.mock.invocationCallOrder[0]);
    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['/']);
  });

  it('sends the same user to the dashboard when no redirect URL is supplied', () => {
    storage.getItem.mockReturnValue('user-1');

    service.handlePostLoginRedirect('user-1', '');

    expect(storage.getItem).toHaveBeenCalledExactlyOnceWith('lastLoggedInUser');
    expect(storage.setItem).toHaveBeenCalledExactlyOnceWith('lastLoggedInUser', 'user-1', 0);
    expect(storage.getItem.mock.invocationCallOrder[0]).toBeLessThan(storage.setItem.mock.invocationCallOrder[0]);
    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['/']);
  });

  it('sends a first-time user to the dashboard', () => {
    storage.getItem.mockReturnValue(null);

    service.handlePostLoginRedirect('user-1', '/tasks');

    expect(storage.getItem).toHaveBeenCalledExactlyOnceWith('lastLoggedInUser');
    expect(storage.setItem).toHaveBeenCalledExactlyOnceWith('lastLoggedInUser', 'user-1', 0);
    expect(storage.getItem.mock.invocationCallOrder[0]).toBeLessThan(storage.setItem.mock.invocationCallOrder[0]);
    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['/']);
  });
});
