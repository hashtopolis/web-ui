import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { AuthData, AuthUser } from '@models/auth-user.model';

import { AuthService } from '@services/access/auth.service';

import { requireAuth } from '@src/app/core/_guards/auth.guard';

describe('requireAuth', () => {
  let user: BehaviorSubject<AuthData | null>;
  let auth: { user: BehaviorSubject<AuthData | null>; redirectUrl: string };
  let navigate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    user = new BehaviorSubject<AuthData | null>(null);
    auth = { user, redirectUrl: '' };
    navigate = vi.fn().mockName('navigate').mockResolvedValue(true);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: { navigate } }
      ]
    });
  });

  it('allows an authenticated user without redirecting', async () => {
    user.next(new AuthUser('token', new Date('2030-01-01'), 1, 'user'));
    const result = TestBed.runInInjectionContext(() =>
      requireAuth(new ActivatedRouteSnapshot(), { url: '/tasks' } as RouterStateSnapshot)
    );
    await expect(
      firstValueFrom(result as ReturnType<typeof requireAuth> & import('rxjs').Observable<boolean>)
    ).resolves.toBe(true);
    expect(navigate).not.toHaveBeenCalled();
    expect(auth.redirectUrl).toBe('');
  });

  it('stores the requested URL and redirects an anonymous user', async () => {
    const result = TestBed.runInInjectionContext(() =>
      requireAuth(new ActivatedRouteSnapshot(), { url: '/tasks?x=1' } as RouterStateSnapshot)
    );
    await expect(firstValueFrom(result as import('rxjs').Observable<boolean>)).resolves.toBe(false);
    expect(auth.redirectUrl).toBe('/tasks?x=1');
    expect(navigate).toHaveBeenCalledExactlyOnceWith(['/auth']);
  });
});
