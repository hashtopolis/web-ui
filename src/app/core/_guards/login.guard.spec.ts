import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';

import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

import { AuthData, AuthUser } from '@models/auth-user.model';

import { AuthService } from '@services/access/auth.service';

import { redirectAuthenticatedUser } from '@src/app/core/_guards/login.guard';

describe('login redirectAuthenticatedUser', () => {
  let user: BehaviorSubject<AuthData | null>;
  let navigate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    user = new BehaviorSubject<AuthData | null>(null);
    navigate = vi.fn().mockName('navigate').mockResolvedValue(true);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { user } },
        { provide: Router, useValue: { navigate } }
      ]
    });
  });

  it('allows anonymous users to access login', async () => {
    const result = TestBed.runInInjectionContext(() =>
      redirectAuthenticatedUser(new ActivatedRouteSnapshot(), {} as RouterStateSnapshot)
    );
    await expect(firstValueFrom(result as Observable<boolean>)).resolves.toBe(true);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('redirects authenticated users home', async () => {
    user.next(new AuthUser('token', new Date('2030-01-01'), 1, 'user'));
    const result = TestBed.runInInjectionContext(() =>
      redirectAuthenticatedUser(new ActivatedRouteSnapshot(), {} as RouterStateSnapshot)
    );
    await expect(firstValueFrom(result as Observable<boolean>)).resolves.toBe(false);
    expect(navigate).toHaveBeenCalledExactlyOnceWith(['/']);
  });
});
