import { firstValueFrom, of, throwError } from 'rxjs';
import type { MockedObject } from 'vitest';

import { AuthService } from '@services/access/auth.service';
import { AppInitService } from '@services/app-init.service';

describe('AppInitService', () => {
  let service: AppInitService;
  let authService: MockedObject<AuthService>;

  beforeEach(() => {
    authService = {
      autoLogin: vi.fn().mockName('AuthService.autoLogin')
    } as MockedObject<AuthService>;
    service = new AppInitService(authService);
  });

  it('returns the permissions emitted by autoLogin', async () => {
    const permissions = { permUserRead: true };
    const autoLoginResult = of(permissions);
    authService.autoLogin.mockReturnValue(autoLoginResult);

    const result = service.initializeApp();

    expect(result).toBe(autoLoginResult);
    expect(await firstValueFrom(result)).toStrictEqual(permissions);
    expect(authService.autoLogin).toHaveBeenCalledExactlyOnceWith();
  });

  it('passes through a null result when no user is logged in', async () => {
    authService.autoLogin.mockReturnValue(of(null));

    const result = service.initializeApp();

    expect(await firstValueFrom(result)).toBeNull();
    expect(authService.autoLogin).toHaveBeenCalledExactlyOnceWith();
  });

  it('passes through errors from autoLogin', async () => {
    const error = new Error('Auto-login failed');
    authService.autoLogin.mockReturnValue(throwError(() => error));

    const result = service.initializeApp();

    await expect(firstValueFrom(result)).rejects.toBe(error);
    expect(authService.autoLogin).toHaveBeenCalledExactlyOnceWith();
  });
});
